
export const isIAIAOfficial = (post) => {
    return post.author_entity_id === 'socdepoble' || 
           post.creator_entity_id === 'socdepoble' ||
           post.author_name?.includes('Sóc de Poble');
};

export const isIAIAMarIA = (post, authorIdCheck) => {
    return authorIdCheck === '11111111-1111-4111-a111-000000000000' || 
           post.author_name === 'IAIA MarIA';
};

export const isImmersiveAI = (post, authorIdCheck) => {
    return post.author_is_ai || 
           post.is_iaia_inspired || 
           (authorIdCheck && String(authorIdCheck).startsWith('11111111-') && authorIdCheck !== '11111111-1111-4111-a111-000000000000') ||
           ['FLASH', 'GALL', 'VIATJANT', 'SULTAN', 'MIXA', 'RATOLÍ'].some(n => post.author_name?.toUpperCase().includes(n));
};

export const getVisibilityForLevel = (iaiaLevel, post, enabledAgentIds) => {
    const authorIdCheck = post.author_id || post.author_user_id || post.user_id;
    const official = isIAIAOfficial(post);
    const maria = isIAIAMarIA(post, authorIdCheck);
    const immersive = isImmersiveAI(post, authorIdCheck);

    const activeLevel0 = iaiaLevel === 0;
    const activeLevel1 = iaiaLevel === 1;
    const activeLevel2 = iaiaLevel === 2 || (!iaiaLevel && iaiaLevel !== 0);
    const activeLevel3 = iaiaLevel === 3; // Mod de Treball o Creatiu: Tots actius

    if (activeLevel0) {
        // Nivell 0: Cap agent de la IA visible. Només humans actuen.
        if (maria || immersive || authorIdCheck?.startsWith('11111111-')) return false;
        return true;
    } else if (activeLevel1) {
        // Nivell 1: Només la IAIA MarIA té veu i vot.
        if (maria || official) return true;
        if (!authorIdCheck?.startsWith('11111111-')) return true; // Humans sempre visibles
        return false;
    } else if (activeLevel2) {
        // Nivell 2: Protocol Granular. MarIA + Els seleccionats manualment per l'usuari.
        if (maria || official) return true;
        if (!authorIdCheck?.startsWith('11111111-')) return true; // Humans OK
        return enabledAgentIds.includes(authorIdCheck);
    } else if (activeLevel3) {
        // Nivell 3: Tots els 15 agents visibles alhora. Mod de feina.
        return true;
    }
    
    return true;
};
