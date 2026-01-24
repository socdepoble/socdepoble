import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

/**
 * Service per gestionar xats de grup
 */
export const groupChatService = {
    /**
     * Crear un nou grup
     */
    async createGroup(creatorId, name, description = null, memberIds = []) {
        try {
            // 1. Create group
            const { data: group, error: groupError } = await supabase
                .from('group_chats')
                .insert({
                    name,
                    description,
                    created_by: creatorId
                })
                .select()
                .single();

            if (groupError) throw groupError;

            // 2. Add additional members (creator is auto-added by trigger)
            if (memberIds.length > 0) {
                const members = memberIds
                    .filter(id => id !== creatorId) // Don't duplicate creator
                    .map(userId => ({
                        group_id: group.id,
                        user_id: userId,
                        role: 'member'
                    }));

                if (members.length > 0) {
                    const { error: membersError } = await supabase
                        .from('group_members')
                        .insert(members);

                    if (membersError) {
                        logger.error('[GroupChat] Error adding members:', membersError);
                        // Don't throw, group is created, just log the error
                    }
                }
            }

            logger.log('[GroupChat] Group created:', group.id);
            return group;
        } catch (error) {
            logger.error('[GroupChat] Error creating group:', error);
            throw error;
        }
    },

    /**
     * Obtenir informació d'un grup
     */
    async getGroup(groupId) {
        try {
            const { data, error } = await supabase
                .rpc('get_group_with_stats', { p_group_id: groupId });

            if (error) throw error;
            return data?.[0] || null;
        } catch (error) {
            logger.error('[GroupChat] Error fetching group:', error);
            return null;
        }
    },

    /**
     * Obtenir tots els grups de l'usuari
     */
    async getUserGroups(userId) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    group_id,
                    role,
                    joined_at,
                    last_read_at,
                    group_chats (
                        id,
                        name,
                        description,
                        avatar_url,
                        created_by,
                        created_at,
                        updated_at,
                        is_active
                    )
                `)
                .eq('user_id', userId)
                .order('joined_at', { ascending: false });

            if (error) throw error;

            // Flatten structure
            const groups = data?.map(item => ({
                ...item.group_chats,
                user_role: item.role,
                joined_at: item.joined_at
            })) || [];

            return groups;
        } catch (error) {
            logger.error('[GroupChat] Error fetching user groups:', error);
            return [];
        }
    },

    /**
     * Actualitzar informació del grup
     */
    async updateGroup(groupId, updates) {
        try {
            const { data, error } = await supabase
                .from('group_chats')
                .update(updates)
                .eq('id', groupId)
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Group updated:', groupId);
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error updating group:', error);
            throw error;
        }
    },

    /**
     * Eliminar grup (només creador)
     */
    async deleteGroup(groupId) {
        try {
            const { error } = await supabase
                .from('group_chats')
                .delete()
                .eq('id', groupId);

            if (error) throw error;
            logger.log('[GroupChat] Group deleted:', groupId);
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error deleting group:', error);
            return false;
        }
    },

    /**
     * Obtenir membres del grup
     */
    async getGroupMembers(groupId) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .select(`
                    id,
                    user_id,
                    role,
                    joined_at,
                    notifications_enabled,
                    profiles (
                        id,
                        full_name,
                        username,
                        avatar_url
                    )
                `)
                .eq('group_id', groupId)
                .order('role', { ascending: false }) // Admins first
                .order('joined_at', { ascending: true });

            if (error) throw error;

            // Flatten structure
            const members = data?.map(item => ({
                id: item.id,
                user_id: item.user_id,
                role: item.role,
                joined_at: item.joined_at,
                notifications_enabled: item.notifications_enabled,
                ...item.profiles
            })) || [];

            return members;
        } catch (error) {
            logger.error('[GroupChat] Error fetching members:', error);
            return [];
        }
    },

    /**
     * Afegir membres al grup
     */
    async addMembers(groupId, userIds) {
        try {
            const members = userIds.map(userId => ({
                group_id: groupId,
                user_id: userId,
                role: 'member'
            }));

            const { data, error } = await supabase
                .from('group_members')
                .insert(members)
                .select();

            if (error) throw error;
            logger.log('[GroupChat] Members added:', data.length);
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error adding members:', error);
            throw error;
        }
    },

    /**
     * Eliminar membre del grup
     */
    async removeMember(groupId, userId) {
        try {
            const { error } = await supabase
                .from('group_members')
                .delete()
                .match({ group_id: groupId, user_id: userId });

            if (error) throw error;
            logger.log('[GroupChat] Member removed');
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error removing member:', error);
            return false;
        }
    },

    /**
     * Sortir del grup (voluntàriament)
     */
    async leaveGroup(groupId, userId) {
        return this.removeMember(groupId, userId);
    },

    /**
     * Canviar rol d'un membre
     */
    async updateMemberRole(groupId, userId, role) {
        try {
            const { data, error } = await supabase
                .from('group_members')
                .update({ role })
                .match({ group_id: groupId, user_id: userId })
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Member role updated');
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error updating role:', error);
            throw error;
        }
    },

    /**
     * Enviar missatge al grup
     */
    async sendGroupMessage(groupId, senderId, content, attachmentUrl = null) {
        try {
            const messageData = {
                group_id: groupId,
                sender_id: senderId,
                content,
                attachment_url: attachmentUrl
            };

            const { data, error } = await supabase
                .from('messages')
                .insert([messageData])
                .select()
                .single();

            if (error) throw error;
            logger.log('[GroupChat] Message sent to group');
            return data;
        } catch (error) {
            logger.error('[GroupChat] Error sending group message:', error);
            throw error;
        }
    },

    /**
     * Obtenir missatges del grup
     */
    async getGroupMessages(groupId, page = 0, limit = 50) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    id,
                    content,
                    sender_id,
                    attachment_url,
                    attachment_type,
                    created_at,
                    profiles (
                        id,
                        full_name,
                        avatar_url
                    )
                `)
                .eq('group_id', groupId)
                .order('created_at', { ascending: false })
                .range(page * limit, (page + 1) * limit - 1);

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('[GroupChat] Error fetching messages:', error);
            return [];
        }
    },

    /**
     * Marcar missatges com llegits
     */
    async markAsRead(groupId, userId) {
        try {
            const { error } = await supabase
                .from('group_members')
                .update({ last_read_at: new Date().toISOString() })
                .match({ group_id: groupId, user_id: userId });

            if (error) throw error;
            return true;
        } catch (error) {
            logger.error('[GroupChat] Error marking as read:', error);
            return false;
        }
    }
};

export default groupChatService;
