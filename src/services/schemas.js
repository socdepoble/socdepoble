import { z } from 'zod';

export const PostSchema = z.object({
    id: z.string().uuid().optional(),
    content: z.string().min(1, "El contingut no pot estar buit"),
    author_id: z.string().uuid(),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    author_role: z.string().optional(),
    town_uuid: z.string().uuid().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().uuid().nullable().optional()
});

export const MarketItemSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, "El títol és obligatori"),
    description: z.string().optional(),
    price: z.number().min(0),
    category_slug: z.string().default('tot'),
    author_id: z.string().uuid(),
    author_name: z.string().min(1),
    author_avatar_url: z.string().url().nullable().optional(),
    town_uuid: z.string().uuid().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    is_playground: z.boolean().optional(),
    entity_id: z.string().uuid().nullable().optional(),
    is_active: z.boolean().default(true)
});

export const MessageSchema = z.object({
    id: z.string().uuid().optional(),
    conversation_id: z.string().uuid(),
    sender_id: z.string().uuid(),
    sender_entity_id: z.string().uuid().nullable().optional(),
    content: z.string().nullable().optional(), // Now optional if there's an attachment
    attachment_url: z.string().url().nullable().optional(),
    attachment_type: z.string().nullable().optional(),
    attachment_name: z.string().nullable().optional(),
    is_ai: z.boolean().optional(),
    is_read: z.boolean().optional()
}).refine(data => data.content || data.attachment_url, {
    message: "El missatge no pot estar buit si no hi ha fitxer adjunt"
});

export const ProfileSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string().min(1).nullable().optional(),
    username: z.string().min(3).nullable().optional(),
    avatar_url: z.string().url().nullable().optional(),
    cover_url: z.string().url().nullable().optional(),
    bio: z.string().nullable().optional(),
    primary_town: z.string().nullable().optional(),
    town_uuid: z.string().uuid().nullable().optional(),
    role: z.string().optional()
});
