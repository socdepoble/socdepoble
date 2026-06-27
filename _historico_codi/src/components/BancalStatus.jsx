import { WifiOff, RefreshCcw } from 'lucide-react';
import { useSoftConnectionStatus } from '../hooks/useSoftConnectionStatus';

const BancalStatus = () => {
    const connectionStatus = useSoftConnectionStatus();

    if (connectionStatus === 'online') {
        return null; // El bancal està regat, no fem soroll
    }

    let StatusIcon = RefreshCcw;
    let statusText = "Reparant Paret Seca...";
    let bgColor = "bg-[#0055A4]/10";
    let textColor = "text-[#0055A4]";
    let borderColor = "border-[#0055A4]/20";
    let iconClass = "animate-spin";

    if (connectionStatus === 'reconnecting') {
        StatusIcon = RefreshCcw;
        statusText = "Reponiendo antena... segueix escrivint mestre";
        bgColor = "bg-[#FDFBF7]";
        textColor = "text-[#0055A4]";
    } else if (connectionStatus === 'offline') {
        StatusIcon = WifiOff;
        statusText = "SENSE COBERTURA (Mode Queviures - Guardant dades)";
        bgColor = "bg-orange-600";
        textColor = "text-white";
        borderColor = "border-orange-500";
        iconClass = "animate-pulse";
    }

    return (
        <div className={`absolute top-[64px] left-0 right-0 z-[var(--z-overlay)] px-4 py-3 flex items-center justify-center border-b shadow-[0_4px_12px_rgba(0,0,0,0.05)] animate-in slide-in-from-top-4 duration-300 ${bgColor} ${borderColor}`}>
            <div className={`flex items-center gap-3 font-semibold text-[16px] md:text-[20px] ${textColor}`}>
                <StatusIcon size={24} className={iconClass} strokeWidth={2.5} />
                <span className="tracking-tight uppercase">{statusText}</span>
            </div>
        </div>
    );
};

export default BancalStatus;
