import { supabaseService } from '../src/core/services/supabaseService.js';
import { marketService } from '../src/core/services/marketService.js';

async function test() {
  console.log("Testing getPosts...");
  try {
    const res = await supabaseService.getPosts('tot', null, 0, 5);
    console.log("getPosts success:", res.data?.length);
  } catch (e) {
    console.error("getPosts Error:", e);
  }

  console.log("Testing getMarketItems...");
  try {
    const res = await marketService.getMarketItems('tot', null, 0, 5);
    console.log("getMarketItems success:", res.data?.length);
  } catch (e) {
    console.error("getMarketItems Error:", e);
  }

  console.log("Testing getTowns...");
  try {
    const res = await supabaseService.getTowns();
    console.log("getTowns success:", res.length);
  } catch (e) {
    console.error("getTowns Error:", e);
  }
}
test();
