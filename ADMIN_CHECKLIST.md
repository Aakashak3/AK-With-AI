# Admin System Setup Checklist

## Pre-Setup Requirements
- [ ] Supabase project created
- [ ] Supabase environment variables added to `.env.local`
- [ ] Database tables created (from `supabase/schema.sql`)

## Step-by-Step Setup

### 1. Update RLS Policies
- [ ] Open Supabase SQL Editor
- [ ] Paste content from `supabase/admin-rls-policies.sql`
- [ ] Run the SQL query
- [ ] Verify no errors in output
- [ ] Update admin email list if needed (search for `admin@devai.com`)

### 2. Create Admin User
Choose one method:

#### Method A: Using Setup Script
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
- [ ] Run: `node scripts/setup-admin.js`
- [ ] Verify user created successfully
- [ ] Note the credentials provided

#### Method B: Manual Setup via Dashboard
- [ ] Open Supabase → Authentication → Users
- [ ] Click "Add user manually"
- [ ] Email: `admin@devai.com`
- [ ] Password: `password123`
- [ ] Check "Auto confirm user"
- [ ] Save

### 3. Test Authentication
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to: http://localhost:3000/admin
- [ ] Enter email: `admin@devai.com`
- [ ] Enter password: `password123`
- [ ] Should redirect to `/admin/dashboard`

### 4. Test Dashboard Features
- [ ] **Dashboard Home** - Stats should load
  - [ ] Prompts count displays
  - [ ] Videos count displays
  - [ ] Services count displays
  - [ ] Messages count displays

- [ ] **Prompts Management**
  - [ ] Click "Add Prompt" button
  - [ ] Fill form and submit
  - [ ] New prompt appears in table
  - [ ] Edit existing prompt
  - [ ] Delete a prompt (confirm dialog)

- [ ] **Videos Management**
  - [ ] Click "Add Video" button
  - [ ] Paste YouTube URL
  - [ ] Thumbnail loads automatically
  - [ ] Create/Edit/Delete works

- [ ] **Services Management**
  - [ ] Create new service
  - [ ] Add price
  - [ ] Search functionality works
  - [ ] Edit and delete work

- [ ] **Messages Inbox**
  - [ ] Messages display in list
  - [ ] Click message to view details
  - [ ] Can delete messages
  - [ ] Stats calculate correctly

### 5. Sidebar Features
- [ ] Click collapse button (←)
- [ ] Sidebar collapses to icons
- [ ] Click expand button (→)
- [ ] Sidebar expands back
- [ ] All navigation links work
- [ ] "Logout" button works

### 6. Production Preparation
- [ ] Change default password
- [ ] Add all admin email addresses to auth context
- [ ] Update RLS policy with all admin emails
- [ ] Test with multiple admin accounts
- [ ] Delete test data
- [ ] Enable HTTPS (if not already)
- [ ] Set up monitoring

## File Checklist

Created files:
- [ ] `lib/auth-context.tsx` - Authentication context
- [ ] `app/admin/page.tsx` - Login page
- [ ] `app/admin/dashboard/layout.tsx` - Protected layout
- [ ] `app/admin/dashboard/page.tsx` - Dashboard overview
- [ ] `app/admin/dashboard/prompts/page.tsx` - Prompts CRUD
- [ ] `app/admin/dashboard/videos/page.tsx` - Videos CRUD
- [ ] `app/admin/dashboard/services/page.tsx` - Services CRUD
- [ ] `app/admin/dashboard/messages/page.tsx` - Messages inbox
- [ ] `components/admin/AdminSidebar.tsx` - Sidebar component
- [ ] `scripts/setup-admin.js` - Admin setup script
- [ ] `supabase/admin-rls-policies.sql` - RLS policies
- [ ] `ADMIN_SETUP.md` - Full setup documentation

Modified files:
- [ ] `app/layout.tsx` - Added AuthProvider wrapper

## Customization Tasks

### Optional Enhancements
- [ ] Add email notifications for new messages
- [ ] Add user profile editing
- [ ] Add password reset functionality
- [ ] Add activity logging
- [ ] Add bulk operations (select multiple items)
- [ ] Add export functionality (CSV/JSON)
- [ ] Add advanced search filters
- [ ] Add two-factor authentication

### Customization Points
1. **Admin Emails List** - `lib/auth-context.tsx`
2. **Sidebar Items** - `components/admin/AdminSidebar.tsx`
3. **Demo Credentials** - `app/admin/page.tsx`
4. **Color Scheme** - Update Tailwind classes
5. **Table Columns** - Each CRUD page
6. **Form Fields** - Each panel's form section

## Database Operations

### Create Sample Data
For manual testing:

```sql
-- Sample prompt category
INSERT INTO prompt_categories (name, slug, icon)
VALUES ('Marketing', 'marketing', '📱');

-- Sample prompt
INSERT INTO prompts (title, description, content, category_id, is_featured)
VALUES ('Email Campaign Strategy', 'Create effective email campaigns', 'Your email content here...', '{category_id}', true);

-- Sample service
INSERT INTO services (name, description, price)
VALUES ('Web Development', 'Full-stack web development services', 99.99);
```

## Troubleshooting Checklist

### Login Issues
- [ ] Email address matches exactly (case-sensitive)
- [ ] User exists in Supabase Auth
- [ ] Environment variables are correct
- [ ] CORS is not blocking requests
- [ ] Browser cookies enabled

### Dashboard Access Issues
- [ ] Session is active (check browser Storage)
- [ ] Email in ADMIN_EMAILS list
- [ ] RLS policies deployed
- [ ] No network errors in console

### CRUD Operation Issues
- [ ] RLS policies allow INSERT/UPDATE/DELETE
- [ ] User authenticated and admin
- [ ] All required fields filled
- [ ] No duplicate entries (if applicable)

## Performance Notes

### Optimization Done
- ✅ RLS policies for security
- ✅ Indexes on frequently queried columns
- ✅ Client-side filtering and sorting
- ✅ Lazy loading of images
- ✅ Optimized table rendering

### Monitor These
- Dashboard load time
- CRUD operation response time
- Database query time
- Network request size

## Security Checklist

- [ ] Default password changed
- [ ] RLS policies tested
- [ ] Service role key not exposed
- [ ] Admin emails list up to date
- [ ] Supabase backup enabled
- [ ] Regular password rotation policy
- [ ] Two-factor authentication enabled
- [ ] Activity logs reviewed

## Deployment Checklist

Before going to production:
- [ ] All tests passed
- [ ] Environment variables set on hosting
- [ ] Database backups configured
- [ ] RLS policies tested with real data
- [ ] Admin users created
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Monitoring set up

---

**Total Estimated Time:** 30-45 minutes

**Need Help?** Refer to `ADMIN_SETUP.md` for detailed instructions.
