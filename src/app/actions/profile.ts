'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Server action to update user metadata (including Avatar file uploads) in Supabase.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No Session Found' }
  }

  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const avatarFile = formData.get('avatar') as File | null

  const updates: { full_name?: string; phone?: string; avatar_url?: string } = {
    full_name: fullName,
    phone: phone,
  }

  if (avatarFile && avatarFile.size > 0 && avatarFile.name !== 'undefined') {
    const fileExt = avatarFile.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, { upsert: true })

    if (uploadError) {
      return { error: `Upload Failed: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    updates.avatar_url = publicUrl
  }

  const { error } = await supabase.auth.updateUser({
    data: updates
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/[locale]/profile', 'page')
  return { success: true }
}
