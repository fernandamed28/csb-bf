"use client";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
      <div
        className="
          bg-white rounded-xl shadow-lg relative 
          w-full max-w-[90vw] sm:max-w-2xl lg:max-w-4xl 
          max-h-[90vh] overflow-y-auto
          animate-fadeIn
        "
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="
            absolute top-2 right-2 
            text-gray-500 hover:text-gray-700 
            text-lg font-bold transition z-10 p-5 rounded-full
          "
          aria-label="Fermer la fenêtre"
        >
          ✕
        </button>

        {/* Contenu dynamique */}
        <div>{children}</div>
      </div>
    </div>
  );
}
