/**
 * Supabase Admin Setup Script
 * Run this script once to create the admin user
 * 
 * Prerequisites:
 * 1. Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in your environment
 * 2. Run: npm install @supabase/supabase-js
 * 3. Run: node scripts/setup-admin.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_EMAIL = 'admin@devai.com';
const ADMIN_PASSWORD = 'password123';

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    
    if (existingUser?.users?.some(u => u.email === ADMIN_EMAIL)) {
      console.log(`Admin user ${ADMIN_EMAIL} already exists!`);
      return;
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

    if (error) {
      throw error;
    }

    console.log('✓ Admin user created successfully!');
    console.log('');
    console.log('Admin Credentials:');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    console.log('');
    
  } catch (err) {
    console.error('Error setting up admin:', err);
    process.exit(1);
  }
}

setupAdmin();
