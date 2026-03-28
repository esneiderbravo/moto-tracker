'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Bike } from 'lucide-react';
import MotorcycleCard from '@/components/garage/MotorcycleCard';
import AddMotorcycleModal from '@/components/garage/AddMotorcycleModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Motorcycle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate?: string;
  current_km?: number;
  color?: string;
  image_url?: string;
}

/**
 * Main Garage view displaying the user's motorcycle fleet, backed by real Supabase data.
 */
export default function GarageView({ initialMotorcycles }: { initialMotorcycles: Motorcycle[] }) {
  const t = useTranslations('Garage');
  const [showModal, setShowModal] = useState(false);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(initialMotorcycles);

  const onSuccess = () => {
    setShowModal(false);
    // Trigger page-level revalidation via full refresh
    window.location.reload();
  };

  return (
    <div className="flex flex-col p-5 gap-5 relative min-h-full">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{t('garage') || 'Mi Garaje'}</h1>
          <p className="text-xs text-textSecondary mt-0.5">{motorcycles.length} {motorcycles.length === 1 ? 'moto' : 'motos'}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowModal(true)}
          aria-label="Add Motorcycle"
          className="bg-primary text-white rounded-full w-11 h-11 flex items-center justify-center shadow-[0_4px_14px_rgba(255,87,34,0.4)]"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>
      </header>

      {/* Empty State */}
      {motorcycles.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center flex-1 gap-6 py-20 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center">
            <Bike size={44} className="text-primary/60" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-white">{t('emptyTitle')}</h2>
            <p className="text-sm text-textSecondary max-w-[220px]">{t('emptySubtitle')}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(255,87,34,0.3)] text-sm"
          >
            {t('addFirst')}
          </motion.button>
        </motion.div>
      )}

      {/* Motorcycle Grid */}
      {motorcycles.length > 0 && (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {motorcycles.map((moto, i) => (
              <motion.div
                key={moto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <MotorcycleCard
                  id={moto.id}
                  make={moto.make}
                  model={moto.model}
                  year={moto.year}
                  licensePlate={moto.license_plate}
                  currentKm={moto.current_km}
                  color={moto.color}
                  imageUrl={moto.image_url}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddMotorcycleModal
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
