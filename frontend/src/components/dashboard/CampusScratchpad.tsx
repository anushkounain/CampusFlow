import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Tag, Sparkles, Check, Pin } from 'lucide-react';
import { Card } from '../common/Card';

interface ScratchNote {
  id: string;
  text: string;
  tag: 'Study' | 'Exam' | 'Placement' | 'Personal';
  completed: boolean;
}

const DEFAULT_NOTES: ScratchNote[] = [
  { id: '1', text: 'Revise Dynamic Programming memoization proofs for CS301', tag: 'Study', completed: false },
  { id: '2', text: 'Submit GitHub repository link for Cloud Lab Exercise 4', tag: 'Exam', completed: true },
  { id: '3', text: 'Solve 5 LeetCode Tree/Graph problems for Google on-campus round', tag: 'Placement', completed: false },
];

export const CampusScratchpad: React.FC = () => {
  const [notes, setNotes] = useState<ScratchNote[]>(() => {
    try {
      const saved = localStorage.getItem('campusflow_scratchpad');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_NOTES;
  });

  const [newText, setNewText] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Study' | 'Exam' | 'Placement' | 'Personal'>('Study');

  useEffect(() => {
    try {
      localStorage.setItem('campusflow_scratchpad', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save scratchpad notes', e);
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newNote: ScratchNote = {
      id: Date.now().toString(),
      text: newText.trim(),
      tag: selectedTag,
      completed: false,
    };
    setNotes([newNote, ...notes]);
    setNewText('');
  };

  const handleToggle = (id: string) => {
    setNotes(
      notes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const getTagBadge = (tag: string) => {
    switch (tag) {
      case 'Exam':
        return 'bg-rose-500/10 text-rose-600 border-rose-200';
      case 'Placement':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'Personal':
        return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'Study':
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  return (
    <Card className="p-6 border-slate-200 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Pin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Academic Scratchpad & Checklist</h3>
            <p className="text-xs text-slate-500">Local persistent task manager</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {notes.filter((n) => !n.completed).length} pending
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddNote} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a rapid study reminder or prep task..."
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Tag Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium">Tag:</span>
          {(['Study', 'Exam', 'Placement', 'Personal'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTag(t)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                selectedTag === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No active notes. Add your first study task above!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                note.completed
                  ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                  : 'bg-white border-slate-200/80 text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
              }`}
            >
              <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggle(note.id)}
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    note.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {note.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="truncate">{note.text}</span>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getTagBadge(
                    note.tag
                  )}`}
                >
                  {note.tag}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(note.id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
