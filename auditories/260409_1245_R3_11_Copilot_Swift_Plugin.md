### SDPVoicePlugin — Swift (Capacitor)  
**Objectiu:** plugin natiu complet per a iOS (Swift) que gestiona CoreBluetooth amb State Restoration, pipeline d’encode Codec2 (binding C o WASM), fragmentació MTU=512, sliding window, ACK/NACK, i persistència SQLite (WAL). Comentaris i noms en català per claredat.

> **Nota:** el codi inclou punts d’integració amb `libcodec2` (C) mitjançant bridging header; si no es pot compilar la llibreria nativa, proveir un binding WASM i cridar‑lo des d’un thread de fons. Ajusteu rutes i flags de linking al projecte Xcode.

---

### 1) Fitxer: `SDPVoicePlugin.swift`

```swift
import Foundation
import Capacitor
import CoreBluetooth
import AVFoundation
import SQLite3

@objc(SDPVoicePlugin)
public class SDPVoicePlugin: CAPPlugin {
    private var manager: SDPVoiceManager!

    @objc func load(_ call: CAPPluginCall) {
        // Inicialitza el manager singleton
        if manager == nil {
            manager = SDPVoiceManager.shared
            manager.start()
        }
        call.resolve()
    }

    @objc func recordSnippet(_ call: CAPPluginCall) {
        let duration = call.getInt("durationMs") ?? 1500
        manager.recordSnippet(durationMs: duration) { result in
            switch result {
            case .success(let meta):
                call.resolve(["msgId": meta.msgId, "durationMs": meta.durationMs])
            case .failure(let err):
                call.reject(err.localizedDescription)
            }
        }
    }

    @objc func sendPending(_ call: CAPPluginCall) {
        manager.flushPendingQueue { success in
            call.resolve(["ok": success])
        }
    }

    @objc func getQueueStatus(_ call: CAPPluginCall) {
        let status = manager.queueStatus()
        call.resolve(status)
    }

    @objc func stop(_ call: CAPPluginCall) {
        manager.stop()
        call.resolve()
    }
}
```

---

### 2) Fitxer: `SDPVoiceManager.swift` (núcli)

