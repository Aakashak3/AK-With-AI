# Admin Dashboard Setup Guide

## Overview
This guide will help you set up the complete admin authentication system and dashboard for your DevAI website.

## Features

✅ **Admin Authentication** - Secure login with Supabase Auth  
✅ **Protected Routes** - Only authenticated admins can access dashboard  
✅ **Prompts Management** - Add, edit, delete AI prompts with categories  
✅ **Videos Management** - Manage YouTube videos  
✅ **Services Management** - Create and manage services  
✅ **Messages Inbox** - View and manage contact form submissions  
✅ **Responsive Design** - Mobile-friendly admin panel  
✅ **Dark Theme** - Modern glass-effect UI  

## Quick Setup

### Step 1: Set Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For admin setup script
```

Get these from your Supabase project settings.

### Step 2: Update Supabase RLS Policies

1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and paste the content from `supabase/admin-rls-policies.sql`
4. Run the SQL to create admin-only access policies

**Important:** Update the admin email list in the SQL:
```sql
RETURN auth.jwt() ->> 'email' = ANY(ARRAY['admin@devai.com', 'your-email@example.com']);
```

### Step 3: Create Admin User

#### Option A: Using Script (Recommended)

```bash
# Install dependencies (if not already installed)
npm install

# Set SUPABASE_SERVICE_ROLE_KEY in your .env.local

# Run the setup script
node scripts/setup-admin.js
```

#### Option B: Manual Setup via Supabase Dashboard

1. Go to Supabase → Authentication → Users
2. Click "Add user manually"
3. Email: `admin@devai.com`
4. Password: `password123`
5. Check "Auto confirm user"

### Step 4: Access the Admin Dashboard

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/admin
3. Login with credentials:
   - Email: `admin@devai.com`
   - Password: `password123`

## Admin Dashboard Structure

### Sidebar Navigation
- **Dashboard** - Overview with stats
- **Prompts** - Manage AI prompts and categories
- **Videos** - Manage YouTube videos
- **Services** - Manage services
- **Messages** - View contact submissions

### Dashboard Features

#### Prompts Management
- Create new prompts
- Assign to categories
- Mark as featured
- Search and sort prompts
- Edit/Delete functionality
- Real-time table updates

#### Videos Management
- Add YouTube videos (auto-fetch thumbnail)
- Edit video metadata
- Delete videos
- Search capability
- Grid view with preview

#### Services Management
- Create services with pricing
- Edit service details
- Delete services
- Searchable table
- Price formatting

#### Messages Inbox
- View all contact form messages
- Search and filter
- Read individual messages
- Delete messages
- Reply via email
- Monthly statistics

## File Structure

```
app/
├── admin/
│   ├── page.tsx                 # Login page
│   └── dashboard/
│       ├── layout.tsx           # Protected layout
│       ├── page.tsx             # Dashboard overview
│       ├── prompts/
│       │   └── page.tsx         # Prompts CRUD
│       ├── videos/
│       │   └── page.tsx         # Videos CRUD
│       ├── services/
│       │   └── page.tsx         # Services CRUD
│       └── messages/
│           └── page.tsx         # Messages inbox
components/
├── admin/
│   └── AdminSidebar.tsx         # Collapsible sidebar
lib/
├── auth-context.tsx             # Auth state & functions
└── supabase.ts                  # Supabase client
supabase/
├── schema.sql                   # Database schema
└── admin-rls-policies.sql       # RLS policies
scripts/
└── setup-admin.js               # Admin user setup script
```

## Database Schema

### Tables Used
- `prompts` - AI prompt content
- `prompt_categories` - Prompt categories
- `videos` - YouTube videos
- `services` - Services offered
- `messages` - Contact form messages

### Row Level Security (RLS)

| Table | Anyone | Admin |
|-------|--------|-------|
| prompts | SELECT | INSERT, UPDATE, DELETE |
| videos | SELECT | INSERT, UPDATE, DELETE |
| services | SELECT | INSERT, UPDATE, DELETE |
| prompt_categories | SELECT | INSERT, UPDATE, DELETE |
| messages | INSERT | SELECT, DELETE |

## Adding More Admin Users

### Update the SQL Policy

Edit `supabase/admin-rls-policies.sql` and update:
```sql
RETURN auth.jwt() ->> 'email' = ANY(ARRAY['admin@devai.com', 'new-admin@example.com']);
```

Then re-run in SQL Editor.

### Update Auth Context

Edit `lib/auth-context.tsx`:
```typescript
const ADMIN_EMAILS = ['admin@devai.com', 'new-admin@example.com'];
```

### Create the User

Use either the script or manual method (see Step 3).

## Authentication Flow

```
User visits /admin
    ↓
