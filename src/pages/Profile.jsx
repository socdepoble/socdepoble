import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { User, LogOut, Camera, Save } from 'lucide-react';

const Profile = () => {
    const { t } = useTranslation();
    const { profile, user, setProfile } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                username: profile.username || '',
                avatar_url: profile.avatar_url || ''
            });
        }
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabaseService.updateProfile(user.id, formData);
        if (error) {
            alert(error.message);
        } else {
            setProfile({ ...profile, ...formData });
            alert(t('common.saved') || 'Guardat!');
        }
        setLoading(false);
    };

    if (!profile) return <div>{t('common.loading')}</div>;

    return (
        <div className="profile-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div className="avatar-big" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <User size={40} color="white" />
                    )}
                </div>
                <div>
                    <h1 style={{ margin: 0 }}>{formData.full_name || t('nav.profile')}</h1>
                    <p style={{ margin: 0, opacity: 0.7 }}>{profile.role?.toUpperCase()}</p>
                </div>
            </header>

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('auth.fullName')}</label>
                    <input
                        type="text"
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</label>
                    <input
                        type="text"
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>

                <button type="submit" disabled={loading} style={{
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                }}>
                    <Save size={20} />
                    {loading ? t('common.loading') : (t('common.save') || 'Guardar')}
                </button>
            </form>

            <button onClick={() => supabaseService.signOut()} style={{
                marginTop: '2rem',
                width: '100%',
                padding: '1rem',
                backgroundColor: 'transparent',
                border: '2px solid #ff5252',
                color: '#ff5252',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 'bold'
            }}>
                <LogOut size={20} />
                {t('auth.logout')}
            </button>
        </div>
    );
};

export default Profile;
