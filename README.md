# 🚀 AI Prompt Engine & Full-Stack Portfolio

A high-performance, SEO-optimized portfolio and AI prompt marketplace built with **Next.js 14 App Router**, **Supabase**, **Framer Motion**, and **Tailwind CSS**.

## ✨ Features

- **Neon Dark Mode**: Custom Electric Purple (`#8B5CF6`) & Cyan (`#06B6D4`) theme with glassmorphism effects
- **AI Prompts Platform**: Category-based filtering, one-click copy, and toast notifications (coming soon)
- **Dynamic YouTube Grid**: Auto-fetching video gallery from Supabase (coming soon)
- **Admin Dashboard**: Full CRUD for prompts, videos, and services with Auth protection (coming soon)
- **SEO Ready**: Dynamic meta tags, OG images, and structured data for every prompt
- **Smooth Animations**: Framer Motion-powered hover effects, scrolling transitions, and page animations
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **TypeScript**: Full type safety with hand-crafted Supabase DB types

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14+ (React 18) |
| **Database/Auth** | Supabase (PostgreSQL) |
| **Styling** | Tailwind CSS + Custom Theme |
| **Animations** | Framer Motion |
| **Language** | TypeScript |
| **Deployment** | Vercel (recommended) |

## 📋 Project Structure

```
/
├── app/
│   ├── layout.tsx           # Root layout with metadata & providers
│   └── page.tsx             # Homepage (Hero + Features)
├── components/
│   ├── Navbar.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section with CTAs
│   ├── FeatureCard.tsx      # Feature card component
│   ├── GlassCard.tsx        # Reusable glassmorphic card wrapper
│   └── Footer.tsx           # Footer with links & social
├── lib/
│   ├── constants.ts         # Nav links, features, footer data
│   └── supabase.ts          # Supabase client configuration
├── types/
│   ├── db.ts                # Supabase table types (Database interface)
│   └── ui.ts                # UI component prop types
├── styles/
│   └── globals.css          # Tailwind directives & base styles
├── supabase/
│   └── schema.sql           # Database schema & RLS policies
├── .env.local               # Environment variables (DO NOT COMMIT)
├── tailwind.config.js       # Tailwind theme configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies & scripts
```

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/yourusername/ai-prompt-engine-portfolio.git
cd "ai-prompt-engine-portfolio"
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@email.com
```

**How to find your Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the **Project URL** and **Anon Key** from Settings → API
3. Paste them into `.env.local`

### 3. Set Up Supabase Database

1. Open your Supabase project's SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and execute in the SQL Editor
4. **IMPORTANT**: Update the admin email in the RLS policies:
   - Find `'your-admin@email.com'` in schema.sql
   - Replace with your actual admin email

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage.

## 📁 Key Files Explained

### `tailwind.config.js`
Extends Tailwind with custom Electric Purple theme, neon shadow effects, and glassmorphism utilities:

```javascript
colors: {
  primary: '#8B5CF6',        // Electric Purple
  accent: '#06B6D4',          // Cyan
  background: '#09090b',
}

boxShadow: {
  neon: '0 0 5px #8B5CF6, 0 0 20px rgba(139, 92, 246, 0.5)',
}
```

### `types/db.ts`
Hand-crafted TypeScript interfaces for Supabase tables. Provides full IntelliSense:

```typescript
export type Prompt = Database['public']['Tables']['prompts']['Row'];
// Now you have full type safety when querying with supabase.from('prompts').select()
```

### `components/GlassCard.tsx`
Reusable Framer Motion wrapper for glassmorphic card effects:
- Entrance animation (fade + slide up)
- Hover lift effect (-8px Y offset)
- Smooth transitions
- Perfect for feature cards, blog posts, etc.

### `lib/constants.ts`
Centralized data container for:
- Navigation links
- Feature cards content
- Footer sections
- Social media links

Keep this updated as your site grows—no need to edit components.

## 🎨 Design Features

### Neon Aesthetic
- Dark background (`#09090b`)
- Electric Purple primary (`#8B5CF6`) with glow effects
- Cyan accents (`#06B6D4`)
- Glassmorphism cards with backdrop blur

