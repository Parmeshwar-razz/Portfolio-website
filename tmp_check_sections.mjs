import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const [k, ...v] = line.split('=');
    if (k && v.length > 0) acc[k.trim()] = v.join('=').trim();
    return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkSections() {
    const { data, error } = await supabase
        .from('sections')
        .select('name, is_visible, order_index')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching sections:', error);
        return;
    }

    console.log('--- START ---');
    data.forEach(s => {
        console.log(`NAME: [${s.name}] | LENGTH: ${s.name.length} | VISIBLE: ${s.is_visible}`);
    });
    console.log('--- END ---');
}

checkSections();
