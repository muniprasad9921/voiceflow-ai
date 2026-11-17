-- VoiceFlow AI Storage Buckets & Policies
-- Migration: 003_storage_buckets.sql

-- 1. Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('call-recordings', 'call-recordings', false, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg']),
  ('knowledge-documents', 'knowledge-documents', false, 20971520, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies
-- Objects in call-recordings bucket are structured as: {organization_id}/{call_id}.mp3
CREATE POLICY "Org members can read their own call recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'call-recordings'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can upload call recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'call-recordings'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

-- Objects in knowledge-documents bucket are structured as: {organization_id}/{document_id}.ext
CREATE POLICY "Org members can read their own knowledge documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can upload knowledge documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);

CREATE POLICY "Org members can delete their own knowledge documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-documents'
  AND (storage.foldername(name))[1]::uuid IN (SELECT current_user_org_ids())
);
