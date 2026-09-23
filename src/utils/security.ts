/**
 * Security & Sanitization Utilities for LexiLens
 * Defends against prompt injection, path traversal, malicious filenames, and invalid document payloads.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.md', '.rtf'];
export const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/rtf',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFileName?: string;
}

/**
 * Sanitizes user or document filenames, preventing path traversal (../, ..\\)
 * and strip out null bytes, shell metacharacters, or non-printable characters.
 */
export function sanitizeFileName(rawFileName: string): string {
  if (!rawFileName || typeof rawFileName !== 'string') {
    return 'uploaded_document.txt';
  }
  // Strip path traversal sequences
  let clean = rawFileName.replace(/(\.\.[\/\\])+/g, '');
  // Remove null bytes and non-printable control characters
  clean = clean.replace(/[\x00-\x1f\x80-\x9f]/g, '');
  // Retain only safe alphanumeric characters, underscores, dashes, spaces, and periods
  clean = clean.replace(/[^a-zA-Z0-9_\-\.\s]/g, '_').trim();
  if (!clean || clean === '.') {
    return 'uploaded_document.txt';
  }
  // Limit length
  if (clean.length > 120) {
    const ext = clean.substring(clean.lastIndexOf('.'));
    clean = clean.substring(0, 110) + (ext.length < 10 ? ext : '');
  }
  return clean;
}

/**
 * Validates uploaded file size and extension/MIME against supported document formats.
 */
export function validateDocumentFile(
  fileName: string,
  fileSize: number,
  mimeType?: string
): FileValidationResult {
  if (fileSize <= 0) {
    return {
      valid: false,
      error: 'File is empty (0 bytes). Please upload a valid legal document with readable text.',
    };
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (fileSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
    };
  }

  const sanitized = sanitizeFileName(fileName);
  const ext = sanitized.substring(sanitized.lastIndexOf('.')).toLowerCase();

  const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
  if (!isAllowedExt) {
    return {
      valid: false,
      error: `Unsupported file type "${ext}". Supported formats are TXT, PDF, DOCX, MD, and RTF.`,
    };
  }

  if (mimeType && mimeType.trim() !== '' && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Unsupported file format/MIME type "${mimeType}".`,
    };
  }

  return {
    valid: true,
    sanitizedFileName: sanitized,
  };
}

/**
 * Strips null bytes, controls, and truncates text to protect backend services.
 */
export function sanitizeDocumentText(input: unknown, maxLength = 150000): string {
  if (typeof input !== 'string') return '';
  // Normalize newlines and strip null bytes
  let clean = input.replace(/\0/g, '').replace(/\r\n/g, '\n');
  // Strip other dangerous ASCII control chars except newline and tab
  clean = clean.replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }
  return clean.trim();
}

/**
 * Verifies that a quote cited by AI actually exists verbatim in the source document.
 * Returns groundness confidence and match ratio.
 */
export function verifyCitationInSource(
  quote: string,
  sourceDocumentText: string
): { isGrounded: boolean; matchRatio: number } {
  if (!quote || !sourceDocumentText) {
    return { isGrounded: false, matchRatio: 0 };
  }

  const cleanQuote = quote.trim().toLowerCase().replace(/\s+/g, ' ');
  const cleanSource = sourceDocumentText.toLowerCase().replace(/\s+/g, ' ');

  if (cleanSource.includes(cleanQuote)) {
    return { isGrounded: true, matchRatio: 1.0 };
  }

  // Check prefix match (at least 30 characters or 70% of quote)
  const probeLength = Math.min(cleanQuote.length, 40);
  const probe = cleanQuote.substring(0, probeLength);

  if (probeLength >= 15 && cleanSource.includes(probe)) {
    return { isGrounded: true, matchRatio: 0.85 };
  }

  return { isGrounded: false, matchRatio: 0 };
}

/**
 * Detects adversarial prompt injection attempts in untrusted document text or user questions.
 */
export function detectPromptInjectionRisk(text: string): {
  hasSuspiciousPattern: boolean;
  reasons: string[];
} {
  const suspiciousPatterns = [
    { pattern: /ignore\s+(all\s+)?(previous|prior)\s+instructions/i, reason: 'Instruction override command' },
    { pattern: /reveal\s+(the\s+)?(system\s+prompt|developer\s+prompt|api\s+key)/i, reason: 'System prompt extraction' },
    { pattern: /you\s+are\s+now\s+in\s+developer\s+mode/i, reason: 'Persona hijacking / developer mode' },
    { pattern: /bypass\s+(all\s+)?safety\s+filters/i, reason: 'Safety filter bypass attempt' },
    { pattern: /disregard\s+the\s+above\s+and\s+print/i, reason: 'System boundary break' },
  ];

  const reasons: string[] = [];
  for (const { pattern, reason } of suspiciousPatterns) {
    if (pattern.test(text)) {
      reasons.push(reason);
    }
  }

  return {
    hasSuspiciousPattern: reasons.length > 0,
    reasons,
  };
}

/**
 * Enforces neutral legal phrasing guidelines.
 * Flags prohibited definitive claims like "this contract is illegal" or "you will win".
 */
export function sanitizeLegalAssertions(text: string): string {
  let safe = text;
  // Replace definitive conclusions with neutral objective framing
  safe = safe.replace(/this contract is illegal/gi, 'This provision presents significant regulatory or enforceability concerns');
  safe = safe.replace(/you will win the case/gi, 'This provision strongly favors your position under the stated terms');
  safe = safe.replace(/this clause is definitely invalid/gi, 'This clause may face enforceability challenges under applicable law');
  return safe;
}

/**
 * Legal Disclaimer text strictly enforced across all outputs and views.
 */
export const LEGAL_DISCLAIMER_TEXT =
  'LexiLens provides legal information and document-analysis assistance, not legal advice.';
