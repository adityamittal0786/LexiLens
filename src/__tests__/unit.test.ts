import { describe, it, expect } from 'vitest';
import {
  validateDocumentFile,
  sanitizeFileName,
  sanitizeDocumentText,
  verifyCitationInSource,
  sanitizeLegalAssertions,
  LEGAL_DISCLAIMER_TEXT,
  MAX_FILE_SIZE_BYTES,
} from '../utils/security';
import { chunkDocument, retrieveRelevantChunks } from '../utils/chunking';
import { compareDocumentTexts, extractSections } from '../utils/comparison';

describe('Unit Tests: File Validation & Sanitization', () => {
  it('validates supported document files correctly', () => {
    const validTxt = validateDocumentFile('master_agreement.txt', 1024, 'text/plain');
    expect(validTxt.valid).toBe(true);
    expect(validTxt.sanitizedFileName).toBe('master_agreement.txt');

    const validDocx = validateDocumentFile('consulting_contract.docx', 50000);
    expect(validDocx.valid).toBe(true);

    const validMd = validateDocumentFile('terms.md', 2048, 'text/markdown');
    expect(validMd.valid).toBe(true);
  });

  it('rejects empty files (0 bytes)', () => {
    const emptyFile = validateDocumentFile('blank.txt', 0);
    expect(emptyFile.valid).toBe(false);
    expect(emptyFile.error).toContain('empty');
  });

  it('rejects oversized files exceeding 10MB limit', () => {
    const largeFile = validateDocumentFile('huge_dossier.pdf', MAX_FILE_SIZE_BYTES + 1024);
    expect(largeFile.valid).toBe(false);
    expect(largeFile.error).toContain('exceeds maximum allowed limit');
  });

  it('rejects unsupported and potentially dangerous executable formats', () => {
    const exeFile = validateDocumentFile('installer.exe', 4096, 'application/x-msdownload');
    expect(exeFile.valid).toBe(false);
    expect(exeFile.error).toContain('Unsupported file type');

    const shFile = validateDocumentFile('script.sh', 1024);
    expect(shFile.valid).toBe(false);
  });

  it('sanitizes malicious filenames and prevents path traversal', () => {
    expect(sanitizeFileName('../../etc/passwd')).toBe('etc_passwd');
    expect(sanitizeFileName('..\\..\\windows\\system32\\cmd.exe')).toBe('windows_system32_cmd.exe');
    expect(sanitizeFileName('contract\0file.txt')).toBe('contractfile.txt');
    expect(sanitizeFileName('normal-document_2025.txt')).toBe('normal-document_2025.txt');
  });

  it('sanitizes text, stripping null bytes and dangerous control chars while preserving newlines', () => {
    const raw = "Section 1: Payment\0\x07\x1B\nTotal fee is $5,000.\r\nTerms: Net-30.";
    const cleaned = sanitizeDocumentText(raw);
    expect(cleaned).not.toContain('\0');
    expect(cleaned).not.toContain('\x07');
    expect(cleaned).toContain('Section 1: Payment\nTotal fee is $5,000.');
  });
});

describe('Unit Tests: Citation & Grounding Verification', () => {
  const sourceDoc = `
    SECTION 3. TERMINATION
    Either Party may terminate this Agreement without cause upon providing thirty (30) days prior written notice.
    SECTION 4. INTELLECTUAL PROPERTY
    All deliverables shall become property of the Client only upon receipt of full and final payment.
  `;

  it('verifies exact quote matches in source text', () => {
    const quote = 'Either Party may terminate this Agreement without cause upon providing thirty (30) days';
    const result = verifyCitationInSource(quote, sourceDoc);
    expect(result.isGrounded).toBe(true);
    expect(result.matchRatio).toBeGreaterThanOrEqual(0.85);
  });

  it('detects fabricated citations not present in the document', () => {
    const fakeQuote = 'The contractor shall be liable for treble punitive damages of $10,000,000';
    const result = verifyCitationInSource(fakeQuote, sourceDoc);
    expect(result.isGrounded).toBe(false);
    expect(result.matchRatio).toBe(0);
  });
});

