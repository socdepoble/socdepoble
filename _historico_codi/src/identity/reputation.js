import { verifySignature } from "./identity";

export async function verifyEndorsement(e) {
  return await verifySignature(
    e.from,
    e.signature,
    { value: e.value }
  );
}

export function computeTrust(user) {
  if (!user.endorsements) return 0;
  return user.endorsements.reduce((acc, e) => acc + e.value, 0);
}
