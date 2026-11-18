// Reads the PDFs/text files in knowledge/ once and saves their text to knowledge/knowledge-index.json, which the
// server loads at start-up instead of parsing the PDFs again (that took minutes and timed out requests on Vercel).
// Only new or changed files are parsed; run it after adding or replacing a file in knowledge/, then commit the index.
// OCR uses the saved results in knowledge/.ocr-cache only (no AI calls here); the local server fills any gaps when an AI key is set.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildKnowledgeIndex, KNOWLEDGE_INDEX } from './chat.js';

const knowledgeDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'knowledge');
const t = Date.now();
const ix = await buildKnowledgeIndex(knowledgeDir, () => null);
const ok = ix.files.filter((e) => e.rec.status === 'indexed' || e.rec.status === 'partial').length;
console.log(`Knowledge index: ${ok} documents in knowledge/${KNOWLEDGE_INDEX} (${((Date.now() - t) / 1000).toFixed(1)} s).`);
