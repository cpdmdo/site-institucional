// src/lib/supabase-client.js

// Importa a função de criação de cliente do Supabase
import { createClient } from '@supabase/supabase-js';

// Define as variáveis de ambiente. Elas devem ter o prefixo NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cria a instância do cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);