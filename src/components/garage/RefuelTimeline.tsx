'use client';

import { Droplet, Calendar, Gauge, CreditCard } from 'lucide-react';
import { Refuel } from '@/app/actions/refuels';
import { motion } from 'framer-motion';

interface RefuelTimelineProps {
  refuels: Refuel[];
}

export default function RefuelTimeline({ refuels }: RefuelTimelineProps) {
  if (refuels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surfaceHighlight/30 rounded-[32px] border-2 border-dashed border-border/50 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center text-primary/40">
           <Droplet size={32} />
        </div>
        <div>
          <h3 className="text-white font-bold">Sin tanqueos registrados</h3>
          <p className="text-textSecondary text-sm max-w-[200px] mx-auto">Comienza por registrar tu primer lleno de tanque.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Vertical Line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/40" />

      {refuels.map((refuel, index) => (
        <motion.div 
          key={refuel.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4 relative z-10"
        >
          {/* Dot Icon */}
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary shrink-0 shadow-md">
             <Droplet size={16} />
          </div>

          {/* Card Content */}
          <div className="flex-1 bg-surface p-4 rounded-[20px] border border-border hover:border-primary/20 transition-all flex flex-col gap-2.5">
             <div className="flex justify-between items-start">
                <div className="flex flex-col">
                   <h4 className="text-sm font-bold text-white tracking-tight">{refuel.liters.toFixed(2)} Litros</h4>
                   <span className="text-[10px] text-textSecondary flex items-center gap-1 font-medium">
                      <Calendar size={10} /> {new Date(refuel.date).toLocaleDateString()}
                   </span>
                </div>
                <div className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-0.5 rounded-full border border-primary/20">
                   ${refuel.total_cost.toLocaleString()}
                </div>
             </div>

             <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-1.5 text-textSecondary text-[11px] font-semibold">
                   <Gauge size={12} className="text-primary/60" />
                   {refuel.odometer.toLocaleString()} km
                </div>
                {refuel.location && (
                  <div className="flex items-center gap-1.5 text-textSecondary text-[10px] font-medium truncate">
                    <CreditCard size={12} className="text-primary/60" />
                    {refuel.location}
                  </div>
                )}
             </div>

             {refuel.notes && (
               <p className="text-textSecondary text-xs italic border-l-2 border-primary/40 pl-3 py-1">
                  "{refuel.notes}"
               </p>
             )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
