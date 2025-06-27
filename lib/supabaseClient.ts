// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// 到 supabase.com → 你的 Project → 設定 → API 頁面 找到這兩個資訊
const supabaseUrl = 'https://iujzpmfpxhwmymubabfg.supabase.co'      // 複製你專案的網址
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1anpwbWZweGh3bXltdWJhYmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjA0NjcsImV4cCI6MjA2NjQzNjQ2N30.U377sCsq-JiSWaHcP8MgzFyg5EdbSdq18IeVV6YCvRM'          // 複製你的 public anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
