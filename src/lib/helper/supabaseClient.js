import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;  
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// if (supabaseUrl === undefined) {
//     throw new Error('REACT_APP_SUPABASE_URL is not defined');
// }
// else if (supabaseAnonKey === undefined) {
//     throw new Error('REACT_APP_SUPABASE_ANON_KEY is not defined');
// }

export const supabase = createClient("https://neeixstjxyxdbquebgkc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZWl4c3RqeHl4ZGJxdWViZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5OTQ1MjksImV4cCI6MjAxMTU3MDUyOX0.S9NLt_yf96o7gaNmNLYQiXqekZ2M55QhxYUWXeqZn5g");
