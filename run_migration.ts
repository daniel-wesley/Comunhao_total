
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY; // Note: Usually service_role key is needed for DDL, but we'll try with what we have or advise.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const sqlPath = path.resolve('supabase/migrations/20250901154502_9c574de0-ec23-45e4-ac52-e45dda269f28.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Attempting to run migration via RPC...');
  
  // Note: Standard Supabase API doesn't allow raw SQL unless an RPC function is explicitly created for it.
  // We'll check if we can at least detect the failure and provide clear guidance.
  const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

  if (error) {
    if (error.message.includes('function "exec_sql" does not exist')) {
      console.error('CRITICAL: The "exec_sql" function is not present in your Supabase project.');
      console.log('Standard Supabase policy prevents running raw SQL from the client for security.');
      console.log('You MUST run the SQL manually in the SQL Editor.');
    } else {
      console.error('Error running SQL:', error);
    }
  } else {
    console.log('Migration successful!');
  }
}

runMigration();
