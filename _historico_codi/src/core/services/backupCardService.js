import QRCode from 'qrcode';

export async function generateBackupCard(backupJson, userName) {
  const canvas = document.createElement('canvas');
  canvas.width  = 600;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');

  // Fondo blanco limpio
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 600, 380);

  // Franja de color identificativa (Naranja de Sóc de Poble)
  ctx.fillStyle = '#f97316'; 
  ctx.fillRect(0, 0, 600, 8);
  ctx.fillRect(0, 372, 600, 8);

  // QR code (izquierda)
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, backupJson, {
    width: 220,
    margin: 1,
    errorCorrectionLevel: 'M', // M es suficiente para este tamaño de payload
  });
  ctx.drawImage(qrCanvas, 24, 40, 220, 220);

  // Texto instructivo (derecha)
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 22px system-ui';
  ctx.fillText('🔑 Clau de Seguretat', 270, 65);

  ctx.font = '16px system-ui';
  ctx.fillStyle = '#374151';
  const lines = [
    `Usuari: ${userName}`,
    `Data: ${new Date().toLocaleDateString('ca-ES')}`,
    '',
    '📌 INSTRUCCIONS:',
    '1. Guarda aquesta imatge a la galeria.',
    "2. Si perds l'accés, obre l'app,",
    '   prem "Recuperar amb QR" i',
    '   escaneja aquesta targeta.',
    '3. Necessitaràs el teu PIN.',
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, 270, 100 + i * 24);
  });

  // Pie de página
  ctx.font = '12px system-ui';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Sóc de Poble · Sobirania digital rural', 24, 355);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

export async function saveBackupCardToGallery(pngBlob, userName) {
  const fileName = `clau-sobirania-${userName.replace(/\\s/g, '-')}.png`;
  const file = new File([pngBlob], fileName, { type: 'image/png' });

  // Camino preferido en móvil: Web Share API
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'La meua Clau de Sobirania Digital',
      text: 'Guarda aquesta imatge per a recuperar el teu compte a Sóc de Poble.',
      files: [file],
    });
    return 'shared';
  }

  // Fallback: Descarga directa (Desktop y Chrome en algunos Android sin Share API para archivos)
  const url = URL.createObjectURL(pngBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