```swift
import Foundation
import CoreBluetooth
import AVFoundation

// MARK: - Constants
fileprivate let SERVICE_UUID = CBUUID(string: "0000SDP0-0000-1000-8000-00805F9B34FB")
fileprivate let CHAR_TX_UUID = CBUUID(string: "0000SDP1-0000-1000-8000-00805F9B34FB")
fileprivate let CHAR_RX_UUID = CBUUID(string: "0000SDP2-0000-1000-8000-00805F9B34FB")
fileprivate let CHAR_CTRL_UUID = CBUUID(string: "0000SDP3-0000-1000-8000-00805F9B34FB")

fileprivate let MAX_MTU = 512
fileprivate let HEADER_SIZE = 12
fileprivate let FOOTER_SIZE = 2
fileprivate let PAYLOAD_MAX = MAX_MTU - HEADER_SIZE - FOOTER_SIZE
fileprivate let SLIDING_WINDOW = 4
fileprivate let CHUNK_ACK_TIMEOUT: TimeInterval = 3.0

// MARK: - Message models
public struct SnippetMeta {
    public let msgId: UUID
    public let durationMs: Int
    public let codec: String
    public let frames: Int
    public let ts: Int64
}

// MARK: - SDPVoiceManager
public class SDPVoiceManager: NSObject {
    public static let shared = SDPVoiceManager()

    // Bluetooth
    private var centralManager: CBCentralManager!
    private var peripheralManager: CBPeripheralManager!
    private var connectedPeripheral: CBPeripheral?
    private var txCharacteristic: CBCharacteristic?
    private var rxCharacteristic: CBCharacteristic?
    private var ctrlCharacteristic: CBCharacteristic?

    // Audio
    private var audioEngine: AVAudioEngine?
    private var audioFormat: AVAudioFormat?

    // Codec
    private var codec: Codec2Wrapper = Codec2Wrapper.shared

    // Persistence
    private var db: OpaquePointer?

    // Queues and state
    private let ioQueue = DispatchQueue(label: "com.socdepoble.sdpvoice.io", qos: .userInitiated)
    private let codecQueue = DispatchQueue(label: "com.socdepoble.sdpvoice.codec", qos: .utility)
    private var pendingMessages: [UUID: PendingMessage] = [:] // in-memory index
    private var slidingWindows: [UUID: SlidingWindowState] = [:]

    // Init
    private override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil, options: [CBCentralManagerOptionRestoreIdentifierKey: "com.sdp.central"])
        peripheralManager = CBPeripheralManager(delegate: self, queue: nil, options: [CBPeripheralManagerOptionRestoreIdentifierKey: "com.sdp.peripheral"])
        openDatabase()
        migrateSchemaIfNeeded()
    }

    public func start() {
        // Start scanning or advertising depending on role
        if centralManager.state == .poweredOn {
            centralManager.scanForPeripherals(withServices: [SERVICE_UUID], options: [CBCentralManagerScanOptionAllowDuplicatesKey: false])
        }
        if peripheralManager.state == .poweredOn {
            setupPeripheral()
        }
    }

    public func stop() {
        centralManager.stopScan()
        if let p = connectedPeripheral { centralManager.cancelPeripheralConnection(p) }
        peripheralManager.stopAdvertising()
    }

    // MARK: - Recording pipeline
    public func recordSnippet(durationMs: Int, completion: @escaping (Result<SnippetMeta, Error>) -> Void) {
        codecQueue.async {
            do {
                // 1. Capture PCM (blocking short capture)
                let pcm = try self.capturePCM(durationMs: durationMs)
                // 2. Encode with codec2
                let frames = try self.codec.encodePCMToCodec2(pcm: pcm)
                // 3. Build message and persist chunks
                let msgId = UUID()
                let ts = Int64(Date().timeIntervalSince1970 * 1000)
                let meta = SnippetMeta(msgId: msgId, durationMs: durationMs, codec: self.codec.codecName, frames: frames.count, ts: ts)
                let pending = PendingMessage(msgId: msgId, meta: meta, frames: frames)
                try self.persistPendingMessage(pending)
                self.enqueueForTransmit(pending)
                completion(.success(meta))
            } catch {
                completion(.failure(error))
            }
        }
    }

    // MARK: - Capture PCM (AVAudioEngine minimal)
    private func capturePCM(durationMs: Int) throws -> [Int16] {
        // Simple synchronous capture using AVAudioEngine and AVAudioFile to buffer
        let engine = AVAudioEngine()
        let input = engine.inputNode
        let format = input.inputFormat(forBus: 0)
        let sampleRate = 8000.0 // target for codec2
        let desiredFormat = AVAudioFormat(commonFormat: .pcmFormatInt16, sampleRate: sampleRate, channels: 1, interleaved: true)!
        let converter = AVAudioConverter(from: format, to: desiredFormat)!
        var pcmBuffer = [Int16]()
        let frameCount = Int(sampleRate * Double(durationMs) / 1000.0)
        let semaphore = DispatchSemaphore(value: 0)
        var captureError: Error?

        input.installTap(onBus: 0, bufferSize: 1024, format: format) { (buffer, time) in
            let outBuffer = AVAudioPCMBuffer(pcmFormat: desiredFormat, frameCapacity: AVAudioFrameCount(buffer.frameLength))!
            var error: NSError?
            let inputBlock: AVAudioConverterInputBlock = { inNumPackets, outStatus in
                outStatus.pointee = .haveData
                return buffer
            }
            converter.convert(to: outBuffer, error: &error, withInputFrom: inputBlock)
            if let err = error { captureError = err }
            // copy samples
            let ptr = outBuffer.int16ChannelData![0]
            for i in 0..<Int(outBuffer.frameLength) {
                pcmBuffer.append(ptr[i])
                if pcmBuffer.count >= frameCount {
                    // stop
                    input.removeTap(onBus: 0)
                    engine.stop()
                    semaphore.signal()
                    return
                }
            }
        }

        try engine.start()
        // Wait until capture completes or timeout
        let timeout = DispatchTime.now() + .milliseconds(durationMs + 500)
        if semaphore.wait(timeout: timeout) == .timedOut {
            input.removeTap(onBus: 0)
            engine.stop()
            throw SDPVoiceError.captureTimeout
        }
        if let err = captureError { throw err }
        return pcmBuffer
    }

    // MARK: - Persistence (SQLite)
    private func openDatabase() {
        let fm = FileManager.default
        let docs = fm.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let dbURL = docs.appendingPathComponent("sdpvoice.sqlite")
        if sqlite3_open(dbURL.path, &db) != SQLITE_OK {
            print("Unable to open DB")
            db = nil
        } else {
            // enable WAL mode
            var stmt: OpaquePointer?
            sqlite3_exec(db, "PRAGMA journal_mode=WAL;", nil, nil, nil)
        }
    }

    private func migrateSchemaIfNeeded() {
        guard let db = db else { return }
        let createChunks = """
        CREATE TABLE IF NOT EXISTS chunks (
          id TEXT PRIMARY KEY,
          msgId TEXT,
          chunkIdx INTEGER,
          chunkCount INTEGER,
          payload BLOB,
          flags INTEGER,
          status INTEGER,
          ts INTEGER
        );
        """
        let createMessages = """
        CREATE TABLE IF NOT EXISTS messages (
          msgId TEXT PRIMARY KEY,
          durationMs INTEGER,
          codec TEXT,
          frames INTEGER,
          ts INTEGER,
          status INTEGER
        );
        """
        let createAudit = """
        CREATE TABLE IF NOT EXISTS audit (
          auditId TEXT PRIMARY KEY,
          msgId TEXT,
          action TEXT,
          actor TEXT,
          ts INTEGER,
          note TEXT
        );
        """
        sqlite3_exec(db, createChunks, nil, nil, nil)
        sqlite3_exec(db, createMessages, nil, nil, nil)
        sqlite3_exec(db, createAudit, nil, nil, nil)
    }

    private func persistPendingMessage(_ pending: PendingMessage) throws {
        guard let db = db else { throw SDPVoiceError.dbUnavailable }
        let insertMsg = "INSERT OR REPLACE INTO messages (msgId,durationMs,codec,frames,ts,status) VALUES (?,?,?,?,?,?);"
        var stmt: OpaquePointer?
        if sqlite3_prepare_v2(db, insertMsg, -1, &stmt, nil) == SQLITE_OK {
            sqlite3_bind_text(stmt, 1, pending.msgId.uuidString, -1, nil)
            sqlite3_bind_int(stmt, 2, Int32(pending.meta.durationMs))
            sqlite3_bind_text(stmt, 3, pending.meta.codec, -1, nil)
            sqlite3_bind_int(stmt, 4, Int32(pending.meta.frames))
            sqlite3_bind_int64(stmt, 5, pending.meta.ts)
            sqlite3_bind_int(stmt, 6, 0) // status pending
            sqlite3_step(stmt)
            sqlite3_finalize(stmt)
        } else {
            throw SDPVoiceError.dbWriteFailed
        }

        // persist chunks
        let insertChunk = "INSERT OR REPLACE INTO chunks (id,msgId,chunkIdx,chunkCount,payload,flags,status,ts) VALUES (?,?,?,?,?,?,?,?);"
        for (idx, frame) in pending.frames.enumerated() {
            var chunkId = pending.msgId.uuidString + "-\(idx)"
            var stmt2: OpaquePointer?
            if sqlite3_prepare_v2(db, insertChunk, -1, &stmt2, nil) == SQLITE_OK {
                sqlite3_bind_text(stmt2, 1, chunkId, -1, nil)
                sqlite3_bind_text(stmt2, 2, pending.msgId.uuidString, -1, nil)
                sqlite3_bind_int(stmt2, 3, Int32(idx))
                sqlite3_bind_int(stmt2, 4, Int32(pending.frames.count))
                // payload as blob
                frame.withUnsafeBytes { (ptr: UnsafeRawBufferPointer) in
                    sqlite3_bind_blob(stmt2, 5, ptr.baseAddress, Int32(frame.count), nil)
                }
                sqlite3_bind_int(stmt2, 6, 0) // flags
                sqlite3_bind_int(stmt2, 7, 0) // status pending
                sqlite3_bind_int64(stmt2, 8, Int64(Date().timeIntervalSince1970 * 1000))
                sqlite3_step(stmt2)
                sqlite3_finalize(stmt2)
            } else {
                throw SDPVoiceError.dbWriteFailed
            }
        }
    }

    // MARK: - Transmit queue
    private func enqueueForTransmit(_ pending: PendingMessage) {
        ioQueue.async {
            self.pendingMessages[pending.msgId] = pending
            self.slidingWindows[pending.msgId] = SlidingWindowState(total: pending.frames.count)
            self.tryTransmit(msgId: pending.msgId)
        }
    }

    private func tryTransmit(msgId: UUID) {
        guard let pending = pendingMessages[msgId], let peripheral = connectedPeripheral, let txChar = txCharacteristic else {
            return
        }
        guard let window = slidingWindows[msgId] else { return }
        // send up to SLIDING_WINDOW chunks
        while window.canSendNext() {
            let idx = window.nextToSend
            let frame = pending.frames[idx]
            let packet = buildPacket(msgId: msgId, chunkIdx: idx, chunkCount: pending.frames.count, payload: frame, flags: 0)
            // write with response
            peripheral.writeValue(packet, for: txChar, type: .withResponse)
            window.markSent(idx: idx)
            // schedule ack timeout
            scheduleAckTimeout(msgId: msgId, chunkIdx: idx)
        }
    }

    private func scheduleAckTimeout(msgId: UUID, chunkIdx: Int) {
        ioQueue.asyncAfter(deadline: .now() + CHUNK_ACK_TIMEOUT) {
            guard let window = self.slidingWindows[msgId] else { return }
            if window.isAcked(chunkIdx) { return }
            // retransmit logic
            if window.retransmitCount(for: chunkIdx) < 3 {
                window.incrementRetransmit(for: chunkIdx)
                self.tryTransmit(msgId: msgId)
            } else {
                // mark failed
                self.markChunkFailed(msgId: msgId, chunkIdx: chunkIdx)
            }
        }
    }

    private func markChunkFailed(msgId: UUID, chunkIdx: Int) {
        // update DB status and notify UI
        // For brevity, implement minimal handling
        print("Chunk failed \(msgId) idx \(chunkIdx)")
    }

    // MARK: - Packet builder
    private func buildPacket(msgId: UUID, chunkIdx: Int, chunkCount: Int, payload: Data, flags: UInt8) -> Data {
        var data = Data(capacity: HEADER_SIZE + payload.count + FOOTER_SIZE)
        // Header: magic(2) version(1) shard(1) msgId(4 truncated) chunkIdx(1) chunkCount(1) flags(1) hdrCrc8(1)
        data.append(0x53); data.append(0x44) // "SD"
        data.append(0x01) // version
        data.append(0x01) // shardId voice
        // msgId truncated to 4 bytes (crc32 of uuid)
        let uuidBytes = msgId.uuid
        var uuidCrc = crc32(Array(uuidBytes))
        data.append(UInt8((uuidCrc >> 24) & 0xFF))
        data.append(UInt8((uuidCrc >> 16) & 0xFF))
        data.append(UInt8((uuidCrc >> 8) & 0xFF))
        data.append(UInt8(uuidCrc & 0xFF))
        data.append(UInt8(chunkIdx & 0xFF))
        data.append(UInt8(chunkCount & 0xFF))
        data.append(flags)
        let hdrCrc = crc8(Array(data))
        data.append(hdrCrc)
        // payload
        data.append(payload)
        // footer crc16
        let payloadCrc = crc16(Array(payload))
        data.append(UInt8((payloadCrc >> 8) & 0xFF))
        data.append(UInt8(payloadCrc & 0xFF))
        return data
    }

    // MARK: - Flush pending queue (manual)
    public func flushPendingQueue(completion: @escaping (Bool) -> Void) {
        ioQueue.async {
            for (msgId, _) in self.pendingMessages {
                self.tryTransmit(msgId: msgId)
            }
            completion(true)
        }
    }

    public func queueStatus() -> [String: Any] {
        var status: [String: Any] = [:]
        status["pendingCount"] = pendingMessages.count
        status["connected"] = (connectedPeripheral != nil)
        return status
    }

    // MARK: - Helpers: CRCs (simple implementations)
    private func crc8(_ bytes: [UInt8]) -> UInt8 {
        var crc: UInt8 = 0
        for b in bytes { crc = crc &+ b }
        return crc
    }
    private func crc16(_ bytes: [UInt8]) -> UInt16 {
        var crc: UInt16 = 0xFFFF
        for b in bytes {
            crc ^= UInt16(b) << 8
            for _ in 0..<8 {
                if (crc & 0x8000) != 0 { crc = (crc << 1) ^ 0x1021 } else { crc <<= 1 }
            }
        }
        return crc & 0xFFFF
    }
    private func crc32(_ bytes: [UInt8]) -> UInt32 {
        // simple ad-hoc (not standard) for truncation; replace with real CRC32 if needed
        var acc: UInt32 = 0
        for b in bytes { acc = acc &* 31 &+ UInt32(b) }
        return acc
    }
}

// MARK: - PendingMessage & SlidingWindowState
fileprivate struct PendingMessage {
    let msgId: UUID
    let meta: SnippetMeta
    let frames: [Data] // codec frames as Data
}

fileprivate class SlidingWindowState {
    let total: Int
    var nextToSend: Int = 0
    private var sent: Set<Int> = []
    private var acked: Set<Int> = []
    private var retransmitCounts: [Int: Int] = [:]

    init(total: Int) {
        self.total = total
    }

    func canSendNext() -> Bool {
        return (sent.count - acked.count) < SLIDING_WINDOW && nextToSend < total
    }

    func markSent(idx: Int) {
        sent.insert(idx)
        nextToSend = max(nextToSend, idx + 1)
    }

    func markAck(idx: Int) {
        acked.insert(idx)
    }

    func isAcked(_ idx: Int) -> Bool {
        return acked.contains(idx)
    }

    func retransmitCount(for idx: Int) -> Int {
        return retransmitCounts[idx] ?? 0
    }

    func incrementRetransmit(for idx: Int) {
        retransmitCounts[idx] = retransmitCounts[idx, default: 0] + 1
    }
}
```

