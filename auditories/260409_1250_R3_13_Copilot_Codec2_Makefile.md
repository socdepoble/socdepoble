### Implementació Swift: `Codec2Wrapper.decodeFramesToPCM(frames:)`

```swift
import Foundation

// Assumim que Bridging-Header exposa:
// codec2_handle_t codec2_wrapper_create(const char* mode);
// void codec2_wrapper_destroy(codec2_handle_t handle);
// int codec2_wrapper_decode_frame(codec2_handle_t handle, const uint8_t* inBuf, int inLen, int16_t* outPcm, int frameSamples);
// int codec2_wrapper_frame_samples(codec2_handle_t handle);
// int codec2_wrapper_max_bytes_per_frame(codec2_handle_t handle);

public extension Codec2Wrapper {

    /// Decodifica una llista de frames (cada frame = Data amb bytes comprimits) a PCM Int16.
    /// - Paràmetres:
    ///   - frames: array de Data amb cada frame comprimit (ordre correcte).
    /// - Retorna: array d'Int16 amb mostres PCM concatenades (8kHz mono).
    /// - Llança: SDPVoiceError.codecUnavailable o SDPVoiceError.decodeFailed
    func decodeFramesToPCM(frames: [Data]) throws -> [Int16] {
        // 1) Inicialitzacions i validacions
        guard !frames.isEmpty else { return [] }
        // Crear handle natiu si no existeix
        let mode = "2400" // o llegir de configuració
        guard let handle = codec2_create_handle_ifNeeded(mode: mode) else {
            throw SDPVoiceError.codecUnavailable
        }

        // 2) Obtenir paràmetres del codec
        let frameSamples = Int(codec2_wrapper_frame_samples(handle)) // ex. 160
        let maxBytesPerFrame = Int(codec2_wrapper_max_bytes_per_frame(handle)) // ex. 64

        // 3) Pre-allocar buffer de sortida (conservador)
        // Cada frame decodificat produeix `frameSamples` mostres (Int16)
        let totalSamples = frames.count * frameSamples
        var pcmOut = [Int16](repeating: 0, count: totalSamples)

        // 4) Decodificar frame per frame en un thread de codec (ja s'espera que cridi des de codecQueue)
        var sampleOffset = 0
        for (i, frameData) in frames.enumerated() {
            // Validació de mida
            if frameData.count == 0 || frameData.count > maxBytesPerFrame {
                // si la mida excedeix, intentar decodificar igual; però marcar advertència
            }

            // Preparar buffers C
            let inLen = Int32(frameData.count)
            // allocate temporary buffer per a la sortida de la crida C
            let outCount = frameSamples
            // Use withUnsafeBytes per passar punter a C
            let decodeResult: Int32 = frameData.withUnsafeBytes { (inPtr: UnsafeRawBufferPointer) -> Int32 in
                guard let inBase = inPtr.bindMemory(to: UInt8.self).baseAddress else { return -1 }
                // out buffer pointer
                return pcmOut.withUnsafeMutableBytes { (outPtr: UnsafeMutableRawBufferPointer) -> Int32 in
                    guard let outBase = outPtr.bindMemory(to: Int16.self).baseAddress?.advanced(by: sampleOffset) else { return -1 }
                    // crida C: retorna nombre de samples escrits o -1
                    let ret = codec2_wrapper_decode_frame(handle, inBase, Int32(inLen), outBase, Int32(frameSamples))
                    return ret
                }
            }

            if decodeResult < 0 {
                // Error de decodificació: intentar recuperar (skip frame) o llençar
                // Marcar audit i continuar amb zeros per no trencar la seqüència
                print("codec2 decode error frame \(i) len=\(frameData.count)")
                // Opcional: llançar error si preferim fallida dura
                throw SDPVoiceError.decodeFailed
            } else {
                // Avançar offset
                sampleOffset += Int(decodeResult)
            }
        }

        // 5) Si el nombre real de samples escrits és menor que l'assignat, retallar l'array
        if sampleOffset < pcmOut.count {
            pcmOut.removeSubrange(sampleOffset..<pcmOut.count)
        }

        // 6) Retornar PCM
        return pcmOut
    }

    // MARK: - Helpers per a gestionar handle natiu (singleton per instància)
    private func codec2_create_handle_ifNeeded(mode: String) -> UnsafeMutableRawPointer? {
        // Mantindrem un handle intern per a la instància Codec2Wrapper
        // Aquest mètode crea el handle si no existeix i el retorna
        if let existing = self.nativeHandle { return existing }
        // create C handle
        guard let cstr = mode.cString(using: .utf8) else { return nil }
        guard let h = codec2_wrapper_create(cstr) else { return nil }
        self.nativeHandle = h
        return h
    }

    private func codec2_destroy_handle_ifNeeded() {
        if let h = self.nativeHandle {
            codec2_wrapper_destroy(h)
            self.nativeHandle = nil
        }
    }

    // Emmagatzematge intern del handle (propietat privada)
    private var nativeHandleKey: UnsafeRawPointer { return UnsafeRawPointer(bitPattern: "codec2_handle_key".hashValue)! }
    private var nativeHandle: UnsafeMutableRawPointer? {
        get {
            return objc_getAssociatedObject(self, nativeHandleKey) as? UnsafeMutableRawPointer
        }
        set {
            objc_setAssociatedObject(self, nativeHandleKey, newValue, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        }
    }
}
```

