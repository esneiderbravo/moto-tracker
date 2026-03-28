'use server'

import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

/**
 * Server action to register a new user in Supabase.
 */
export async function signUpUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!email || !password || !fullName) {
    return { error: 'Please fill in all required fields.' };
  }

  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Server action to authenticate an existing user in Supabase.
 * Enforces email validation lockouts.
 */
export async function signInUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please fill in all required fields.' };
  }

  const supabase = await createClient();
  const t = await getTranslations('Auth');

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      return { error: t('emailNotConfirmedError') };
    }
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Server action to securely log out the user and destroy the SSR session.
 */
export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