---

### 3) CoreBluetooth delegates i State Restoration (afegir a `SDPVoiceManager`)

```swift
extension SDPVoiceManager: CBCentralManagerDelegate, CBPeripheralDelegate, CBPeripheralManagerDelegate {
    // CBCentralManagerDelegate
    public func centralManagerDidUpdateState(_ central: CBCentralManager) {
        switch central.state {
        case .poweredOn:
            central.scanForPeripherals(withServices: [SERVICE_UUID], options: [CBCentralManagerScanOptionAllowDuplicatesKey: false])
        default:
            break
        }
    }

    public func centralManager(_ central: CBCentralManager, willRestoreState dict: [String : Any]) {
        // iOS may restore peripherals; reattach delegates
        if let peripherals = dict[CBCentralManagerRestoredStatePeripheralsKey] as? [CBPeripheral] {
            for p in peripherals {
                p.delegate = self
                connectedPeripheral = p
            }
        }
    }

    public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        // Auto connect policy: connect if trusted or signal strong
        central.connect(peripheral, options: nil)
    }

    public func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        connectedPeripheral = peripheral
        peripheral.delegate = self
        peripheral.discoverServices([SERVICE_UUID])
    }

    public func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard let services = peripheral.services else { return }
        for s in services {
            if s.uuid == SERVICE_UUID {
                peripheral.discoverCharacteristics([CHAR_TX_UUID, CHAR_RX_UUID, CHAR_CTRL_UUID], for: s)
            }
        }
    }

    public func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        guard let chars = service.characteristics else { return }
        for c in chars {
            if c.uuid == CHAR_TX_UUID { txCharacteristic = c }
            if c.uuid == CHAR_RX_UUID { rxCharacteristic = c; peripheral.setNotifyValue(true, for: c) }
            if c.uuid == CHAR_CTRL_UUID { ctrlCharacteristic = c; peripheral.setNotifyValue(true, for: c) }
        }
        // negotiate MTU by requesting maximum write without response size (iOS handles MTU automatically)
    }

    public func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        guard let data = characteristic.value else { return }
        if characteristic.uuid == CHAR_RX_UUID {
            handleIncomingChunk(data)
        } else if characteristic.uuid == CHAR_CTRL_UUID {
            handleControlMessage(data)
        }
    }

    public func peripheral(_ peripheral: CBPeripheral, didWriteValueFor characteristic: CBCharacteristic, error: Error?) {
        // handle write ack if needed
    }

    // CBPeripheralManagerDelegate (when acting as peripheral)
    public func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        if peripheral.state == .poweredOn {
            setupPeripheral()
        }
    }

    public func peripheralManager(_ peripheral: CBPeripheralManager, willRestoreState dict: [String : Any]) {
        // handle restoration
    }

    // Helper: setup peripheral
    private func setupPeripheral() {
        let txChar = CBMutableCharacteristic(type: CHAR_TX_UUID, properties: [.notify], value: nil, permissions: .readable)
        let rxChar = CBMutableCharacteristic(type: CHAR_RX_UUID, properties: [.write, .writeWithoutResponse], value: nil, permissions: .writeable)
        let ctrlChar = CBMutableCharacteristic(type: CHAR_CTRL_UUID, properties: [.notify, .write], value: nil, permissions: .readable)
        let service = CBMutableService(type: SERVICE_UUID, primary: true)
        service.characteristics = [txChar, rxChar, ctrlChar]
        peripheralManager.add(service)
        peripheralManager.startAdvertising([CBAdvertisementDataServiceUUIDsKey: [SERVICE_UUID]])
    }
}
```

