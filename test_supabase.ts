import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing select...");
  const { data: selectData, error: selectError } = await supabase
    .from("job_postings")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (selectError) {
    console.error("Select error:", selectError);
  } else {
    console.log("Select success, rows:", selectData?.length);
  }

  console.log("Testing insert...");
  const { data: insertData, error: insertError } = await supabase
    .from("job_postings")
    .insert({
      id: "test-" + Date.now(),
      title: "Test",
      department: "Test Dept",
      type: "Attachment",
      description: "Test Desc",
      deadline: "2026-12-31"
    })
    .select();

  if (insertError) {
    console.error("Insert error:", insertError);
  } else {
    console.log("Insert success:", insertData);
  }
}

test();