**Notes d'implementació i bones pràctiques**
- Crida `decodeFramesToPCM` sempre des d’un `codecQueue` (thread de fons) per evitar bloquejar el main thread.
- `codec2_wrapper_decode_frame` espera la mida de frame correcta; si el protocol concatena frames amb longitud variable, caldrà passar límits explícits o prefixar cada frame amb la seva mida.
- Gestiona la vida del `nativeHandle` (crear al primer ús, destruir en `deinit` o `stop()`).
- Si vols tolerància a errors, en lloc de llençar `decodeFailed` pots omplir amb zeros i continuar, i registrar l'error a `audit`.

---

### Snippet Makefile / xcodebuild per compilar `libcodec2` per iOS arm64 i generar XCFramework

```makefile
# Makefile per compilar libcodec2 per iOS (device arm64) i crear XCFramework
# Requereix Xcode command line tools i xarxa per clonar repo codec2
# Ajusta VERSION, TARGET_SDK i RUSTFLAGS si cal

REPO = https://github.com/drowe67/codec2.git
SRC_DIR = codec2-src
BUILD_DIR = build
IOS_SDK = iphoneos
SIM_SDK = iphonesimulator
ARCH_DEVICE = arm64
ARCH_SIM = x86_64 arm64 # simulador modern amb arm64
MIN_IOS = 12.0
LIB_NAME = libcodec2.a
XCFRAMEWORK = codec2.xcframework

.PHONY: all clean fetch build-device build-sim xcframework

all: fetch build-device build-sim xcframework

fetch:
	@if [ ! -d "$(SRC_DIR)" ]; then \
		git clone --depth 1 $(REPO) $(SRC_DIR); \
	else \
		echo "source exists"; \
	fi

# Build for device (arm64)
build-device:
	@mkdir -p $(BUILD_DIR)/device
	@cd $(SRC_DIR) && \
		export CC="$(shell xcrun --sdk $(IOS_SDK) -f clang)" && \
		export CFLAGS="-isysroot $(shell xcrun --sdk $(IOS_SDK) --show-sdk-path) -arch $(ARCH_DEVICE) -miphoneos-version-min=$(MIN_IOS) -O3 -fembed-bitcode" && \
		./autogen.sh || true; \
		./configure --host=arm-apple-darwin --prefix=$(PWD)/../$(BUILD_DIR)/device CFLAGS="$$CFLAGS" && \
		make -j$(shell sysctl -n hw.ncpu) && make install

# Build for simulator (x86_64 + arm64)
build-sim:
	@mkdir -p $(BUILD_DIR)/sim
	@cd $(SRC_DIR) && \
		export SDKPATH="$(shell xcrun --sdk $(SIM_SDK) --show-sdk-path)" && \
		# build for x86_64
		export CC="$(shell xcrun --sdk $(SIM_SDK) -f clang) -arch x86_64" && \
		export CFLAGS="-isysroot $$SDKPATH -arch x86_64 -mios-simulator-version-min=$(MIN_IOS) -O3" && \
		./configure --host=x86_64-apple-darwin --prefix=$(PWD)/../$(BUILD_DIR)/sim/x86_64 CFLAGS="$$CFLAGS" && \
		make -j$(shell sysctl -n hw.ncpu) && make install && \
		# build for arm64 simulator (Apple Silicon)
		export CC="$(shell xcrun --sdk $(SIM_SDK) -f clang) -arch arm64" && \
		export CFLAGS="-isysroot $$SDKPATH -arch arm64 -mios-simulator-version-min=$(MIN_IOS) -O3" && \
		./configure --host=arm-apple-darwin --prefix=$(PWD)/../$(BUILD_DIR)/sim/arm64 CFLAGS="$$CFLAGS" && \
		make -j$(shell sysctl -n hw.ncpu) && make install

# Create XCFramework from built static libs
xcframework:
	@mkdir -p $(BUILD_DIR)/xcframework
	@echo "Creating universal libs and XCFramework..."
	# device lib
	@DEVICE_LIB=$(BUILD_DIR)/device/lib/$(LIB_NAME); \
	SIM_X86_LIB=$(BUILD_DIR)/sim/x86_64/lib/$(LIB_NAME); \
	SIM_ARM_LIB=$(BUILD_DIR)/sim/arm64/lib/$(LIB_NAME); \
	# create fat simulator lib (x86_64 + arm64)
	lipo -create -output $(BUILD_DIR)/sim/libcodec2_sim.a $$SIM_X86_LIB $$SIM_ARM_LIB || true; \
	# create XCFramework
	xcodebuild -create-xcframework \
		-library $$DEVICE_LIB -headers $(SRC_DIR)/include \
		-library $(BUILD_DIR)/sim/libcodec2_sim.a -headers $(SRC_DIR)/include \
		-output $(BUILD_DIR)/$(XCFRAMEWORK)
	@echo "XCFramework at $(BUILD_DIR)/$(XCFRAMEWORK)"

clean:
	@rm -rf $(SRC_DIR) $(BUILD_DIR)
```

#### Notes i passos pràctics per ús
1. **Requisits**: `autoconf`, `automake`, `libtool` si el repo usa autotools. Ajusta `./autogen.sh` i `./configure` segons el repo real de `libcodec2`.
2. **Flags**: `-fembed-bitcode` pot ser necessari segons la política d'Apple; si no vols bitcode, elimina'l.
3. **Simulador arm64**: en Macs Apple Silicon cal compilar arm64 per simulador; el Makefile crea un `libcodec2_sim.a` amb `lipo`.
4. **Headers**: assegura't que `$(SRC_DIR)/include` conté els headers públics; si no, ajusta la ruta.
5. **XCFramework**: el resultat `codec2.xcframework` s'integra fàcilment a Xcode (drag & drop).
6. **Errors comuns**: si `configure` no suporta `--host` per a arm-apple-darwin, caldrà crear un toolchain o usar un Xcode project que compili la llibreria com a target estàtic.
