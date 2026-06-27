import * as Y from "yjs";

export function createBarterDoc() {
  const doc = new Y.Doc();
  const offers = doc.getMap("offers");
  return { doc, offers };
}

export function createOffer(offers, identity, data) {
  const id = crypto.randomUUID();

  const offer = {
    id,
    title: data.title,
    description: data.description,
    createdAt: Date.now(),
    owner: identity.publicKey,
    status: "open",
  };

  offers.set(id, offer);

  return id;
}

export function updateTrustScore(user, delta) {
  const current = user.trust || 0;
  user.trust = Math.max(-100, Math.min(100, current + delta));
}
