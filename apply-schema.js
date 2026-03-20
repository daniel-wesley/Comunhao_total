import { supabase } from './src/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

async function applySchema() {
  const sqlPath = path.join(process.cwd(), 'supabase/migrations/20250901154502_9c574de0-ec23-45e4-ac52-e45dda269f28.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Applying schema...');
  const { error } = await supabase.rpc('exec_sql', { sql_string: sql });

  if (error) {
    console.error('Error applying schema:', error);
    console.log('Note: If "exec_sql" function does not exist, you must run the SQL manually in the Supabase SQL Editor.');
  } else {
    console.log('Schema applied successfully!');
  }
}

// applySchema();
console.log('Script created. Manual execution required if RPC not available.');
