import { z } from 'zod';

export const PostSchema = z.object({
    id: z.string().min(1).optional(),
    content: z.string().min(1, "El contingut no pot estar buit"),
    author_id: z.string().min(1),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    author_role: z.string().optional(),
    town_uuid: z.string().min(1).nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().min(1).nullable().optional()
});

export const MarketItemSchema = z.object({
    id: z.string().min(1).optional(),
    title: z.string().min(1, "El títol és obligatori"),
    description: z.string().optional(),
    price: z.number().min(0),
    category_slug: z.string().default('tot'),
    author_id: z.string().min(1),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    town_uuid: z.string().min(1).nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().min(1).nullable().optional(),
    is_active: z.boolean().default(true)
});

export const MessageSchema = z.object({
    id: z.string().min(1).optional(),
    conversation_id: z.string().min(1),
    sender_id: z.string().min(1),
    sender_entity_id: z.string().min(1).nullable().optional(),
    content: z.string().nullable().optional(), // Now optional if there's an attachment
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
    id: z.string().min(1).optional(),
    participant_1_id: z.string().min(1),
    participant_1_type: z.enum(['user', 'entity']),
    participant_2_id: z.string().min(1),
    participant_2_type: z.enum(['user', 'entity']),
    last_message_content: z.string().nullable().optional(),
    last_message_at: z.string().optional(),
    is_playground: z.boolean().optional()
});

export const ProfileSchema = z.object({
    id: z.string().min(1),
    full_name: z.string().min(1).nullable().optional(),
    username: z.string().min(3).nullable().optional(),
    avatar_url: z.string().url().nullable().optional(),
    cover_url: z.string().url().nullable().optional(),
    bio: z.string().nullable().optional(),
    primary_town: z.string().nullable().optional(),
    town_uuid: z.string().min(1).nullable().optional(),
    role: z.string().optional(),
    ofici: z.string().nullable().optional(),
    social_image_preference: z.enum(['avatar', 'cover', 'none']).default('none').optional()
});
