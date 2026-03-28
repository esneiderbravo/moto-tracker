'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const COUNTRIES = [
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴', format: '### ### ####' },
  { code: 'US', name: 'Estados Unidos', dial: '+1', flag: '🇺🇸', format: '(###) ###-####' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽', format: '## #### ####' },
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷', format: '## ####-####' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱', format: '# #### ####' },
  { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪', format: '### ### ###' },
  { code: 'EC', name: 'Ecuador', dial: '+593', flag: '🇪🇨', format: '## ### ####' },
  { code: 'VE', name: 'Venezuela', dial: '+58', flag: '🇻🇪', format: '### ### ####' },
  { code: 'BR', name: 'Brasil', dial: '+55', flag: '🇧🇷', format: '(##) #####-####' },
  { code: 'PA', name: 'Panamá', dial: '+507', flag: '🇵🇦', format: '#### ####' },
  { code: 'CR', name: 'Costa Rica', dial: '+506', flag: '🇨🇷', format: '#### ####' },
  { code: 'DO', name: 'Rep. Dominicana', dial: '+1-809', flag: '🇩🇴', format: '(###) ###-####' },
  { code: 'GT', name: 'Guatemala', dial: '+502', flag: '🇬🇹', format: '#### ####' },
  { code: 'HN', name: 'Honduras', dial: '+504', flag: '🇭🇳', format: '#### ####' },
  { code: 'SV', name: 'El Salvador', dial: '+503', flag: '🇸🇻', format: '#### ####' },
  { code: 'BO', name: 'Bolivia', dial: '+591', flag: '🇧🇴', format: '## ### ####' },
  { code: 'PY', name: 'Paraguay', dial: '+595', flag: '🇵🇾', format: '### ### ###' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾', format: '## ### ####' },
  { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸', format: '### ## ## ##' },
  { code: 'GB', name: 'Reino Unido', dial: '+44', flag: '🇬🇧', format: '#### ### ####' },
  { code: 'DE', name: 'Alemania', dial: '+49', flag: '🇩🇪', format: '### ### ####' },
  { code: 'FR', name: 'Francia', dial: '+33', flag: '🇫🇷', format: '## ## ## ## ##' },
  { code: 'IT', name: 'Italia', dial: '+39', flag: '🇮🇹', format: '### ### ####' },
  { code: 'CA', name: 'Canadá', dial: '+1', flag: '🇨🇦', format: '(###) ###-####' },
  { code: 'JP', name: 'Japón', dial: '+81', flag: '🇯🇵', format: '##-####-####' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', format: '### ### ###' },
];

/** Formats a digit string according to a pattern where '#' is a digit placeholder */
function formatPhoneNumber(digits: string, pattern: string | undefined): string {
  if (!pattern || !digits) return digits ?? '';
  let result = '';
  let digitIndex = 0;
  for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
    if (pattern[i] === '#') {
      result += digits[digitIndex++];
    } else {
      result += pattern[i];
    }
  }
  return result;
}

interface PhoneInputCustomProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Fully custom phone input with searchable country dropdown, flags, and dial codes.
 * Styled to match the app's dark theme without external CSS conflicts.
 */
export default function PhoneInputCustom({ value, onChange }: PhoneInputCustomProps) {
  const parseInitial = () => {
    const found = COUNTRIES.find(c => value?.startsWith(c.dial));
    return found ?? COUNTRIES[0];
  };

  const [selected, setSelected] = useState(parseInitial);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [localNumber, setLocalNumber] = useState(
    value?.replace(parseInitial().dial, '').trim() ?? ''
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
    const digits = localNumber.replace(/\D/g, '');
    const formatted = formatPhoneNumber(digits, country.format);
    setLocalNumber(formatted);
    onChange(`${country.dial} ${formatted}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fmt = COUNTRIES.find(c => c.code === selected.code)?.format;
    const digits = e.target.value.replace(/\D/g, '');
    const formatted = formatPhoneNumber(digits, fmt);
    setLocalNumber(formatted);
    onChange(`${selected.dial} ${formatted}`);
  };

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className={`flex items-center w-full bg-surface border rounded-xl transition-all ${open ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
        
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center gap-2 px-3 py-3 border-r border-border hover:bg-white/5 transition-colors rounded-l-xl min-w-[90px] shrink-0"
        >
          <span className="text-2xl leading-none">{selected.flag}</span>
          <span className="text-sm text-textSecondary font-mono">{selected.dial}</span>
          <ChevronDown size={14} className={`text-textSecondary transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Number Input */}
        <input
          type="tel"
          value={localNumber}
          onChange={handleNumberChange}
          placeholder="300 000 0000"
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-textSecondary focus:outline-none text-sm"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-full bg-surface border border-border rounded-2xl shadow-2xl z-[200] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar país..."
              className="w-full px-3 py-2 bg-background rounded-lg text-sm text-white placeholder-textSecondary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Country List */}
          <ul className="max-h-52 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-textSecondary text-center">Sin resultados</li>
            )}
            {filtered.map(country => (
              <li key={country.code}>
                <button
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors ${selected.code === country.code ? 'text-primary bg-primary/10' : 'text-white'}`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm flex-1">{country.name}</span>
                  <span className="text-xs font-mono text-textSecondary">{country.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
