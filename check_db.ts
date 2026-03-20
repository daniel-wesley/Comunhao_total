
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('Checking storage buckets on:', supabaseUrl);
  
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('LIST BUCKETS ERROR:', error.message);
  } else {
    console.log('Existing Buckets:', buckets?.map(b => b.name));
    const target = 'member-photos';
    const exists = buckets?.some(b => b.name === target);
    console.log(`Bucket [${target}] exists: ${exists}`);
  }
}

checkStorage();
