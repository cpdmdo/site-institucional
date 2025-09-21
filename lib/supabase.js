// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Certifique-se de que estas variáveis de ambiente estão definidas no seu arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cria uma única instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)