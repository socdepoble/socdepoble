const { z } = require('zod');
const schema = z.object({
  id: z.string().optional(),
  name: z.string()
});
const result = schema.parse({ name: "Testing" });
console.log("Keys in result:", Object.keys(result));
console.log("Has ID?", "id" in result);
