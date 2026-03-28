'use client';

import { useState } from 'react';
import { Plus, Droplet } from 'lucide-react';
import RefuelTimeline from './RefuelTimeline';
import AddRefuelModal from './AddRefuelModal';
import { Refuel } from '@/app/actions/refuels';

interface RefuelsSectionProps {
  motorcycleId: string;
  initialRefuels: Refuel[];
  lastOdometer: number;
  t: {
    title: string;
    addBtn: string;
  };
}

export default function RefuelsSection({ motorcycleId, initialRefuels, lastOdometer, t }: RefuelsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Droplet size={12} />
          </div>
          <h3 className="text-xs font-black text-white uppercase italic tracking-tight">{t.title}</h3>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-primary text-[10px] font-black uppercase italic tracking-widest px-3 py-2 rounded-xl border border-white/5 transition-all active:scale-95"
        >
          <Plus size={14} />
          {t.addBtn}
        </button>
      </div>

      {/* Timeline */}
      <RefuelTimeline refuels={initialRefuels} />

      {/* Modal */}
      <AddRefuelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        motorcycleId={motorcycleId}
        lastOdometer={lastOdometer}
      />
    </div>
  );
}
