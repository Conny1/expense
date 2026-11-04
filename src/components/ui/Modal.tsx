import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description, children, maxWidth = "max-w-lg" }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200" onClick={onClose} />
      <div ref={modalRef} className={`relative z-10 w-full ${maxWidth} bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden`}>
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div>
              {title && <h3 className="font-black text-lg text-gray-900 tracking-tight">{title}</h3>}
              {description && <p className="mt-1 text-xs text-gray-500 font-normal">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-900 p-1.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0" aria-label="Close dialog">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
