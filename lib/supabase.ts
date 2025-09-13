import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type ConversionStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type InputMethod = 'upload' | 'link';

export interface Conversion {
  id: string;
  original_filename: string;
  original_format: string;
  target_format: string;
  file_size: number;
  conversion_status: ConversionStatus;
  download_url?: string;
  input_method: InputMethod;
  source_url?: string;
  created_at: string;
  completed_at?: string;
}