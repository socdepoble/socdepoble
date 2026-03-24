import { z } from 'zod';
const uuidRegex = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9._-]+|[A-Z0-9._-]+)$/i;

const MessageSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    conversation_id: z.string().regex(uuidRegex),
    sender_id: z.string().regex(uuidRegex),
    content: z.string().nullable().optional()
});

const payload = {
    conversation_id: "11111111-1111-4111-a111-111111111111",
    sender_id: "11111111-1111-4111-a111-111111111111",
    content: "hi"
};

const result = MessageSchema.parse(payload);
console.log("Keys in result:", Object.keys(result));
