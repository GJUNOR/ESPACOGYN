require("dotenv").config();

console.log("========== SUPABASE DEBUG ==========");
console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY EXISTE:", !!process.env.SUPABASE_KEY);
console.log("====================================");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

module.exports = supabase;