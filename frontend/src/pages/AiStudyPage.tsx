import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  Calendar,
  Send,
  RotateCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { aiApi } from '../api';

export const AiStudyPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('Distributed Systems & Consensus');
  const [mode, setMode] = useState<'explain' | 'quiz' | 'flashcards' | 'study_plan'>('explain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Flashcards state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSelectedAnswers({});
    setShowQuizResults(false);
    setFlippedCards({});

    try {
      const res = await aiApi.askAssistant({
        query,
        topic,
        mode,
      });
      setResult(res);
    } catch (err: any) {
      alert(err.message || 'AI Assistant could not process request');
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelectAnswer = (qIdx: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini-Powered Neural Academic Engine</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Study Assistant</h1>
        <p className="text-sm text-slate-500 mt-1">
          Synthesize concepts, generate diagnostic quizzes, dynamic flashcards, and personalized study roadmaps
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Concept or Question
              </label>
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. How does Raft leader election handle network split-brain?"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. CS301 Distributed Systems"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2">
              {[
                { id: 'explain', label: 'Detailed Explanation', icon: BookOpen },
                { id: 'quiz', label: 'Diagnostic Quiz', icon: HelpCircle },
                { id: 'flashcards', label: 'Flashcards', icon: Layers },
                { id: 'study_plan', label: 'Study Roadmap', icon: Calendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as any)}
                    className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      mode === item.id
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <Button type="submit" isLoading={loading} size="md">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        </form>
      </Card>

      {/* Output Display */}
      {result && (
        <div className="space-y-6">
          {/* Explanation Mode */}
          {result.mode === 'explain' && (
            <Card title={`Concept Breakdown: ${result.topic}`}>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {result.response}
              </div>
            </Card>
          )}

          {/* Quiz Mode */}
          {result.mode === 'quiz' && result.quiz && (
            <Card
              title={`Diagnostic Quiz: ${result.topic}`}
              subtitle="Test your conceptual retention with immediate feedback"
              action={
                <Button size="sm" variant="outline" onClick={() => setShowQuizResults(true)}>
                  Grade My Quiz
                </Button>
              }
            >
              <div className="space-y-6">
                {result.quiz.map((q: any, idx: number) => {
                  const isSelected = selectedAnswers[idx];
                  const isCorrect = isSelected === q.answer;
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(idx, opt)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs border transition-colors flex items-center justify-between ${
                              selectedAnswers[idx] === opt
                                ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-medium'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{opt}</span>
                            {showQuizResults && opt === q.answer && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                      {showQuizResults && (
                        <div
                          className={`p-3 rounded-lg text-xs ${
                            isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          <p className="font-semibold">
                            {isCorrect ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${q.answer}`}
                          </p>
                          <p className="mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Flashcards Mode */}
          {result.mode === 'flashcards' && result.flashcards && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Interactive Study Flashcards</h2>
              <p className="text-xs text-slate-500">Click any card to flip between Question and Answer</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.flashcards.map((card: any, idx: number) => {
                  const isFlipped = flippedCards[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleFlip(idx)}
                      className={`cursor-pointer p-6 rounded-2xl border transition-all min-h-[160px] flex flex-col justify-between ${
                        isFlipped
                          ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                          : 'bg-white text-slate-900 border-slate-200 shadow-xs hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant={isFlipped ? 'blue' : 'gray'} size="sm">
                          {isFlipped ? 'ANSWER / SUMMARY' : 'FRONT / PROMPT'}
                        </Badge>
                        <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold my-4 leading-relaxed">
                        {isFlipped ? card.back : card.front}
                      </p>
                      <p className="text-[10px] text-slate-400">Card #{idx + 1} • Click to flip</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Study Plan Mode */}
          {result.mode === 'study_plan' && result.study_plan && (
            <Card title={`Milestone Roadmap: ${result.topic}`}>
              <div className="space-y-4">
                {result.study_plan.map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
