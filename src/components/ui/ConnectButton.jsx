import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useTranslation } from 'react-i18next';
const ConnectButton = ({
  className = ""
}) => {
  const {
    user,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const {
    t
  } = useTranslation();
  if (user && !user.isAnonymous) {
    return <div className={`shrink-0 w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform active:scale-95 ${className}`} onClick={() => navigate("/perfil")} title={t("nav.profile")}>
                <div className="w-[36px] h-[36px] rounded-xl bg-[#1A1A1A] flex items-center justify-center text-xs font-black text-white overflow-hidden shadow-sm">
                    {profile?.avatar_url ? <img src={profile.avatar_url} alt="P" className="w-full h-full object-cover shrink-0" onError={e => {
          e.target.onerror = null;
          e.target.style.display = "none";
          e.target.parentNode.querySelector('.connect-avatar-placeholder').style.display = "block";
        }} /> : null}
                    <span className={`connect-avatar-placeholder ${profile?.avatar_url ? 'hidden' : ''}`}>
                        {(profile?.full_name || user?.email || "U").substring(0, 1).toUpperCase()}
                    </span>
                </div>
            </div>;
  }
  return <button className={`shrink-0 w-[40px] h-[40px] flex items-center justify-center hover:bg-white/20 active:scale-95 transition-colors rounded-xl text-white touch-manipulation ${className}`} onClick={() => navigate("/registre")} title={t("nav.register") || "Connectar"} aria-label="Connectar">
            <UserPlus size={20} strokeWidth={2.5} className="text-current" />
        </button>;
};
export default ConnectButton;