// src/components/keychain/KeychainBackupUI.jsx
import React, { useState } from 'react';
// import QRCode from 'qrcode.react'; // Llibreria lleugera per a QR (placeholder per ara)

const QRCode = ({
  value,
  size
}) => <div style={{
  width: size,
  height: size,
  background: '#eee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
    [QR CODE PLA]
  </div>;
const KeychainBackup = class {
  async createBackup(cryptoKey) {
    return {
      qrCode: 'mock-qr-data-1234567890',
      mnemonic: 'Terreta Masia Poble Olivera Garrofera Sèquia Barranc Llum Foc Pedra Aigua Cel',
      file: 'mock-file-content'
    };
  }
};
const KeychainBackupUI = ({
  cryptoKey
}) => {
  const [backupData, setBackupData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const generateBackup = async () => {
    const keychain = new KeychainBackup();
    const backups = await keychain.createBackup(cryptoKey);
    setBackupData(backups);
    setMnemonic(backups.mnemonic);
    setShowQR(true);
  };
  const downloadKeyFile = () => {
    if (!backupData?.file) return;
    const blob = new Blob([backupData.file], {
      type: 'application/octet-stream'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clauer-masia.sdpkey';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className='keychain-backup p-6 bg-sdp-sdp-bg-surface rounded-lg'>
        <h2 className='text-2xl font-black text-sdp-sdp-accent-blue mb-4'>
          🏚️ Clauer de la Masia
        </h2>
        
        <p className='text-sdp-sdp-text-primary mb-6'>
          Guarda estes còpies de seguretat. Si Safari esborra les teues dades, 
          podràs recuperar la teua identitat sense internet.
        </p>
        
        {!backupData ? <button onClick={generateBackup} className='bg-sdp-color-brasa text-white font-black px-6 py-3 rounded-full hover:bg-orange-700 transition-all'>
            🔐 Generar Còpies de Seguretat
          </button> : <div className="space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <h3 className="font-bold mb-2">📷 Codi QR (imprimeix-lo o fes-li una foto)</h3>
              <div className="inline-block bg-white p-4 rounded-lg">
                <QRCode value={backupData.qrCode} size={200} />
              </div>
            </div>
            
            {/* Frase Mnemònica */}
            <div>
              <h3 className="font-bold mb-2">📝 12 Paraules Secretes (apunta-les en paper)</h3>
              <div className='bg-sdp-sdp-bg-primary p-4 rounded-lg font-mono text-lg text-center'>
                {mnemonic}
              </div>
            </div>
            
            {/* Fitxer .sdpkey */}
            <div className="text-center">
              <h3 className="font-bold mb-2">📁 Fitxer .sdpkey (guarda'l al teu dispositiu)</h3>
              <button onClick={downloadKeyFile} className='bg-sdp-sdp-accent-blue text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all'>
                📥 Descarregar clauer-masia.sdpkey
              </button>
            </div>
          </div>}
      </div>
  );
};
export default KeychainBackupUI;