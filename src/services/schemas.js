import { z } from 'zod';
import DOMPurify from 'dompurify';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;
const sanitize = (val) => typeof val === 'string' ? DOMPurify.sanitize(val, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : val;

export const PostSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    content: z.string().min(1, "El contingut no pot estar buit").transform(sanitize),
    author_id: z.string().regex(uuidRegex, "ID d'autor invàlid"),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    author_role: z.string().optional(),
    town_uuid: z.string().regex(uuidRegex).nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().regex(uuidRegex).nullable().optional()
});

export const MarketItemSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    title: z.string().min(1, "El títol és obligatori").transform(sanitize),
    description: z.string().optional().transform(sanitize),
    price: z.number().min(0),
    category_slug: z.string().default('tot'),
    author_id: z.string().regex(uuidRegex, "ID d'autor invàlid"),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    town_uuid: z.string().regex(uuidRegex).nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().regex(uuidRegex).nullable().optional(),
    is_active: z.boolean().default(true)
});

export const MessageSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    conversation_id: z.string().regex(uuidRegex),
    sender_id: z.string().regex(uuidRegex),
    sender_entity_id: z.string().regex(uuidRegex).nullable().optional(),
    content: z.string().nullable().optional().transform(sanitize),
    attachment_url: z.string().url().nullable().optional(),
    attachment_type: z.string().nullable().optional(),
    attachment_name: z.string().nullable().optional(),
    is_ai: z.boolean().optional(),
    is_read: z.boolean().optional(),
    is_playground: z.boolean().optional()
}).refine(data => data.content || data.attachment_url, {
    message: "El missatge no pot estar buit si no hi ha fitxer adjunt"
});

export const ConversationSchema = z.object({
    id: z.string().regex(uuidRegex).optional(),
    participant_1_id: z.string().regex(uuidRegex),
    participant_1_type: z.enum(['user', 'entity']),
    participant_2_id: z.string().regex(uuidRegex),
    participant_2_type: z.enum(['user', 'entity']),
    last_message_content: z.string().nullable().optional().transform(sanitize),
    last_message_at: z.string().optional(),
    is_playground: z.boolean().optional()
});

export const ProfileSchema = z.object({
    id: z.string().regex(uuidRegex),
    full_name: z.string().min(1).nullable().optional().transform(sanitize),
    username: z.string().min(3).nullable().optional().transform(sanitize),
    avatar_url: z.string().url().nullable().optional(),
    cover_url: z.string().url().nullable().optional(),
    bio: z.string().nullable().optional().transform(sanitize),
    primary_town: z.string().nullable().optional().transform(sanitize),
    town_uuid: z.string().regex(uuidRegex).nullable().optional(),
    role: z.string().optional(),
    ofici: z.string().nullable().optional().transform(sanitize),
    social_image_preference: z.enum(['avatar', 'cover', 'none']).default('none').optional()
});
