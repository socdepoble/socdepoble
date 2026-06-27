export async function startBLE() {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: ["battery_service"],
  });

  const server = await device.gatt.connect();

  return server;
}

export async function broadcastMessage(server, message) {
  const service = await server.getPrimaryService("battery_service");
  const characteristic = await service.getCharacteristic(
    "battery_level"
  );

  const encoder = new TextEncoder();
  await characteristic.writeValue(encoder.encode(message));
}
