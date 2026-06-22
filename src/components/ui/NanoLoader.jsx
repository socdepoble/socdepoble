import React from 'react';
import { Loader2 } from 'lucide-react';
const NanoLoader = ({
  message = "Connectant..."
}) => {
  return (
      <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-gray-50 text-gray-900 transition-opacity duration-300'>
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className='animate-spin text-orange-500' size={48} />
                    <span className="tracking-widest opacity-80 uppercase text-sm font-bold">
                        {message}
                    </span>
                </div>
            </div>
  );
};
export default NanoLoader;