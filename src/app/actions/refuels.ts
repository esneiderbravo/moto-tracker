'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Refuel {
  id: string;
  motorcycle_id: string;
  date: string;
  odometer: number;
  liters: number;
  total_cost: number;
  location?: string;
  full_tank: boolean;
  notes?: string;
  created_at: string;
}

/**
 * Creates a new fuel record for a motorcycle.
 */
export async function createRefuel(formData: Partial<Refuel>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('refuels').insert({
    ...formData,
    user_id: user.id,
  });

  if (error) {
    console.error('Error creating refuel:', error);
    return { error: error.message };
  }

  // Update motorcycle odometer if the new one is higher
  if (formData.motorcycle_id && formData.odometer) {
    await supabase.from('motorcycles')
      .update({ current_km: formData.odometer })
      .eq('id', formData.motorcycle_id)
      .gt('current_km', formData.odometer);
  }

  revalidatePath('/[locale]/motorcycles/[id]', 'page');
  return { success: true };
}

/**
 * Fetches all refuels for a specific motorcycle, sorted by date.
 */
export async function getMotorcycleRefuels(motorcycleId: string): Promise<Refuel[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('refuels')
    .select('*')
    .eq('motorcycle_id', motorcycleId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching refuels:', error);
    return [];
  }

  return data as Refuel[];
}

/**
 * Deletes a refuel record.
 */
export async function deleteRefuel(id: string, motorcycleId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('refuels').delete().eq('id', id);

  if (error) {
    console.error('Error deleting refuel:', error);
    return { error: error.message };
  }

  revalidatePath(`/[locale]/motorcycles/${motorcycleId}`, 'page');
  return { success: true };
}
