require("dotenv").config();

console.log("ENV SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("ENV SUPABASE_KEY EXISTE:", !!process.env.SUPABASE_KEY);

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

module.exports = supabase;