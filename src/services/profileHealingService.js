import { supabaseService } from './supabaseService';
import { USER_ROLES, CREATOR_EMAILS } from '../constants';
import { logger } from '../utils/logger';

export const profileHealingService = {
  async healGhostProfile(session, profileData, isSimulation) {
    if (!profileData && session?.user?.id && !isSimulation) {
      logger.warn('[AuthContext] 👻 Perfil invisible detectat. Executant Auto-Heal...');
      const userEmail = session.user.email || session.user.user_metadata?.email || '';
      const newProfileName = session.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : 'Nou Veí');
      const newAvatar = session.user.user_metadata?.avatar_url || null;
      try {
        profileData = await supabaseService.upsertProfile(session.user.id, {
          full_name: newProfileName,
          avatar_url: newAvatar,
          role: USER_ROLES.NEIGHBOR
        });
        logger.log('[AuthContext] 🚀 Auto-Heal completat.');
      } catch (healErr) {
        logger.error('[AuthContext] Error durant el Auto-Heal:', healErr);
      }
    }
    return profileData;
  },

  protectMasterIdentity(session, profileData) {
    if (!session?.user) return { effectiveProfile: profileData, isOfficialCreator: false };
    
    const userEmail = (session.user.email || session.user.user_metadata?.email || '').toLowerCase();
    const masters = Array.isArray(CREATOR_EMAILS) ? CREATOR_EMAILS : [];
    const isMastersEmail = masters.some(email => email.toLowerCase() === userEmail) ||
      userEmail === 'javillinares@gmail.com' ||
      userEmail === 'mestre@socdepoble.com' ||
      userEmail === 'sollutia@gmail.com' ||
      userEmail === 'socdepoblecom@gmail.com' ||
      userEmail.includes('javillinares') ||
      userEmail.includes('llinares') ||
      userEmail.includes('mestre@');

    const MASTER_IDS = [
      '25218ea4-5d7d-4db4-bdc5-7ae035629242',
      '56557878-3a83-4710-8588-44ade442a8b3',
    ];
    const isOfficialCreator = isMastersEmail || MASTER_IDS.includes(session.user.id);

    let effectiveName = profileData?.full_name || session.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : null) || (session.user.phone ? 'Veí del Poble' : 'Veí del Poble');
    if (isOfficialCreator) effectiveName = 'Javi Llinares';

    const effectiveProfile = {
      ...(profileData || {}),
      id: profileData?.id || session.user.id,
      full_name: effectiveName,
      username: isOfficialCreator ? 'javillinares' : profileData?.username,
      role: isOfficialCreator ? USER_ROLES.SUPER_ADMIN : (profileData?.role || USER_ROLES.NEIGHBOR),
      avatar_url: isOfficialCreator ? '/Javi_Llinares-Foto_perfil-1.jpg' : (supabaseService.normalizeStorageUrl(profileData?.avatar_url) || null),
      header_image_url: isOfficialCreator ? '/assets/avatars/javi_cover.jpg' : profileData?.header_image_url,
      is_master: isOfficialCreator,
      is_super_admin: isOfficialCreator
    };
    return { effectiveProfile, isOfficialCreator };
  }
};