Login form (email + password)
    ↓
Supabase Auth validates credentials
    ↓
Check if email in ADMIN_EMAILS list
    ↓
✅ Admin → Redirect to /admin/dashboard
❌ Not Admin → Show error & logout
    ↓
Dashboard loads with sidebar & content
    ↓
Sidebar checks auth status on layout level
    ↓
Can access protected admin features
```

## Protected Routes

The dashboard uses a protected layout (`app/admin/dashboard/layout.tsx`) that:
1. Checks if user is logged in
2. Verifies admin status
3. Redirects to login if not authorized
4. Shows loading state while checking auth

## API & Database Calls

All CRUD operations use **Supabase client-side** queries with RLS:
- No separate API routes needed
- Secure by PostgreSQL policies
- Real-time updates possible with subscriptions

## Sample Data

To add sample data:

1. **Sample Prompts**
   - Go to Dashboard → Prompts → Add Prompts
   - Try: "SEO Optimization Guide", "Content Calendar Strategy", etc.

2. **Sample Videos**
   - Add YouTube video URLs
   - Thumbnail auto-fetches from YouTube

3. **Sample Services**
   - Create services with pricing
   - Example: "Web Development", "AI Automation", etc.

## Troubleshooting

### Login not working
- ✓ Check credentials are correct
- ✓ Verify user is created in Supabase Auth
- ✓ Check NEXT_PUBLIC_SUPABASE_URL is correct
- ✓ Verify email is in ADMIN_EMAILS list

### Can't access dashboard
- ✓ Ensure you're logged in (check session)
- ✓ Verify admin email in ADMIN_EMAILS
- ✓ Check RLS policies are set correctly
- ✓ Clear browser cache and login again

### RLS policy errors
- ✓ Ensure SQL was executed in Supabase
- ✓ Check email addresses match exactly
- ✓ Verify function names are correct
- ✓ Check RLS is enabled on tables

### Can't create/edit content
- ✓ Verify RLS policies allow admin INSERT/UPDATE
- ✓ Check you're logged in as admin
- ✓ Try disabling ad blockers (may block requests)
- ✓ Check browser console for errors

## Customization

### Change Admin Emails
1. Edit `lib/auth-context.tsx` - `ADMIN_EMAILS` array
2. Edit `supabase/admin-rls-policies.sql` - Update function
3. Re-run SQL in Supabase editor

### Customize Sidebar
Edit `components/admin/AdminSidebar.tsx` - `SIDEBAR_ITEMS` array

### Change Login Credentials Display
Edit `app/admin/page.tsx` - Demo credentials section

### Add New Admin Sections
1. Create new page in `app/admin/dashboard/[section]/page.tsx`
2. Add to sidebar items
3. Implement CRUD logic using Supabase client

## Security Notes

⚠️ **Important Security Practices:**

1. **Change Default Password** - Never keep `password123` in production
2. **Use Strong Passwords** - At least 12 characters with special chars
3. **Enable 2FA** - In Supabase dashboard settings
4. **Use Service Role Carefully** - Only for admin setup script
5. **Monitor Access** - Check Supabase auth logs regularly
6. **Update Emails List** - Keep RLS policy admin emails current

## Next Steps

1. ✅ Create admin user
2. ✅ Login and test dashboard
3. ✅ Add sample content
4. ✅ Test CRUD operations
5. Customize sidebar and sections
6. Deploy to production
7. Set up monitoring and backups

## Support

For issues:
1. Check browser console for errors
2. Review Supabase logs
3. Verify RLS policies are correct
4. Check environment variables
5. Ensure user role is correct

---

Happy administrating! 🚀
