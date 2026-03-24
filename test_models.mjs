fetch('https://adjlvwtxhpclgmnsvwpm.supabase.co/functions/v1/gemini-proxy')
  .then(r => r.json())
  .then(data => {
      console.log("Total models:", data.models?.length);
      console.log("Gemini models:");
      data.models?.filter(m => m.name.includes("gemini")).forEach(m => console.log(m.name));
  })
  .catch(console.error);
