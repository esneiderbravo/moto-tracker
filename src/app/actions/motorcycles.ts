'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Server action to insert a new motorcycle record belonging to the authenticated user.
 */
export async function createMotorcycle(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const make = formData.get('make') as string
  const model = formData.get('model') as string
  const year = parseInt(formData.get('year') as string)
  const color = formData.get('color') as string
  const licensePlate = formData.get('licensePlate') as string
  const currentKm = parseInt(formData.get('currentKm') as string) || 0
  const imageFile = formData.get('image') as File | null

  if (!make || !model || !year) {
    return { error: 'Make, model and year are required.' }
  }

  let imageUrl: string | null = null

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('motorcycles')
      .upload(filePath, imageFile, { upsert: true })

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('motorcycles')
        .getPublicUrl(filePath)
      imageUrl = publicUrl
    }
  }

  const { error } = await supabase.from('motorcycles').insert({
    user_id: user.id,
    make,
    model,
    year,
    color,
    license_plate: licensePlate,
    current_km: currentKm,
    image_url: imageUrl,
  })

  if (error) return { error: error.message }

  revalidatePath('/[locale]', 'page')
  return { success: true }
}

/**
 * Server action to fetch all motorcycles belonging to the authenticated user.
 */
export async function getUserMotorcycles() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

/**
 * Server action to fetch a single motorcycle by its ID.
 */
export async function getMotorcycleById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('motorcycles')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

/**
 * Server action to delete a motorcycle record and its associated image from storage.
 */
export async function deleteMotorcycle(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // 1. Get the motorcycle to find the image path
  const { data: moto } = await supabase
    .from('motorcycles')
    .select('image_url')
    .eq('id', id)
    .single()

  // 2. Delete the record
  const { error } = await supabase
    .from('motorcycles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  // 3. Cleanup storage if image exists
  if (moto?.image_url) {
    const path = moto.image_url.split('/public/motorcycles/').pop()
    if (path) {
      await supabase.storage.from('motorcycles').remove([path])
    }
  }

  revalidatePath('/[locale]', 'page')
  return { success: true }
}
