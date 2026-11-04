import math
import re
from typing import List, Dict, Any, Tuple


class RAGProcessor:
    """Document chunking and semantic search retrieval engine."""

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 80) -> List[Dict[str, Any]]:
        """Split document text into overlapping semantic passages."""
        # Clean text
        text = re.sub(r'\s+', ' ', text).strip()
        words = text.split(' ')

        chunks = []
        start = 0
        chunk_idx = 0

        while start < len(words):
            end = min(start + chunk_size, len(words))
            chunk_words = words[start:end]
            chunk_content = " ".join(chunk_words)

            # Extract basic keywords for indexing
            tokens = [w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', chunk_content)]
            freqs: Dict[str, int] = {}
            for t in tokens:
                freqs[t] = freqs.get(t, 0) + 1
            top_keywords = sorted(freqs.items(), key=lambda x: x[1], reverse=True)[:8]
            keywords_str = ", ".join([k for k, _ in top_keywords])

            chunks.append({
                "chunk_index": chunk_idx,
                "content": chunk_content,
                "token_count": len(chunk_words),
                "keywords": keywords_str,
            })

            chunk_idx += 1
            if end == len(words):
                break
            start += chunk_size - chunk_overlap

        return chunks

    @staticmethod
    def _compute_tf(text: str) -> Dict[str, float]:
        """Compute term frequency normalized dictionary."""
        words = [w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', text)]
        if not words:
            return {}
        counts: Dict[str, int] = {}
        for w in words:
            counts[w] = counts.get(w, 0) + 1
        total = len(words)
        return {w: count / total for w, count in counts.items()}

    @classmethod
    def semantic_similarity(cls, query: str, document_text: str) -> float:
        """Calculate cosine similarity between query and document vectors."""
        tf_q = cls._compute_tf(query)
        tf_d = cls._compute_tf(document_text)

        if not tf_q or not tf_d:
            return 0.0

        all_terms = set(tf_q.keys()).union(set(tf_d.keys()))
        dot_product = sum(tf_q.get(term, 0.0) * tf_d.get(term, 0.0) for term in all_terms)

        norm_q = math.sqrt(sum(val ** 2 for val in tf_q.values()))
        norm_d = math.sqrt(sum(val ** 2 for val in tf_d.values()))

        if norm_q == 0.0 or norm_d == 0.0:
            return 0.0

        return dot_product / (norm_q * norm_d)

    @classmethod
    def retrieve_top_chunks(
        cls,
        query: str,
        chunks: List[Dict[str, Any]],
        top_k: int = 3,
        threshold: float = 0.02
    ) -> List[Tuple[Dict[str, Any], float]]:
        """Retrieve the top-k most relevant text passages for a given query."""
        scored_chunks = []
        for ch in chunks:
            sim = cls.semantic_similarity(query, ch["content"])
            # Boost score if keywords overlap
            kw = ch.get("keywords", "").lower()
            query_tokens = query.lower().split()
            overlap = sum(1 for qt in query_tokens if qt in kw)
            final_score = sim + (0.05 * overlap)

            if final_score >= threshold:
                scored_chunks.append((ch, final_score))

        scored_chunks.sort(key=lambda x: x[1], reverse=True)
        return scored_chunks[:top_k]

    @classmethod
    def build_rag_prompt(cls, query: str, retrieved_chunks: List[Tuple[Dict[str, Any], float]]) -> str:
        """Assemble retrieved context chunks into an authoritative educational prompt."""
        context_blocks = []
        for i, (chunk, score) in enumerate(retrieved_chunks):
            doc_title = chunk.get("doc_title", "Course Material")
            page_num = chunk.get("page_number", 1)
            context_blocks.append(
                f"[Source {i+1}: {doc_title} (Page {page_num}, Relevance {score:.2f})]\n{chunk['content']}"
            )

        context_str = "\n\n".join(context_blocks)
        prompt = (
            f"You are the CampusFlow AI Academic Tutor. Answer the user's question using ONLY the retrieved "
            f"course document context below. Cite the sources explicitly.\n\n"
            f"RETRIEVED CONTEXT:\n{context_str}\n\n"
            f"QUESTION: {query}\n\n"
            f"ANSWER:"
        )
        return prompt