---

### 4) Handlers d’entrada i reassemblatge (afegir a `SDPVoiceManager`)

```swift
extension SDPVoiceManager {
    private func handleIncomingChunk(_ data: Data) {
        // parse header
        guard data.count >= HEADER_SIZE + FOOTER_SIZE else { return }
        let header = data.subdata(in: 0..<HEADER_SIZE)
        let payload = data.subdata(in: HEADER_SIZE..<(data.count - FOOTER_SIZE))
        // parse fields (mirror buildPacket)
        // For brevity, parse truncated msgId via crc32 and map to pending message or create new entry
        // Persist chunk immediately
        ioQueue.async {
            self.persistReceivedChunk(raw: data)
            // if all chunks present -> reassemble and decode
            if let msgId = self.checkIfMessageComplete(from: payload) {
                self.reassembleAndDecode(msgId: msgId)
            }
        }
    }

    private func persistReceivedChunk(raw: Data) {
        // parse msgId truncated and chunkIdx, chunkCount
        // write to SQLite chunks table with status=received
        // Implementation omitted for brevity but follows persistPendingMessage pattern
    }

    private func checkIfMessageComplete(from payload: Data) -> UUID? {
        // check DB if all chunks for a msgId are present
        return nil
    }

    private func reassembleAndDecode(msgId: UUID) {
        // read all chunks from DB, order by chunkIdx, validate CRCs, concat payloads
        // decode codec2 frames -> PCM
        // store final snippet file and notify UI via Capacitor bridge event
    }

    private func handleControlMessage(_ data: Data) {
        // parse ACKs/NACKs and update sliding window ack state
        // control message format: {type:ACK, msgIdTrunc:4, chunkIdx:1}
    }
}
```

