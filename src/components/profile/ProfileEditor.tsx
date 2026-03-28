'use client';

import { useState, useRef } from 'react';
import { updateProfile } from '@/app/actions/profile';
import { signOutUser } from '@/app/actions/auth';
import { Camera, User, Save, LogOut } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import PhoneInputCustom from '@/components/ui/PhoneInputCustom';

/**
 * Interactive Profile Editor parsing Form Data into Server Actions.
 */
export default function ProfileEditor({
  initialName,
  initialPhone = '',
  initialAvatar,
  email,
  createdAt
}: {
  initialName: string;
  initialPhone?: string;
  initialAvatar: string;
  email: string;
  createdAt: string;
}) {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);
  const [phone, setPhone] = useState(initialPhone);
  const [toast, setToast] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setToast('');

    const formData = new FormData(e.currentTarget);
    formData.set('phone', phone);

    const result = await updateProfile(formData);

    if (result.error) {
      setToast('⚠️ ' + result.error);
    } else {
      setToast('✅ ¡Perfil actualizado correctamente!');
    }

    setLoading(false);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    window.location.replace('/es/login');
  };

  return (
    <div className="w-full pb-20">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 max-w-sm mx-auto">


        <div className="flex flex-col items-center relative">
          <label htmlFor="avatar" className="relative cursor-pointer group">
            <div className="w-32 h-32 rounded-full bg-surfaceHighlight border-4 border-surface shadow-2xl relative flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-textSecondary" />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" size={28} />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-extrabold text-white">{initialName || 'Piloto Anónimo'}</h2>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">{createdAt}</p>
          </div>
        </div>


        {toast && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium w-full text-center animate-in fade-in zoom-in duration-200 ${toast.includes('✅') ? 'bg-success/10 text-success border border-success/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {toast}
          </div>
        )}


        <div className="w-full flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-textSecondary px-1">Nombre Completo</label>
            <input
              name="fullName"
              type="text"
              defaultValue={initialName}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-white shadow-sm"
              placeholder="Nombre del piloto"
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-textSecondary px-1">Teléfono Móvil</label>
            <PhoneInputCustom value={phone} onChange={setPhone} />
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-textSecondary px-1">Correo Electrónico</label>
            <input
              type="email"
              defaultValue={email}
              disabled
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-textSecondary cursor-not-allowed opacity-70"
            />
            <p className="text-xs text-textSecondary px-1">El correo de acceso no es modificable por seguridad.</p>
          </div>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-2xl shadow-[0_4px_12px_rgba(255,87,34,0.3)] hover:shadow-[0_8px_20px_rgba(255,87,34,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? 'Guardando en la Nube...' : 'Guardar Cambios'}
        </button>


        <button
          type="button"
          onClick={handleSignOut}
          className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-transparent text-red-400 font-bold rounded-2xl hover:bg-red-500/10 transition-colors border border-red-500/20 active:scale-[0.98]"
        >
          <LogOut size={20} />
          Finalizar Sesión
        </button>
      </form>
    </div>
  );
}
