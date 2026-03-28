'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMotorcycle } from '@/app/actions/motorcycles';
import { useRouter } from '@/i18n/routing';

/**
 * Button component to delete a motorcycle record with a loading state.
 */
export default function DeleteMotorcycleButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta moto? Esta acción no se puede deshacer.')) return;
    
    setLoading(true);
    const result = await deleteMotorcycle(id);
    
    if (result.success) {
      router.push('/');
    } else {
      alert('Error al eliminar: ' + result.error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-4 bg-red-500/10 text-red-400 font-bold rounded-2xl border border-red-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
      Eliminar Moto
    </button>
  );
}
