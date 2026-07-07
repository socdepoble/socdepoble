use crate::sha256::Sha256;

const DOMINIO: &[u8] = b"SOC_DE_POBLE_V5";
const SEP: u8 = 0x1F; // SEPARADOR UNIC DE LONGITUD

pub fn sign(sk: &[u8], kind: &[u8], data: &[u8]) -> [u8;64] {
    let mut h = Sha256::new();
    let epoch = crate::time::epoch_secs();
    // ✅ NINGÚ PODRÀ REUTILITZAR A UN ALTRE CAMP / DATA
    h.update(DOMINIO); h.update(&[SEP]);
    h.update(kind);    h.update(&[SEP]);
    h.update(&epoch.to_be_bytes()); h.update(&[SEP]);
    h.update(data);
    schnorr::sign(sk, h.finalize().as_slice())
}
