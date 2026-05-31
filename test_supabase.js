import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://adjlvwtxhpclgmnsvwpm.supabase.co', 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9');
async function test() {
  const { data, error } = await supabase.from('towns').select('id, name');
  if (error) console.error(error);
  console.log(data);
}
test();