describe('Unit Tests: Text Chunking & RAG Retrieval', () => {
  const sampleAgreement = `
SECTION 1. SCOPE OF SERVICES
The Consultant agrees to provide software engineering and architecture consulting services as outlined in Statement of Work.

SECTION 2. COMPENSATION AND PAYMENT
Client shall pay Consultant a fixed sum of Fifty Thousand Dollars ($50,000), payable in two tranches upon milestone completion.
All undisputed invoices are payable within 30 days of receipt.

SECTION 3. TERM AND TERMINATION
This Agreement shall commence on February 1, 2025 and expire on February 1, 2026 unless terminated earlier.
Either party may terminate for convenience with 30 days written notice.
  `;

  it('splits text into coherent chunks and preserves section headers', () => {
    const chunks = chunkDocument(sampleAgreement, 30, 5);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((c) => c.sectionHeader.includes('SECTION 1'))).toBe(true);
    expect(chunks.some((c) => c.sectionHeader.includes('SECTION 2'))).toBe(true);
  });

  it('retrieves relevant chunks for targeted questions', () => {
    const chunks = chunkDocument(sampleAgreement, 40, 5);
    const paymentResults = retrieveRelevantChunks('How much is the fee and payment terms?', chunks, 2);
    expect(paymentResults.length).toBeGreaterThan(0);
    expect(paymentResults[0].chunk.text).toContain('COMPENSATION');
    expect(paymentResults[0].score).toBeGreaterThan(0);

    const termResults = retrieveRelevantChunks('What is the termination notice period?', chunks, 2);
    expect(termResults.length).toBeGreaterThan(0);
    expect(termResults[0].chunk.text.toLowerCase()).toContain('terminat');
  });
});

describe('Unit Tests: Comparison & Diff Logic', () => {
  const docA = `
SECTION 1. FEES
Total fee is $50,000 payable Net 30.

SECTION 2. TERMINATION
Termination requires 30 days written notice.

SECTION 3. NON-COMPETE
Contractor shall not engage in competing businesses for 12 months.
  `;

  const docB = `
SECTION 1. FEES
Total fee is $45,000 payable Net 60.

SECTION 2. TERMINATION
Termination requires 60 days written notice.
  `;

  it('extracts sections correctly from legal text', () => {
    const sectionsA = extractSections(docA);
    expect(sectionsA.length).toBe(3);
    expect(sectionsA[0].category).toBe('Payment');
    expect(sectionsA[1].category).toBe('Termination');
    expect(sectionsA[2].category).toBe('Restrictive Covenants');
  });

  it('compares documents and calculates added, removed, and modified counts accurately', () => {
    const result = compareDocumentTexts('Contract A', 'Contract B', docA, docB);
    expect(result.stats.modified).toBe(2); // FEES and TERMINATION modified
    expect(result.stats.removed).toBe(1); // NON-COMPETE removed
    expect(result.differences.length).toBe(3);

    const removedItem = result.differences.find((d) => d.changeType === 'removed');
    expect(removedItem?.clauseTitle).toContain('NON-COMPETE');
  });
});

describe('Unit Tests: Legal Safety Phrasing & Disclaimers', () => {
  it('enforces mandatory exact legal disclaimer text', () => {
    expect(LEGAL_DISCLAIMER_TEXT).toBe(
      'LexiLens provides legal information and document-analysis assistance, not legal advice.'
    );
  });

  it('sanitizes overreaching definitive legal assertions into objective observations', () => {
    const rawAssertion = 'This contract is illegal under state laws and you will win the case.';
    const sanitized = sanitizeLegalAssertions(rawAssertion);
    expect(sanitized).not.toContain('this contract is illegal');
    expect(sanitized).not.toContain('you will win the case');
    expect(sanitized).toContain('concerns');
  });
});
