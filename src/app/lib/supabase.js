// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Certifique-se de que estas variáveis de ambiente estão definidas no seu arquivo .env.local
const supabaseUrl = https://vfusutiopoizmlwmevum.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmdXN1dGlvcG9pem1sd21ldnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjQ3NDIsImV4cCI6MjA3MzgwMDc0Mn0.SfQmRBJwVuuEyGKUlBTFa3PlDIcB80B6LojigE7F9zk

// Cria uma única instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)