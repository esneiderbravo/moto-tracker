'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMotorcycle } from '@/app/actions/motorcycles';
import { useRouter } from '@/i18n/routing';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

/**
 * Button component to delete a motorcycle record with a premium confirmation modal.
 */
export default function DeleteMotorcycleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteMotorcycle(id);
    
    if (result.success) {
      router.push('/');
    } else {
      alert('Error al eliminar: ' + result.error);
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl border border-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
        Eliminar Moto
      </button>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={loading}
        title="¿Eliminar del Garaje?"
        description="Esta acción eliminará permanentemente la moto y todas sus fotos del servidor. No podrás deshacer este cambio."
      />
    </>
  );
}
