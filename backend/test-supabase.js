const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('institutions').select('*').limit(1);
        if (error) {
            fs.writeFileSync('error_dump.json', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } else {
            console.log('Success!', data);
        }
    } catch (err) {
        fs.writeFileSync('error_dump.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    }
}

test();
