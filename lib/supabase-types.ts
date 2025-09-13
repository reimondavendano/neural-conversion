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

// Mock data for demonstration
export const mockConversions: Conversion[] = [
  {
    id: '1',
    original_filename: 'presentation.pptx',
    original_format: 'pptx',
    target_format: 'pdf',
    file_size: 2048576,
    conversion_status: 'completed',
    download_url: 'https://example.com/downloads/presentation.pdf',
    input_method: 'upload',
    created_at: new Date(Date.now() - 300000).toISOString(),
    completed_at: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: '2',
    original_filename: 'video.mp4',
    original_format: 'mp4',
    target_format: 'mp3',
    file_size: 15728640,
    conversion_status: 'processing',
    input_method: 'upload',
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '3',
    original_filename: 'document.docx',
    original_format: 'docx',
    target_format: 'pdf',
    file_size: 1024000,
    conversion_status: 'pending',
    input_method: 'link',
    source_url: 'https://example.com/document.docx',
    created_at: new Date(Date.now() - 30000).toISOString(),
  },
];