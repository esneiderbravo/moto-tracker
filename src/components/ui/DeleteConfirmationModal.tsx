'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

/**
 * A premium, animated confirmation modal for destructive actions.
 */
export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-surface rounded-[32px] border border-border overflow-hidden pointer-events-auto shadow-2xl"
            >
              {/* Header Icon */}
              <div className="pt-8 pb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <TriangleAlert size={32} />
                </div>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 text-center">
                <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 bg-background/50 border-t border-border flex flex-col gap-2">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="w-full py-4 bg-red-500 text-white font-black rounded-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-4 bg-surface text-white font-bold rounded-2xl border border-border active:scale-95 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
