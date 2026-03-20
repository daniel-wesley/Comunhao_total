
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMinistries() {
  console.log('Checking ministries table on:', supabaseUrl);
  
  const { data: ministries, error } = await supabase.from('ministries').select('*').limit(1);
  
  if (error) {
    console.error('SELECT MINISTRIES ERROR:', error.message);
    if (error.message.includes('relation "public.ministries" does not exist')) {
        console.log('CRITICAL: Table "ministries" does not exist.');
    }
  } else {
    console.log('Table "ministries" exists and is accessible.');
    console.log('Sample data:', ministries);
  }
}

checkMinistries();
