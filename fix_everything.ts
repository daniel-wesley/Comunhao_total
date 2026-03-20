
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEverything() {
  console.log('--- Starting System Fixes ---');

  // 1. Check and create storage bucket
  console.log('\n1. Checking storage bucket [member-photos]...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
  } else {
    const exists = buckets?.some(b => b.name === 'member-photos');
    if (!exists) {
      console.log('Bucket not found. Attempting to create...');
      // Note: This might fail if using publishable key without proper permissions.
      // But we try anyway as a convenience.
      const { error: createError } = await supabase.storage.createBucket('member-photos', { public: true });
      if (createError) {
        console.error('Error creating bucket:', createError.message);
        console.log('TIP: Run the SQL in supabase/migrations/20250906103936_... manually.');
      } else {
        console.log('Bucket created successfully!');
      }
    } else {
      console.log('Bucket already exists.');
    }
  }

  // 2. Check for ministry_id in members table
  console.log('\n2. Verifying database schema integration...');
  // We can't easily run ALTER TABLE with the publishable key.
  // We'll just verify if we can fetch it.
  const { data: members, error: membersError } = await supabase.from('members').select('ministry_id').limit(1);
  
  if (membersError) {
    console.error('Error accessing members.ministry_id:', membersError.message);
    console.log('TIP: You MUST run the SQL in migrations/20250918000000_add_ministry_to_members.sql manually in the Supabase SQL Editor.');
  } else {
    console.log('Database integration confirmed: ministry_id column is accessible.');
  }

  console.log('\n--- Fixes Completed ---');
}

fixEverything();
