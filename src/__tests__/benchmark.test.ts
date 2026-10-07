import { describe, it, expect } from 'vitest';
import { askDocumentAPI } from '../services/api';
import {
  BENCHMARK_DOC_A_EMPLOYMENT,
  BENCHMARK_DOC_B_NDA,
  BENCHMARK_DOC_C_SERVICE,
  BENCHMARK_DOC_D_LEASE,
  BENCHMARK_DOC_E_CROSS_REFERENCED,
  LEGAL_INTELLIGENCE_BENCHMARK,
  BenchmarkItem,
} from '../data/benchmarkContracts';
import { verifyCitationInSource } from '../utils/security';

const docMap = {
  A: { text: BENCHMARK_DOC_A_EMPLOYMENT, title: 'Executive Employment Agreement' },
  B: { text: BENCHMARK_DOC_B_NDA, title: 'Mutual Non-Disclosure Agreement' },
  C: { text: BENCHMARK_DOC_C_SERVICE, title: 'Master Professional Services Agreement' },
  D: { text: BENCHMARK_DOC_D_LEASE, title: 'Commercial Office Lease Agreement' },
  E: { text: BENCHMARK_DOC_E_CROSS_REFERENCED, title: 'Technology Licensing Agreement' },
};

describe('Legal Intelligence Benchmark (Docs A, B, C, D, E)', () => {
  it('evaluates all 13 deterministic benchmark questions and computes measured accuracy metrics', async () => {
    let correctAnswers = 0;
    let correctCitations = 0;
    let totalCitationsEvaluated = 0;
    let hallucinationCount = 0;
    let correctSections = 0;
    let totalSectionTests = 0;
    let correctNumerics = 0;
    let totalNumericTests = 0;
    let correctNegativeGuards = 0;
    let totalNegativeTests = 0;

    for (const item of LEGAL_INTELLIGENCE_BENCHMARK) {
      const doc = docMap[item.docKey];
      const answer = await askDocumentAPI(doc.text, item.question, doc.title, 'us');

      if (item.expectNotFound) {
        totalNegativeTests++;
        // Negative / Missing / Non-existent section queries MUST return isNotFoundInDoc: true and empty evidence
        expect(answer.isNotFoundInDoc).toBe(true);
        expect(answer.evidence).toHaveLength(0);
        correctNegativeGuards++;
        correctAnswers++;
      } else {
        // Direct / Numeric / Cross-reference queries MUST return grounded answers
        expect(answer.isNotFoundInDoc).toBe(false);
        expect(answer.evidence).toBeDefined();
        expect(answer.evidence!.length).toBeGreaterThan(0);

        // 1. Answer correctness (contains expected value/concept)
        if (item.expectedValueSubstr) {
          totalNumericTests++;
          const hasValue = Boolean(answer.content && answer.content.includes(item.expectedValueSubstr));
          expect(
            hasValue,
            `Item ${item.id} (${item.question}) failed to include expectedValueSubstr: "${item.expectedValueSubstr}" in answer.content: "${answer.content}"`
          ).toBe(true);
          if (hasValue) correctNumerics++;
        }

        // 2. Section retrieval accuracy
        if (item.expectedSection) {
          totalSectionTests++;
          const citedSection = answer.evidence![0]?.section || '';
          const hasSection = citedSection.toLowerCase().includes(item.expectedSection.toLowerCase());
          expect(
            hasSection,
            `Item ${item.id} (${item.question}) expectedSection: "${item.expectedSection}" not found in citedSection: "${citedSection}"`
          ).toBe(true);
          if (hasSection) correctSections++;
        }

        // 3. Citation accuracy & Hallucination check
        totalCitationsEvaluated++;
        const citedQuote = answer.evidence![0]?.text || '';
        const verify = verifyCitationInSource(citedQuote, doc.text);
        expect(verify.isGrounded).toBe(true);
        if (verify.isGrounded) {
          correctCitations++;
        } else {
          hallucinationCount++;
        }

        correctAnswers++;
      }
    }

    const totalQuestions = LEGAL_INTELLIGENCE_BENCHMARK.length;
    const answerAccuracy = (correctAnswers / totalQuestions) * 100;
    const citationAccuracy = (correctCitations / totalCitationsEvaluated) * 100;
    const hallucinationRate = (hallucinationCount / totalQuestions) * 100;
    const sectionAccuracy = (correctSections / totalSectionTests) * 100;
    const numericAccuracy = (correctNumerics / totalNumericTests) * 100;
    const negativeGuardAccuracy = (correctNegativeGuards / totalNegativeTests) * 100;

    // Verify all metrics meet strict 100/100 standards
    expect(answerAccuracy).toBe(100);
    expect(citationAccuracy).toBe(100);
    expect(hallucinationRate).toBe(0);
    expect(sectionAccuracy).toBe(100);
    expect(numericAccuracy).toBe(100);
    expect(negativeGuardAccuracy).toBe(100);
  });

  it('tests 2-hop cross-reference retrieval for Document E Section 7 -> Section 4.1 -> Section 2.1', async () => {
    const docE = docMap.E;
    const query = 'How is the licensor liability ceiling determined under Section 7 and its cross-references?';
    const answer = await askDocumentAPI(docE.text, query, docE.title, 'us');

    expect(answer.isNotFoundInDoc).toBe(false);
    expect(answer.evidence![0].section).toContain('SECTION 7');
    // Verifies that Section 7 quotes the Section 2.1 consideration limits
    expect(answer.content).toContain('Section 2.1 consideration limits');
  });
});
