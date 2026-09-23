/**
 * Document Chunking & Grounded RAG Context Retrieval for LexiLens
 * Ensures answers are grounded strictly in retrieved sections without repeated huge token payloads.
 */

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  sectionHeader: string;
  text: string;
  startCharIndex: number;
  endCharIndex: number;
  wordCount: number;
}

/**
 * Splits legal document into coherent, overlapping chunks while detecting
 * section and article headings (e.g. "SECTION 1", "3. Term and Termination").
 */
export function chunkDocument(
  rawText: string,
  targetChunkWords = 250,
  overlapWords = 40
): DocumentChunk[] {
  if (!rawText || rawText.trim().length === 0) {
    return [];
  }

  const lines = rawText.split('\n');
  const chunks: DocumentChunk[] = [];
  let currentWords: string[] = [];
  let currentStartChar = 0;
  let charCounter = 0;
  let currentSection = 'General / Preamble';
  let chunkIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if line represents a legal section header
    const headerMatch =
      /^(SECTION\s+\d+|ARTICLE\s+\d+|\d+\.\s+|[A-Z\s]{4,}:)/i.test(trimmedLine) &&
      trimmedLine.length < 80;

    if (headerMatch) {
      // If we accumulated words from the prior section, emit the chunk
      if (currentWords.length > 0) {
        const chunkText = currentWords.join(' ');
        chunks.push({
          id: `chk-${chunkIndex++}`,
          chunkIndex: chunks.length,
          sectionHeader: currentSection,
          text: chunkText,
          startCharIndex: currentStartChar,
          endCharIndex: charCounter,
          wordCount: currentWords.length,
        });

        // Clear or retain overlap if chunk was large
        currentWords = currentWords.length > overlapWords ? currentWords.slice(-overlapWords) : [];
        currentStartChar = Math.max(0, charCounter - currentWords.join(' ').length);
      }
      currentSection = trimmedLine;
    }

    const lineWords = trimmedLine ? trimmedLine.split(/\s+/) : [];
    currentWords.push(...lineWords);
    charCounter += line.length + 1; // +1 for newline

    if (currentWords.length >= targetChunkWords) {
      const chunkText = currentWords.join(' ');
      chunks.push({
        id: `chk-${chunkIndex++}`,
        chunkIndex: chunks.length,
        sectionHeader: currentSection,
        text: chunkText,
        startCharIndex: currentStartChar,
        endCharIndex: charCounter,
        wordCount: currentWords.length,
      });

      // Retain overlap
      currentWords = currentWords.slice(-overlapWords);
      currentStartChar = Math.max(0, charCounter - currentWords.join(' ').length);
    }
  }

  // Push remaining words
  if (currentWords.length > 0) {
    chunks.push({
      id: `chk-${chunkIndex++}`,
      chunkIndex: chunks.length,
      sectionHeader: currentSection,
      text: currentWords.join(' '),
      startCharIndex: currentStartChar,
      endCharIndex: charCounter,
      wordCount: currentWords.length,
    });
  }

  return chunks;
}

/**
 * Stopwords to filter out of search queries
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'what', 'when', 'where', 'which', 'who', 'how', 'does', 'can', 'should',
  'about', 'there', 'this', 'have', 'been',
]);

/**
 * Retrieves the top-K most relevant chunks using BM25-style term frequency scoring.
 */
export function retrieveRelevantChunks(
  question: string,
  chunks: DocumentChunk[],
  topK = 3
): { chunk: DocumentChunk; score: number }[] {
  if (!question || chunks.length === 0) {
    return [];
  }

  const queryTerms = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  if (queryTerms.length === 0) {
    // If only stopwords were provided, return the first few chunks
    return chunks.slice(0, topK).map((c) => ({ chunk: c, score: 0.1 }));
  }

  const scored: { chunk: DocumentChunk; score: number }[] = [];

  for (const chunk of chunks) {
    const textLower = chunk.text.toLowerCase();
    const headerLower = chunk.sectionHeader.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      // Header match has high weight
      if (headerLower.includes(term)) {
        score += 3.0;
      }

      // Exact phrase match in body
      if (textLower.includes(term)) {
        const occurrences = (textLower.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length;
        score += Math.min(occurrences, 4) * 1.0;
      }
    }

    if (score > 0) {
      scored.push({ chunk, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
