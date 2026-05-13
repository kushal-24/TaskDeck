import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const PermissionToast = ({ message, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(onClose, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-start gap-3 max-w-sm rounded-xl
            bg-slate-900/95 backdrop-blur-xl border border-rose-500/30
            px-5 py-4 shadow-2xl shadow-rose-500/10 pointer-events-auto"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />

          <div>
            <p className="text-sm font-bold text-white tracking-wide">
              Action Not Allowed
            </p>
            <p className="text-xs text-rose-200/70 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default PermissionToast;
