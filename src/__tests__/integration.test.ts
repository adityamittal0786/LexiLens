import { describe, it, expect } from 'vitest';
import { CONTRACT_V1_TEXT, CONTRACT_V2_TEXT, SAMPLE_V1_ANALYSIS } from '../data/sampleContracts';
import { chunkDocument, retrieveRelevantChunks } from '../utils/chunking';
import { compareDocumentTexts } from '../utils/comparison';
import { verifyCitationInSource } from '../utils/security';
import { DocumentAnalysis } from '../types';

describe('Integration Tests: End-to-End Analysis Workflow', () => {
  it('validates structure of complete DocumentAnalysis object', () => {
    const analysis: DocumentAnalysis = SAMPLE_V1_ANALYSIS;

    expect(analysis.documentTitle).toBeDefined();
    expect(analysis.executiveSummary).toBeTruthy();
    expect(analysis.parties.length).toBeGreaterThanOrEqual(2);
    expect(analysis.partyAObligations.length).toBeGreaterThan(0);
    expect(analysis.partyBObligations.length).toBeGreaterThan(0);
    expect(analysis.clauses.length).toBeGreaterThanOrEqual(5);
    expect(analysis.potentialIssues.length).toBeGreaterThanOrEqual(2);
    expect(analysis.beforeYouSignScorecard.length).toBeGreaterThanOrEqual(3);
    expect(analysis.questionsForLawyer.length).toBeGreaterThanOrEqual(3);
    expect(analysis.actionChecklist.length).toBeGreaterThanOrEqual(3);

    // Verify all clauses have plain English explanations and doc references
    for (const clause of analysis.clauses) {
      expect(clause.plainEnglish).toBeTruthy();
      expect(clause.docReference).toBeTruthy();
      expect(clause.confidence).toMatch(/High|Medium|Low/);
    }
  });

  it('performs end-to-end question retrieval and evidence grounding against contract', () => {
    const chunks = chunkDocument(CONTRACT_V1_TEXT, 60, 10);
    expect(chunks.length).toBeGreaterThan(3);

    // User asks about non-compete
    const retrieved = retrieveRelevantChunks('non-compete restriction', chunks, 1);
    expect(retrieved.length).toBe(1);
    const topChunk = retrieved[0].chunk;

    expect(topChunk.text.toLowerCase()).toContain('non-compete');

    // Simulate grounded answer generation
    const extractedQuote = 'Contractor shall not directly or indirectly provide software engineering services to any competitor';
    const verification = verifyCitationInSource(extractedQuote, CONTRACT_V1_TEXT);
    expect(verification.isGrounded).toBe(true);
  });

  it('runs end-to-end document comparison workflow across two real contract versions', () => {
    const comparison = compareDocumentTexts(
      'Freelance Services V1',
      'Freelance Services V2 (Revised)',
      CONTRACT_V1_TEXT,
      CONTRACT_V2_TEXT
    );

    expect(comparison.stats.added).toBeGreaterThanOrEqual(0);
    expect(comparison.stats.modified).toBeGreaterThan(0);
    expect(comparison.differences.length).toBeGreaterThan(0);

    for (const diff of comparison.differences) {
      expect(diff.plainMeaning).toBeTruthy();
      expect(diff.potentialSignificance).toBeTruthy();
      expect(diff.questionsToConsider).toBeTruthy();
    }
  });
});
