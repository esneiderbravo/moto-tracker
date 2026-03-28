'use client';

import { useEffect, useState, useRef } from 'react';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { getMotorcycleAIInsights } from '@/app/actions/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsightCardProps {
  make: string;
  model: string;
  year: number | null;
  km: number;
}

/**
 * A premium card that fetches and displays a personalized maintenance tip from Gemini 3.
 */
export default function AIInsightCard({ make, model, year, km }: AIInsightCardProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    
    async function fetchInsight() {
      fetchedRef.current = true;
      try {
        const result = await getMotorcycleAIInsights(make, model, year, km);
        if (result.insight) {
          setInsight(result.insight);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchInsight();
  }, [make, model, year, km]);

  return (
    <div className="relative group overflow-hidden bg-surface/50 backdrop-blur-sm rounded-[32px] border border-primary/20 p-6 shadow-lg shadow-primary/5 transition-all hover:border-primary/40">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all" />

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
          <Sparkles size={24} />
        </div>
        
        <div className="flex flex-col gap-1 pr-4">
          <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">AI Insights</h4>
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-4"
              >
                <Loader2 size={16} className="animate-spin text-textSecondary" />
                <span className="text-sm font-medium text-textSecondary italic">Analizando modelo y kilometraje...</span>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="py-4"
              >
                <span className="text-sm text-textSecondary flex items-center gap-2">
                   <Info size={14} /> Los consejos volverán pronto.
                </span>
              </motion.div>
            ) : (
              <motion.p 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-sm leading-relaxed font-medium py-2"
              >
                 {insight}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
