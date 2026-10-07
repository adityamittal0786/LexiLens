import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  analyzeDocumentAPI,
  askDocumentAPI,
  compareDocumentsAPI,
  extractFileAPI,
} from '../services/api';
import { CONTRACT_V1_TEXT, SAMPLE_V1_ANALYSIS } from '../data/sampleContracts';

describe('Services & API Fallback Robustness Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('analyzeDocumentAPI returns structured analysis for Demo contract', async () => {
    const analysis = await analyzeDocumentAPI(
      CONTRACT_V1_TEXT,
      'Freelance Services V1',
      'Services Agreement',
      'india'
    );

    expect(analysis).toBeDefined();
    expect(analysis.documentTitle).toContain('Freelance Software Services');
    expect(analysis.jurisdiction).toBe('india');
    expect(analysis.clauses.length).toBeGreaterThan(0);
    expect(analysis.beforeYouSignScorecard.length).toBeGreaterThan(0);
  });

  it('askDocumentAPI returns grounded answer with citations when offline or mocked', async () => {
    // Test answering about termination
    const answer = await askDocumentAPI(
      CONTRACT_V1_TEXT,
      'What are the termination conditions?',
      'Freelance Agreement',
      'doc_only'
    );

    expect(answer).toBeDefined();
    expect(answer.content).toContain('terminate');
    expect(answer.evidence).toBeDefined();
    expect(answer.evidence?.length).toBeGreaterThan(0);
    expect(answer.isNotFoundInDoc).toBe(false);
  });

  it('askDocumentAPI answers payment inquiries accurately', async () => {
    const answer = await askDocumentAPI(
      CONTRACT_V1_TEXT,
      'How much is the fee and payment terms?',
      'Freelance Agreement',
      'doc_only'
    );

    expect(answer.content).toContain('50,000');
    expect(answer.confidence).toBe('High');
  });

  it('compareDocumentsAPI compares versions and produces statistics', async () => {
    const result = await compareDocumentsAPI(
      '₹50,000 fixed fee',
      '₹45,000 fixed fee',
      'Freelance Agreement Version 1',
      'Freelance Agreement Version 2'
    );

    expect(result).toBeDefined();
    expect(result.differences.length).toBeGreaterThan(0);
    expect(result.stats).toBeDefined();
  });

  it('extractFileAPI sends base64 file data and returns parsed document text', async () => {
    const mockFile = new File(['Contract body content with sections and clauses'], 'agreement.txt', {
      type: 'text/plain',
    });

    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'Contract body content with sections and clauses',
        fileName: 'agreement.txt',
        wordCount: 7,
        title: 'agreement',
      }),
    } as any);

    const extracted = await extractFileAPI(mockFile);
    expect(extracted.text).toContain('Contract body content');
    expect(extracted.fileName).toBe('agreement.txt');
    expect(extracted.wordCount).toBe(7);
  });
});
