import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  BookOpen,
  PlusCircle,
  FileCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { documentsApi } from '../api';
import { DocumentItem, RAGQueryResult } from '../types';

export const DocumentsRagPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [query, setQuery] = useState('');
  const [ragResult, setRagResult] = useState<RAGQueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [showIndexModal, setShowIndexModal] = useState(false);

  // Index new document form state
  const [newTitle, setNewTitle] = useState('');
  const [newFilename, setNewFilename] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await documentsApi.getDocuments();
        setDocuments(res);
      } catch (err) {
        console.error('Failed to load documents', err);
      }
    }
    loadDocs();
  }, []);

  const handleRagSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await documentsApi.ragQuery({ query, top_k: 3 });
      setRagResult(res);
    } catch (err: any) {
      alert(err.message || 'Semantic query failed');
    } finally {
      setLoading(false);
    }
  };

  const handleIndexDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIndexing(true);
    try {
      const created = await documentsApi.indexDocument({
        title: newTitle,
        filename: newFilename || `${newTitle.replace(/\s+/g, '_')}.pdf`,
        content_text: newContent,
      });
      setDocuments((prev) => [created, ...prev]);
      setShowIndexModal(false);
      setNewTitle('');
      setNewFilename('');
      setNewContent('');
      alert('Document successfully chunked and indexed into the RAG vector store!');
    } catch (err: any) {
      alert(err.message || 'Indexing failed');
    } finally {
      setIndexing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retrieval-Augmented Generation (RAG) Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Course Documents & RAG Assistant
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Query across course syllabi, lecture slides, and research notes with grounded citation sources
          </p>
        </div>
        <Button size="sm" onClick={() => setShowIndexModal(!showIndexModal)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {showIndexModal ? 'Cancel' : 'Index New Document'}
        </Button>
      </div>

      {/* Indexing Form */}
      {showIndexModal && (
        <Card className="border-blue-200 bg-blue-50/20">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Index Academic Material</h3>
          <p className="text-xs text-slate-500 mb-4">
            Upload text from a textbook chapter, research paper, or lecture notes. The system will slice it into overlapping semantic chunks for retrieval.
          </p>
          <form onSubmit={handleIndexDocument} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Document Title (e.g. Distributed Consensus Systems)"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Filename (e.g. lecture_04_consensus.pdf)"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Paste raw text or notes content here to be indexed..."
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" isLoading={indexing}>
                Chunk & Index into RAG Store
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* RAG Query Input */}
      <Card>
        <form onSubmit={handleRagSearch} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Ask a Question across Indexed Course Materials:
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. How does Raft handle split votes during leader election?"
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <Button type="submit" isLoading={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              RAG Search
            </Button>
          </div>
        </form>
      </Card>

      {/* RAG Answer with Citations */}
      {ragResult && (
        <Card title="AI Grounded Response" subtitle="Generated using verified course text chunks">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {ragResult.answer}
            </div>

            {ragResult.sources.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Retrieved Grounding Sources:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ragResult.sources.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{s.title}</span>
                        <Badge variant="blue" size="sm">Score: {s.relevance_score}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-400">Page {s.page}</p>
                      <p className="text-xs text-slate-600 line-clamp-3 italic">"{s.excerpt}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Repository of Indexed Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-blue-600" />
          Indexed Course Repository ({documents.length} Materials)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{doc.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.filename} • {doc.page_count} pages</p>
                  </div>
                </div>
                <Badge variant="green" size="sm">Indexed</Badge>
              </div>
              {doc.summary && (
                <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {doc.summary}
                </p>
              )}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Indexed on: {new Date(doc.created_at).toLocaleDateString()}</span>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Query with RAG →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