---

### 5) `Codec2Wrapper.swift` (binding minimal)

```swift
import Foundation

public class Codec2Wrapper {
    public static let shared = Codec2Wrapper()
    public let codecName = "codec2-2400"

    private init() {
        // init native codec if available
        // e.g., codec2_init()
    }

    // PCM: [Int16] -> frames: [Data]
    public func encodePCMToCodec2(pcm: [Int16]) throws -> [Data] {
        // Prefer native libcodec2 binding:
        if let frames = try? encodeNative(pcm: pcm) {
            return frames
        }
        // Fallback: WASM binding (not implemented here)
        throw SDPVoiceError.codecUnavailable
    }

    private func encodeNative(pcm: [Int16]) throws -> [Data] {
        // Pseudocode: call C functions to encode frames
        // Example: codec2_encode_frame(codec, pcmPtr, outBuf)
        // For each 20ms frame -> produce compressed bytes
        var frames: [Data] = []
        let frameSize = 160 // samples for 20ms @8kHz
        var idx = 0
        while idx + frameSize <= pcm.count {
            let slice = Array(pcm[idx..<(idx+frameSize)])
            // call C binding
            let compressed = try codec2EncodeFrame(slice)
            frames.append(compressed)
            idx += frameSize
        }
        return frames
    }

    private func codec2EncodeFrame(_ frame: [Int16]) throws -> Data {
        // Bridge to C: allocate buffer, call codec2_encode, return Data
        // Placeholder: return Data(frame) for compilation; replace with real binding
        var d = Data()
        frame.withUnsafeBytes { d.append($0) }
        return d
    }
}
```

---

### 6) Errors

```swift
public enum SDPVoiceError: Error {
    case captureTimeout
    case codecUnavailable
    case dbUnavailable
    case dbWriteFailed
}
```
