import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Camera, Save, Building2, Store } from 'lucide-react';
import './Profile.css';

const MyEntitiesList = ({ userId }) => {
    const [entities, setEntities] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        if (userId) {
            supabaseService.getUserEntities(userId).then(setEntities);
        }
    }, [userId]);

    if (entities.length === 0) {
        return <p className="empty-entities-message">{t('nav.empty_entities')}</p>;
    }

    return (
        <div className="entities-grid">
            {entities.map(ent => (
                <div key={ent.id} className="entity-card">
                    <div className={`entity-avatar ${ent.type}`}>
                        {ent.avatar_url ? (
                            <img src={ent.avatar_url} alt={ent.name} />
                        ) : (
                            ent.type === 'empresa' ? <Store size={20} /> : <Building2 size={20} />
                        )}
                    </div>
                    <div className="entity-info">
                        <h4>{ent.name}</h4>
                        <span className="entity-role">
                            {ent.type} • {ent.member_role}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Profile = () => {
    const { t } = useTranslation();
    const { profile, user, setProfile } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        avatar_url: ''
    });

    // Initialize form data only when profile is loaded or changes
    // But do it only if fields are different to avoid unnecessary resets if the user is typing
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                full_name: prev.full_name || profile.full_name || '',
                username: prev.username || profile.username || '',
                avatar_url: prev.avatar_url || profile.avatar_url || ''
            }));
        }
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const updatedProfile = await supabaseService.updateProfile(user.id, formData);
            if (updatedProfile) {
                setProfile(updatedProfile);
                alert(t('common.saved'));
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="profile-container">{t('common.loading')}</div>;

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="avatar-big">
                    {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Profile" />
                    ) : (
                        <User size={40} color="white" />
                    )}
                </div>
                <div className="profile-titles">
                    <h1>{formData.full_name || t('nav.profile')}</h1>
                    <span className="profile-role-tag">{profile.role?.toUpperCase()}</span>
                </div>
            </header>

            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label>{t('auth.fullName')}</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>{t('auth.username')}</label>
                    <input
                        type="text"
                        className="form-input"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-save">
                    <Save size={20} />
                    {loading ? t('common.loading') : t('common.save')}
                </button>
            </form>

            <div className="entities-section">
                <h3 className="entities-title">
                    <Building2 size={20} /> {t('nav.my_entities')}
                </h3>

                <MyEntitiesList userId={user?.id} />
            </div>

            <button onClick={() => supabaseService.signOut()} className="btn-logout">
                <LogOut size={20} />
                {t('auth.logout')}
            </button>
        </div>
    );
};

export default Profile;
