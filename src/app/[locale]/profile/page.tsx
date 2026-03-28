import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import ProfileEditor from '@/components/profile/ProfileEditor';

/**
 * Renders the protected profile page dynamically feeding Supabase Metadata directly.
 */
export default async function ProfilePage() {
  const t = await getTranslations('Navigation');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const metadata = user.user_metadata || {};
  const formattedDate = new Date(user.created_at).toLocaleDateString('es-ES', { 
    month: 'short', year: 'numeric' 
  });

  return (
    <div className="flex flex-col p-6 gap-6 relative min-h-screen">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-white">{t('profile')}</h1>
      </header>
      
      <ProfileEditor 
        initialName={metadata.full_name || ''} 
        initialPhone={metadata.phone || ''}
        initialAvatar={metadata.avatar_url || ''} 
        email={user.email || ''}
        createdAt={`Piloto desde ${formattedDate}`}
      />
    </div>
  );
}
