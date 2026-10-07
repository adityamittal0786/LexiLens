/**
 * Document Comparison Logic for LexiLens
 * Analyzes differences between two contract versions without hallucinations.
 */

import { ComparisonDiff, ComparisonResult } from '../types';

export interface ContractSection {
  title: string;
  category: string;
  content: string;
  lineNumber: number;
}

/**
 * Extracts sections from legal text by searching for section patterns.
 */
export function extractSections(text: string): ContractSection[] {
  const lines = text.split('\n');
  const sections: ContractSection[] = [];
  let currentTitle = 'Preamble / Introduction';
  let currentCategory = 'General';
  let currentContent: string[] = [];
  let startLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isHeader =
      /^(SECTION\s+\d+|ARTICLE\s+\d+|\d+\.\s+|[A-Z\s]{4,}:)/i.test(line) &&
      line.length < 80;

    if (isHeader) {
      if (currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          category: categorizeSectionTitle(currentTitle),
          content: currentContent.join('\n').trim(),
          lineNumber: startLine,
        });
        currentContent = [];
      }
      currentTitle = line;
      startLine = i + 1;
    } else if (line) {
      currentContent.push(line);
    }
  }

  if (currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      category: categorizeSectionTitle(currentTitle),
      content: currentContent.join('\n').trim(),
      lineNumber: startLine,
    });
  }

  return sections;
}

function categorizeSectionTitle(title: string): string {
  const t = title.toLowerCase();
  if (/terminat|cancel|exit/i.test(t)) return 'Termination';
  if (/pay|fee|compensation|price|invoice|cost/i.test(t)) return 'Payment';
  if (/term|duration|period/i.test(t)) return 'Term';
  if (/confidential|secret|nda|proprietary/i.test(t)) return 'Confidentiality';
  if (/intellectual|ip|copyright|patent|ownership|work.*hire/i.test(t)) return 'Intellectual Property';
  if (/liab|indemn|damage|warranty/i.test(t)) return 'Liability';
  if (/dispute|arbitrat|jurisdiction|court|governing/i.test(t)) return 'Dispute Resolution';
  if (/non-compete|solicit|restrict/i.test(t)) return 'Restrictive Covenants';
  return 'General';
}

/**
 * Compares two documents section-by-section and classifies differences.
 */
function normalizeForFormattingComparison(text: string): string {
  const numberWords: Record<string, string> = {
    one: '1', two: '2', three: '3', four: '4', five: '5',
    six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
    eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
    twenty: '20', 'twenty-one': '21', 'twenty-four': '24', thirty: '30',
    'forty-five': '45', sixty: '60', ninety: '90', hundred: '100',
  };
  let norm = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  for (const [word, num] of Object.entries(numberWords)) {
    norm = norm.replace(new RegExp(`\\b${word}\\b`, 'g'), num);
  }
  return norm.replace(/\s+/g, ' ').trim();
}

