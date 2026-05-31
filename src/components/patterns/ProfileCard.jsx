import UniversalCard from '../ui/universal-card';

const ProfileCard = ({
    id,
    avatarUrl,
    name,
    role,
    townName,
    tag,
    lema,
    bio,
    onNavigate
}) => {
    
    // Convert generic profile props to item format expected by UniversalCard
    const agentItem = {
        id: id,
        author_id: id,
        author_name: name,
        author_avatar: avatarUrl,
        author_role: townName,
        town_name: townName,
        title: name,
        subtitle: lema,
        excerpt: bio ? bio.replace(/\n+/g, ' ') : '',
        tags: [tag].filter(Boolean),
        is_iaia_inspired: role === 'master' || role === 'gestor',
        uuid: id,
        type: 'agent',
        created_at: new Date().toISOString(),
        metadata: {
            bategat_time: "ACTIVAT"
        }
    };

    return (
        <UniversalCard
            item={agentItem}
            avatarName={name}
            title={name}
            excerpt={agentItem.excerpt}
            image={avatarUrl}
            viewMode="grid"
            variant="agent"
            onNavigate={() => onNavigate(id)}
        />
    );
};

export default ProfileCard;
