import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

const PermissionToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 flex z-50 animate-toast-in">
      <div className="flex items-start gap-3 max-w-sm rounded-xl
        bg-slate-900 border border-rose-500/30
        px-4 py-3 shadow-xl">

        <AlertTriangle className="w-5 h-5 text-rose-400 mt-0.5" />

        <div>
          <p className="text-sm font-semibold text-white">
            Action not allowed
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionToast;
