
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
// Note: We need to handle the .env loading which might be in root
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
    const envConfig = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    for (const line of envConfig.split('\n')) {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    }
} catch (e) {
    console.log('No .env file found or error reading it');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching admin_users:', error);
    } else {
        console.log('admin_users data:', data);
        if (data.length === 0) {
            console.log('Table is empty, cannot infer columns from data. Using empty response.');
        }
    }
}

inspectTable();
