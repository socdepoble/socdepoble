import * as Y from "yjs";

 
export function connectWebRTC(doc, room) {
  const pc = new RTCPeerConnection();
  const channel = pc.createDataChannel("yjs");

  channel.onmessage = (event) => {
    const update = new Uint8Array(event.data);
    Y.applyUpdate(doc, update);
  };

  doc.on("update", (update) => {
    if(channel.readyState === "open") {
      channel.send(update);
    }
  });

  return { pc, channel };
}
