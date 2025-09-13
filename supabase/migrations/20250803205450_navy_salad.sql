/*
# File Conversion Platform Database Schema

1. New Tables
   - `conversions`
     - `id` (uuid, primary key)
     - `original_filename` (text)
     - `original_format` (text)
     - `target_format` (text)
     - `file_size` (bigint)
     - `conversion_status` (text: pending, processing, completed, failed)
     - `download_url` (text, nullable)
     - `input_method` (text: upload, link)
     - `source_url` (text, nullable for link-based conversions)
     - `created_at` (timestamp)
     - `completed_at` (timestamp, nullable)

2. Security
   - Enable RLS on `conversions` table
   - Add policies for public access (since no auth required for MVP)

3. Indexes
   - Add index on conversion_status for filtering
   - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_filename text NOT NULL,
  original_format text NOT NULL,
  target_format text NOT NULL,
  file_size bigint DEFAULT 0,
  conversion_status text DEFAULT 'pending' CHECK (conversion_status IN ('pending', 'processing', 'completed', 'failed')),
  download_url text,
  input_method text DEFAULT 'upload' CHECK (input_method IN ('upload', 'link')),
  source_url text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- Allow public access for MVP (in production, you'd want proper auth)
CREATE POLICY "Allow public read access to conversions"
  ON conversions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to conversions"
  ON conversions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to conversions"
  ON conversions
  FOR UPDATE
  TO anon
  USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversions_status ON conversions(conversion_status);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_input_method ON conversions(input_method);