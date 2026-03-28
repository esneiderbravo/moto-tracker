import { getMotorcycleById } from '@/app/actions/motorcycles';
import { Bike, Calendar, Palette, Hash, Gauge, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import DeleteMotorcycleButton from '@/components/garage/DeleteMotorcycleButton';
import AIInsightCard from '@/components/garage/AIInsightCard';
import { getMotorcycleRefuels } from '@/app/actions/refuels';
import RefuelsSection from '@/components/garage/RefuelsSection';

/**
 * Motorcycle detail page - SSR fetches the bike by ID and displays its attributes.
 */
export default async function MotorcycleDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const moto = await getMotorcycleById(id);
  const refuels = await getMotorcycleRefuels(id);

  if (!moto) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-64 w-full bg-surfaceHighlight overflow-hidden">
        {moto.image_url ? (
          <img src={moto.image_url} alt={`${moto.make} ${moto.model}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-primary/30">
            <Bike size={80} strokeWidth={1} />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform z-10"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 -mt-12 relative z-10 bg-background rounded-t-[40px] flex-1 gap-8 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
        
        {/* Title & Batch */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-white leading-tight">{moto.make} {moto.model}</h1>
            <span className="text-xs font-bold font-mono bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-full tracking-wider uppercase shadow-[0_0_15px_rgba(255,87,34,0.3)]">
              {moto.license_plate || 'SIN PLACA'}
            </span>
          </div>
          <p className="text-textSecondary flex items-center gap-2 text-sm font-medium">
            <Calendar size={14} /> Modelo {moto.year}
          </p>
        </div>

        {/* AI Insight Card */}
        <AIInsightCard 
           make={moto.make} 
           model={moto.model} 
           year={moto.year} 
           km={moto.current_km || 0} 
        />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-3xl border border-border flex flex-col gap-1">
            <div className="flex items-center gap-2 text-textSecondary mb-1">
              <Gauge size={14} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-tighter">Kilometraje</span>
            </div>
            <span className="text-lg font-bold text-white">{(moto.current_km || 0).toLocaleString()} km</span>
          </div>

          <div className="bg-surface p-4 rounded-3xl border border-border flex flex-col gap-1">
            <div className="flex items-center gap-2 text-textSecondary mb-1">
              <Palette size={14} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-tighter">Color</span>
            </div>
            <span className="text-lg font-bold text-white">{moto.color || '---'}</span>
          </div>
        </div>

        {/* Details List */}
        <div className="flex flex-col gap-4">
           <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest px-1">Especificaciones</h3>
           <div className="bg-surface rounded-3xl border border-border divide-y divide-border overflow-hidden">
             <div className="flex items-center justify-between p-4">
                <span className="text-sm text-textSecondary">Marca</span>
                <span className="text-sm font-bold text-white">{moto.make}</span>
             </div>
             <div className="flex items-center justify-between p-4">
                <span className="text-sm text-textSecondary">Modelo</span>
                <span className="text-sm font-bold text-white">{moto.model}</span>
             </div>
             <div className="flex items-center justify-between p-4">
                <span className="text-sm text-textSecondary">Año de fabricación</span>
                <span className="text-sm font-bold text-white">{moto.year}</span>
             </div>
           </div>
        </div>

        {/* Refuels Section */}
        <RefuelsSection 
           motorcycleId={id} 
           initialRefuels={refuels} 
           lastOdometer={moto.current_km || 0}
           t={{
             title: "Historial de Combustible",
             addBtn: "Tanqueo"
           }}
        />

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <h3 className="text-red-500/80 text-xs font-black uppercase tracking-[0.2em] mb-4 px-2">Zona de Peligro</h3>
          <DeleteMotorcycleButton id={id} />
        </div>
      </div>
    </div>
  );
}
