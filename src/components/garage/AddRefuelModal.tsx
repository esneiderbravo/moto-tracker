'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, Gauge, DollarSign, Calendar, MapPin, Check, Loader2 } from 'lucide-react';
import { createRefuel } from '@/app/actions/refuels';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AddRefuelModalProps {
  isOpen: boolean;
  onClose: () => void;
  motorcycleId: string;
  lastOdometer: number;
}

export default function AddRefuelModal({ isOpen, onClose, motorcycleId, lastOdometer }: AddRefuelModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hide Navbar when modal is open
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (isOpen && nav) {
      nav.style.display = 'none';
    } 
    return () => {
      if (nav) nav.style.display = 'flex';
    };
  }, [isOpen]);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    odometer: lastOdometer,
    liters: '',
    total_cost: '',
    location: '',
    full_tank: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createRefuel({
        ...formData,
        motorcycle_id: motorcycleId,
        liters: parseFloat(formData.liters),
        total_cost: parseInt(formData.total_cost),
        odometer: parseInt(formData.odometer.toString()),
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto sm:max-w-sm w-full bg-background border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-[32px] shadow-2xl z-[101] overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-surfaceHighlight/30">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Droplet size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase italic tracking-tight leading-none">Registrar Tanqueo</h2>
                  <p className="text-[9px] text-textSecondary font-medium mt-0.5 uppercase tracking-widest">Control de consumo</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-textSecondary hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto no-scrollbar pb-8">
              
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-1 flex flex-col">
                  <label className="text-[8px] uppercase font-black tracking-widest text-textSecondary px-1.5 text-glow-none">Fecha</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={14} />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 bg-surfaceHighlight border border-white/5 rounded-xl pl-9 pr-3 text-white font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all uppercase text-[11px]"
                    />
                  </div>
                </div>

                {/* Odometer */}
                <div className="space-y-1 flex flex-col">
                  <label className="text-[8px] uppercase font-black tracking-widest text-textSecondary px-1.5 text-glow-none">Kilometraje</label>
                  <div className="relative group">
                    <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={14} />
                    <input
                      type="number"
                      required
                      placeholder="Ej: 15400"
                      value={formData.odometer}
                      min={lastOdometer}
                      onChange={(e) => setFormData({ ...formData, odometer: parseInt(e.target.value) })}
                      className="w-full h-10 bg-surfaceHighlight border border-white/5 rounded-xl pl-9 pr-3 text-white font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Liters */}
                <div className="space-y-1 flex flex-col">
                  <label className="text-[8px] uppercase font-black tracking-widest text-textSecondary px-1.5 text-glow-none">Litros / Gl</label>
                  <div className="relative group">
                    <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={14} />
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ej: 3.5"
                      value={formData.liters}
                      onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                      className="w-full h-10 bg-surfaceHighlight border border-white/5 rounded-xl pl-9 pr-3 text-white font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all text-[11px]"
                    />
                  </div>
                </div>

                {/* Cost */}
                <div className="space-y-1 flex flex-col">
                  <label className="text-[8px] uppercase font-black tracking-widest text-textSecondary px-1.5 text-glow-none">Costo Total</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={14} />
                    <input
                      type="number"
                      required
                      placeholder="Ej: 25000"
                      value={formData.total_cost}
                      onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
                      className="w-full h-10 bg-surfaceHighlight border border-white/5 rounded-xl pl-9 pr-3 text-white font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1 flex flex-col">
                <label className="text-[8px] uppercase font-black tracking-widest text-textSecondary px-1.5 text-glow-none">Ubicación / Gasolinera</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={14} />
                  <input
                    type="text"
                    placeholder="Ej: Primax Calle 10"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-10 bg-surfaceHighlight border border-white/5 rounded-xl pl-9 pr-3 text-white font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none transition-all text-[11px]"
                  />
                </div>
              </div>

              {/* Tank Checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 bg-surfaceHighlight/50 border border-white/5 rounded-xl cursor-pointer hover:bg-surfaceHighlight transition-colors group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${formData.full_tank ? 'bg-primary border-primary shadow-[0_0_8px_rgba(255,87,34,0.3)]' : 'border-white/20'}`}>
                  {formData.full_tank && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.full_tank}
                  onChange={(e) => setFormData({ ...formData, full_tank: e.target.checked })}
                />
                <span className="text-[11px] font-bold text-white uppercase tracking-tight italic">Tanque Lleno</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 bg-gradient-to-r from-primary to-orange-600 rounded-xl flex items-center justify-center gap-2 text-white font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all text-xs"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : success ? <Check size={16} /> : "Guardar Registro"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
