# 🏍️ MotoTracker

> **Smart Motorcycle Management.** The open-source, zero-cost PWA built for riders who want perfection in their pocket.

### 🌟 The Mission
MotoTracker was born from the need for a **clean, fast, and intelligent** way to manage everything about your motorcycle. Whether it's tracking maintenance via **AI**, managing your fleet in multiple languages, or ensuring your data is secure and accessible from any device—MotoTracker is the ultimate companion for every rider.

**Why MotoTracker?**
- **Zero-Cost Infrastructure:** Powered by Supabase & Gemini Free tiers.
- **Privacy First:** Your data, your rules. No tracking, no ads.
- **AI-Powered Specs:** Don't waste time typing; let Gemini handle the data entry.


[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-blue?style=for-the-badge&logo=google-gemini)](https://aistudio.google.com/)

---

## ✨ Features

- 🤖 **AI-First Garage:** Add motorcycles by just typing their name. Powered by **Google Gemini 2.0 Flash** to auto-fill specs, color, and maintenance intervals.
- 📱 **Mobile-First PWA:** Native-app feel with smooth transitions, modern bottom navigation, and premium dark UI.
- 🔐 **Secure Auth:** Row Level Security (RLS) and SSR-based authentication via **Supabase**.
- 🌍 **Full i18n:** Bilingual support (English & Spanish) out of the box.
- 🖼️ **Cloud Storage:** High-performance avatar and motorcycle photo management.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (SSR)
- **AI Engine:** Google AI SDK (Gemini)
- **Localization:** `next-intl`

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+
- A Supabase Project
- A Google AI Studio API Key

### 2. Environment Setup
Create a `.env` file based on `.env.example`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# AI
GOOGLE_AI_API_KEY=your_gemini_key
```

### 3. Database Initialization
Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Create motorcycles table
create table public.motorcycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  make text not null, model text not null, year int not null,
  color text, license_plate text, current_km int default 0,
  image_url text, created_at timestamptz default now()
);

-- Security
alter table public.motorcycles enable row level security;
create policy "Users can manage own motorcycles" on public.motorcycles for all using (auth.uid() = user_id);

-- Storage Buckets (avatars & motorcycles)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true), ('motorcycles', 'motorcycles', true);
```

### 4. Run Locally
```bash
npm install
npm run dev
```

---

## 🗺️ Project Structure

- `src/app/[locale]` - Routes & Pages (i18n aware)
- `src/components/ui` - Reusable premium UI components
- `src/app/actions` - Server Actions for Auth, Profile, and Garage
- `src/ia/prompts` - Centralized AI prompt engineering
- `src/translations` - JSON dictionaries for en/es

---

## 🤝 Contributing
MotoTracker is a **Zero-Cost** project. We prioritize performance and clean code.

1. Fork it
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Developed with ❤️ for the global riding community.
