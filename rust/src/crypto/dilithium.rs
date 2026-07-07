use core::sync::atomic::{AtomicU8, Ordering};
use super::ntt::*;

static MODE: AtomicU8 = AtomicU8::new(0); // 0=indet,1=scalBar,2=scalMont,3=simd

pub fn ntt(a: &mut [i32]) {
    match MODE.load(Ordering::Relaxed) {
        1 => ntt_barrett(a),
        2 => ntt_montgomery(a),
        3 => ntt_simd(a),
        _ => {
            let t0 = instant(); 
            ntt_montgomery(a); 
            let t1 = instant();
            let t_mont = t1-t0;
            let t_bar = bench(|| ntt_barrett(a));
            let t_sim = if has_simd() { bench(|| ntt_simd(a)) } else { 9999 };
            let millor = if t_bar <= t_mont && t_bar <= t_sim { 1 }
                         else if t_mont <= t_bar && t_mont <= t_sim { 2 }
                         else { 3 };
            MODE.store(millor, Ordering::Relaxed);
        }
    }
}
