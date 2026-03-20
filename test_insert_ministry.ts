
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertMinistry() {
  console.log('Testing INSERT on ministries table...');
  
  const testData = {
    name: 'Test Ministry ' + new Date().getTime(),
    description: 'Testing registration error'
  };

  const { data, error } = await supabase
    .from('ministries')
    .insert(testData)
    .select()
    .single();
  
  if (error) {
    console.error('INSERT ERROR:', error.message);
    console.error('ERROR DETAILS:', error);
  } else {
    console.log('INSERT SUCCESSFUL:', data);
    // Cleanup
    await supabase.from('ministries').delete().eq('id', data.id);
  }
}

testInsertMinistry();
