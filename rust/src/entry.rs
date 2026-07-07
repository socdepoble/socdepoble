#![no_std]
use core::panic::catch_unwind;
use crate::allocator::HeapGuard;

#[no_mangle]
pub extern "C" fn validate_json(ptr: *const u8, len: usize) -> i32 {
    let _g = HeapGuard; // ✅ RESET GARANTIT QUAN SURT DE L'ÀMBIT
    let bytes = unsafe { core::slice::from_raw_parts(ptr, len) };
    let res = catch_unwind(|| crate::parser::run(bytes));
    match res {
        Err(_) => -99, // ✅ PANIC ATRAPAT, MAI ES QUEDA PENJAT
        Ok(Ok(())) => 0,
        Ok(Err(e)) => e.code(),
    }
}
