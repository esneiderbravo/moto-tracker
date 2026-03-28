'use client';

import { Bike } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface MotorcycleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  currentKm?: number;
  color?: string;
  imageUrl?: string;
}

/**
 * Card component displaying a motorcycle's key information pulled from Supabase.
 * Now wraps the content in a Link to navigate to the detailed view.
 */
export default function MotorcycleCard({ id, make, model, year, licensePlate, currentKm, color, imageUrl }: MotorcycleCardProps) {
  return (
    <Link href={`/motorcycles/${id}`} className="block active:scale-[0.98] transition-transform">
      <div className="bg-surface rounded-2xl overflow-hidden border border-border flex flex-col">
        {/* Hero Image */}
        <div className="w-full h-44 bg-background relative flex items-center justify-center overflow-hidden">
          {imageUrl
            ? <img src={imageUrl} alt={`${make} ${model}`} className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-2 text-textSecondary">
                <Bike size={48} className="text-primary/60" />
                <span className="text-xs">{make} {model}</span>
              </div>
          }
          {color && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white border border-white/20">{color}</span>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white leading-tight">{make} {model}</h3>
              <p className="text-sm text-textSecondary">{year}</p>
            </div>
            {licensePlate && (
              <span className="text-xs font-bold font-mono bg-background border border-border px-2 py-1 rounded-lg text-primary tracking-widest uppercase">{licensePlate}</span>
            )}
          </div>

          {currentKm !== undefined && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <div className="flex flex-col flex-1">
                <span className="text-xs text-textSecondary">Kilometraje</span>
                <span className="font-bold text-white text-sm">{currentKm.toLocaleString()} km</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