### Animations
- **Page Transitions**: Fade + scale on entrance
- **Card Hover**: Lift + glow effect on hover
- **Button States**: Scale + shadow on hover/click
- **Scroll Indicator**: Animated arrow at bottom of hero
- **Background**: Animated gradient orbs for depth

### Responsive
- Mobile-first design
- Fully responsive navbar with responsive menu (coming soon)
- Touch-friendly buttons and links
- Optimized for all screen sizes

## 📈 SEO & Performance

### Image Optimization
- Using `next/image` for automatic WebP format conversion
- Lazy loading for off-screen images
- Responsive image sizing with `srcSet`

### Font Optimization
- No external fonts initially (system fonts in CSS)
- Ready for `next/font` integration when needed
- Zero CLS (Cumulative Layout Shift) impact

### Meta Tags & OG
- Root layout includes dynamic metadata
- Each page can override title, description, and OG images
- Structured data ready (schema.json integration optional)

### Sitemap & Robots
- Future: Auto-generated sitemap via `app/sitemap.ts`
- Future: Robots.txt configuration

## 🔐 Security

### Row Level Security (RLS)
All Supabase tables have RLS enabled:

- **Public Read**: Anyone can view prompts, videos, services
- **Admin Write**: Only authenticated admins can create/edit/delete
- **Messages**: Anyone can submit contact form messages

**To authenticate as admin:**
1. Create an app-specific password or use API tokens
2. Implement Supabase Auth in `/app/(admin)` (coming soon)

### Environment Variables
- **DO NOT COMMIT** `.env.local` to Git
- `.env.local` is already in `.gitignore`
- Always use `NEXT_PUBLIC_` prefix for client-side vars only (careful with sensitive data)

## 📚 Scripts

```bash
# Development
npm run dev           # Start dev server (localhost:3000)

# Production
npm run build         # Build for production
npm run start         # Start production server

# Linting
npm run lint          # Run ESLint

# Database
npm run generate:types # (Placeholder) Generate TypeScript types from live Supabase schema
                       # See below for manual setup
```

## 🔄 Type Generation (Advanced)

Currently using **hand-crafted types** in `types/db.ts`.

To auto-generate types from your live Supabase schema later:

```bash
# Option 1: Use Supabase CLI
npx supabase gen types typescript --local > types/db.ts

# Option 2: Use supabase-js type generator
npm install --save-dev supabase-js-types
```

Then update the script in `package.json`:

```json
"generate:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/db.ts"
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Import project in Vercel
# - Visit vercel.com → New Project
# - Select your GitHub repo
# - Add env variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
# - Click Deploy
```

### Manual Deployment

```bash
npm run build       # Creates .next folder
npm run start       # Start production server on port 3000
```

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

### Missing Environment Variables
Ensure `.env.local` exists with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Fix ESLint errors
npm run lint -- --fix
```

## 🚧 Coming Soon

- [ ] Admin Dashboard (`/app/(admin)/dashboard`)
- [ ] AI Prompts Library with filtering and copy-to-clipboard
- [ ] YouTube Video Gallery (dynamic from Supabase)
- [ ] Contact Form with email notifications
- [ ] Blog Section with MDX support
- [ ] Dark/Light Mode Toggle
- [ ] Analytics Integration (Plausible/Vercel Analytics)

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Email: hello@devai.com
- Twitter: [@devai](https://twitter.com/devai)

## 📄 License

MIT License - see LICENSE file for details

## 👏 Credits

- **Design Inspiration**: Neon glassmorphism UI trends
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: [Supabase](https://supabase.com/)

---

**Built with ❤️ by DevAI**
"# AK-With-AI" 
