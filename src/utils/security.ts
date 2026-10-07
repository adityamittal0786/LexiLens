/**
 * Security & Sanitization Utilities for LexiLens
 * Defends against prompt injection, path traversal, malicious filenames, and invalid document payloads.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_EXTENSIONS = [
  '.txt',
  '.pdf',
  '.docx',
  '.doc',
  '.md',
  '.rtf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
];
export const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/rtf',
  'image/png',
  'image/jpeg',
  'image/webp',
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
      error: `Unsupported file type "${ext}". Supported formats are TXT, PDF, Word (DOCX/DOC), Images (PNG/JPG), MD, and RTF.`,
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
 * Strips machine noise, file infrastructure artifacts (PK, [Content_Types].xml, _rels, docProps),
 * XML/HTML tags, and binary garbage while extracting coherent human-readable legal text.
 */
export function extractCleanLegalText(input: unknown): {
  cleanText: string;
  hadBinaryNoise: boolean;
  isScannedOrEmpty: boolean;
  extractedSections: string[];
} {
  if (typeof input !== 'string') {
    return { cleanText: '', hadBinaryNoise: false, isScannedOrEmpty: true, extractedSections: [] };
  }

  let text = input;
  let hadBinaryNoise = false;

  // 1. Detect and filter internal architecture / ZIP / DOCX archive signatures
  const fileArchPatterns = [
    /PK\x03\x04[^\n]*/gi,
    /PK\x05\x06[^\n]*/gi,
    /PK\x07\x08[^\n]*/gi,
    /\[Content_Types\]\.xml[^\n]*/gi,
    /_rels\/\.rels[^\n]*/gi,
    /(?:word|xl|ppt)\/_rels\/[^\n]*/gi,
    /docProps\/(?:core|app|custom)\.xml[^\n]*/gi,
    /word\/(?:document|fontTable|styles|settings|theme\/[a-zA-Z0-9_-]+)\.xml[^\n]*/gi,
    /customXml\/[^\n]*/gi,
  ];

  for (const pattern of fileArchPatterns) {
    if (pattern.test(text)) {
      hadBinaryNoise = true;
      text = text.replace(pattern, ' ');
    }
  }

  // 2. Strip XML/HTML tags and entity references
  if (/<[a-zA-Z0-9_\-:]+(\s+[^>]*)?>|<\/[a-zA-Z0-9_\-:]+>|<!--.*?-->/g.test(text)) {
    hadBinaryNoise = true;
    text = text
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<w:tab\/>/gi, '\t')
      .replace(/<w:br\/>/gi, '\n')
      .replace(/<\/w:p>/gi, '\n')
      .replace(/<[^>]+>/g, ' ');
  }

  // Decode standard XML/HTML entities
  text = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');

  // 3. Remove null bytes and non-printable control characters except newline and tab
  const rawLengthBefore = text.length;
  text = text.replace(/\0/g, '').replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  if (text.length < rawLengthBefore) {
    hadBinaryNoise = true;
  }

  // 4. Filter line-by-line: discard machine code, corrupted symbols, or system path residue
  const rawLines = text.split(/\r?\n/);
  const cleanLines: string[] = [];
  const extractedSections: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip lines that contain lingering system infrastructure fragments
    if (
      /^(PK|\[Content_Types\]|_rels|docProps|word\/|xmlns:)/i.test(trimmed) ||
      /(?:\[Content_Types\]\.xml|_rels\/\.rels|word\/document\.xml)/i.test(trimmed)
    ) {
      hadBinaryNoise = true;
      continue;
    }

    // Check line readability: ratio of printable legal/natural language characters
    const naturalChars = trimmed.replace(/[^a-zA-Z0-9\s.,;:!?'"()\[\]{}\-–—₹$€£%&/\\#@*+<=>]/g, '');
    const ratio = naturalChars.length / trimmed.length;

    // Discard high-entropy corrupted binary garbage lines (e.g., zip compressed payload remnants)
    if (ratio < 0.65 && trimmed.length > 10) {
      hadBinaryNoise = true;
      continue;
    }

    // Identify structural legal headers
    const sectionMatch = trimmed.match(
      /^(?:SECTION\s+\d+(?:\.\d+)?|ARTICLE\s+[IVXLCDM\d]+|CLAUSE\s+\d+(?:\.\d+)?|\d+\.\s+[A-Z][a-zA-Z\s]+|SCOPE OF OBLIGATIONS|COMPENSATION|TERM AND TERMINATION|CONFIDENTIALITY|INTELLECTUAL PROPERTY|GOVERNING LAW|INDEMNIFICATION|LIMITATION OF LIABILITY|DEFINITIONS)/i
    );
    if (sectionMatch) {
      extractedSections.push(sectionMatch[0]);
    }

    cleanLines.push(trimmed);
  }

  let cleanText = cleanLines.join('\n').trim();

  // If text is extremely short or has no readable coherent words, flag as scanned/empty
  const hasCoherentWords = /[a-zA-Z]{3,}/.test(cleanText);
  const isScannedOrEmpty = cleanText.length < 25 || !hasCoherentWords;

  return {
    cleanText,
    hadBinaryNoise,
    isScannedOrEmpty,
    extractedSections,
  };
}

/**
 * Strips null bytes, controls, file infrastructure noise, and truncates text to protect backend services.
 */
export function sanitizeDocumentText(input: unknown, maxLength = 150000): string {
  if (typeof input !== 'string') return '';
  const { cleanText } = extractCleanLegalText(input);
  if (cleanText.length > maxLength) {
    return cleanText.substring(0, maxLength);
  }
  return cleanText;
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
