ALTER TABLE public.guests 
ADD CONSTRAINT uk_guests_document UNIQUE (document_type, document_number);