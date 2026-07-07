#![no_std]
use core::sync::atomic::{AtomicUsize, Ordering};

pub const HEAP_SIZE: usize = 128 * 1024;
const ALIGN: usize = 16;
static IN_USE: AtomicUsize = AtomicUsize::new(0);

#[repr(align(16))]
#[used] // ✅ EVITA QUE L'OPTIMITZADOR BAIXI L'ALINEACIÓ A 8B
static mut HEAP: [u8; HEAP_SIZE] = [0; HEAP_SIZE];
static mut HEAP_POS: usize = 0;

pub struct HeapGuard;
impl Drop for HeapGuard {
    #[inline(always)]
    fn drop(&mut self) {
        unsafe { HEAP_POS = 0; } // ✅ RESET SEMPRE, BÉ O MALAMENT
        IN_USE.store(0, Ordering::Release);
    }
}

#[no_mangle]
pub unsafe extern "C" fn reset_heap() { unsafe { HEAP_POS = 0; } }

#[no_mangle]
pub unsafe extern "C" fn alloc(n: usize) -> *mut u8 {
    if IN_USE.swap(1, Ordering::Acquire) == 1 { return core::ptr::null_mut(); }
    unsafe {
        let start = (HEAP_POS + ALIGN - 1) & !(ALIGN - 1);
        if start + n > HEAP_SIZE {
            IN_USE.store(0, Ordering::Release);
            return core::ptr::null_mut();
        }
        HEAP_POS = start + n;
        HEAP.as_mut_ptr().add(start)
    }
}