export function compareDocumentTexts(
  docATitle: string,
  docBTitle: string,
  docAText: string,
  docBText: string
): ComparisonResult {
  const sectionsA = extractSections(docAText);
  const sectionsB = extractSections(docBText);

  const differences: ComparisonDiff[] = [];
  let added = 0;
  let removed = 0;
  let modified = 0;
  let unchanged = 0;

  const matchedB = new Set<number>();

  sectionsA.forEach((secA, idxA) => {
    // Look for matching section in B by title or category
    const matchIdxB = sectionsB.findIndex(
      (secB, idxB) =>
        !matchedB.has(idxB) &&
        (secA.title.toLowerCase() === secB.title.toLowerCase() ||
          (secA.category !== 'General' && secA.category === secB.category))
    );

    if (matchIdxB >= 0) {
      matchedB.add(matchIdxB);
      const secB = sectionsB[matchIdxB];

      // Compare content similarity
      const contentA = secA.content.replace(/\s+/g, ' ').trim();
      const contentB = secB.content.replace(/\s+/g, ' ').trim();

      if (contentA === contentB) {
        unchanged++;
      } else {
        modified++;

        const isFormattingOnly =
          normalizeForFormattingComparison(contentA) ===
          normalizeForFormattingComparison(contentB);

        // Extract key numerical, financial, and timeline figures for semantic change detection
        const numPattern = /(?:₹|\$|€|£)?\s?\d+(?:,\d+)*(?:\.\d+)?\s*(?:days?|months?|weeks?|years?|%|percent)?/gi;
        const numsA = secA.content.match(numPattern) || [];
        const numsB = secB.content.match(numPattern) || [];

        let semanticNote = `Terms in "${secA.title}" were amended between versions.`;
        if (isFormattingOnly) {
          semanticNote = `Formatting change: Numerical or stylistic wording variation (e.g. "30 days" vs "thirty days") without alteration to legal rights.`;
        } else if (numsA.length > 0 && numsB.length > 0 && numsA.join(' ') !== numsB.join(' ')) {
          semanticNote = `Key figures or timeline values changed: [${numsA.slice(0, 3).join(', ')}] in ${docATitle} vs [${numsB.slice(0, 3).join(', ')}] in ${docBTitle}.`;
        }

        differences.push({
          id: `diff-${differences.length + 1}`,
          category: secA.category,
          clauseTitle: secB.title || secA.title,
          changeType: 'modified',
          isFormattingOnly,
          docAQuote: secA.content.substring(0, 180),
          docBQuote: secB.content.substring(0, 180),
          whatChanged: semanticNote,
          plainMeaning: isFormattingOnly
            ? `The core legal commitments remain identical; only formatting or drafting phrasing was modified.`
            : `The wording in this clause was updated. Review the specific commitments and rights allocated.`,
          potentialSignificance: isFormattingOnly
            ? `This appears to be primarily a drafting style or formatting change rather than a substantive alteration of legal commitments.`
            : `Wording changes directly alter rights, notice requirements, or operational obligations.`,
          questionsToConsider: isFormattingOnly
            ? `Confirm that this stylistic phrasing aligns with organizational document standards.`
            : `Does this revised phrasing reflect the terms agreed upon during commercial negotiations?`,
        });
      }
    } else {
      // Clause was in A, but not found in B -> Removed
      removed++;
      differences.push({
        id: `diff-${differences.length + 1}`,
        category: secA.category,
        clauseTitle: secA.title,
        changeType: 'removed',
        docAQuote: secA.content.substring(0, 180),
        whatChanged: `Section present in ${docATitle} is absent in ${docBTitle}.`,
        plainMeaning: `This clause has been deleted entirely from the revised agreement.`,
        potentialSignificance: `Removing this provision eliminates the obligation or protection it previously established.`,
        questionsToConsider: `Was the removal of this clause intentional and mutually acknowledged?`,
      });
    }
  });

  // Any unmatched sections in B are Added
  sectionsB.forEach((secB, idxB) => {
    if (!matchedB.has(idxB)) {
      added++;
      differences.push({
        id: `diff-${differences.length + 1}`,
        category: secB.category,
        clauseTitle: secB.title,
        changeType: 'added',
        docBQuote: secB.content.substring(0, 180),
        whatChanged: `New clause introduced in ${docBTitle} that was not present in ${docATitle}.`,
        plainMeaning: `This is an entirely new section added to the revised contract.`,
        potentialSignificance: `Adds new legal duties, restrictions, or operational requirements not previously agreed to.`,
        questionsToConsider: `Are the new obligations in this added clause acceptable under your project scope?`,
      });
    }
  });

  return {
    docAId: 'doc-a',
    docBId: 'doc-b',
    docATitle,
    docBTitle,
    executiveComparison: `Comparative analysis of "${docATitle}" vs "${docBTitle}" identified ${differences.length} substantive change(s) (${modified} modified, ${added} added, ${removed} removed).`,
    stats: {
      added,
      removed,
      modified,
      unchanged,
    },
    differences,
    comparedAt: new Date().toISOString(),
  };
}
