import { createClient } from "@supabase/supabase-js";


export const supabase = createClient(
    String(process.env.REACT_APP_SUPABASE_URL),
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZWl4c3RqeHl4ZGJxdWViZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5OTQ1MjksImV4cCI6MjAxMTU3MDUyOX0.S9NLt_yf96o7gaNmNLYQiXqekZ2M55QhxYUWXeqZn5g"
)
