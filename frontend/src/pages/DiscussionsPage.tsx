import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  PlusCircle,
  Eye,
  Users,
  Send,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { discussionsApi } from '../api';
import { DiscussionThread, StudyGroup } from '../types';

export const DiscussionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'threads' | 'study_groups'>('threads');
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [commentText, setCommentText] = useState('');

  // New Thread Form
  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('General');

  // New Study Group Form
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupSchedule, setGroupSchedule] = useState('Thursdays 6:00 PM');
  const [groupLink, setGroupLink] = useState('https://meet.campusflow.edu');

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, sgRes] = await Promise.all([
          discussionsApi.getThreads(),
          discussionsApi.getStudyGroups(),
        ]);
        setThreads(tRes);
        setStudyGroups(sgRes);
      } catch (err) {
        console.error('Failed to load discussions', err);
      }
    }
    loadData();
  }, []);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await discussionsApi.createThread({
        title: newTitle,
        content: newContent,
        tags: newTags,
      });
      setThreads((prev) => [created, ...prev]);
      setShowNewThread(false);
      setNewTitle('');
      setNewContent('');
    } catch (err: any) {
      alert(err.message || 'Failed to create thread');
    }
  };

  const handleUpvote = async (threadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await discussionsApi.upvoteThread(threadId);
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, upvotes: res.upvotes } : t))
      );
      if (selectedThread && selectedThread.id === threadId) {
        setSelectedThread((prev) => (prev ? { ...prev, upvotes: res.upvotes } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Upvote failed');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !commentText.trim()) return;
    try {
      const comment = await discussionsApi.addComment(selectedThread.id, commentText);
      const updatedThread = {
        ...selectedThread,
        comments: [...selectedThread.comments, comment],
      };
      setSelectedThread(updatedThread);
      setThreads((prev) =>
        prev.map((t) => (t.id === selectedThread.id ? updatedThread : t))
      );
      setCommentText('');
    } catch (err: any) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleCreateStudyGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const group = await discussionsApi.createStudyGroup({
        name: groupName,
        description: groupDesc,
        meeting_schedule: groupSchedule,
        meeting_link: groupLink,
      });
      setStudyGroups((prev) => [group, ...prev]);
      setShowNewGroup(false);
      setGroupName('');
      setGroupDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create study group');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Discussions & Peer Learning
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Exchange solutions, collaborate on academic assignments, and organize study circles
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('threads')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'threads'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Discussions ({threads.length})
          </button>
          <button
            onClick={() => setActiveTab('study_groups')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'study_groups'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Study Groups ({studyGroups.length})
          </button>
        </div>
      </div>

      {activeTab === 'threads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Academic Forum Threads</h2>
            <Button size="sm" onClick={() => setShowNewThread(!showNewThread)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {showNewThread ? 'Cancel' : 'Start New Discussion'}
            </Button>
          </div>

          {showNewThread && (
            <Card className="border-blue-200 bg-blue-50/20">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Post a Question or Insight</h3>
              <form onSubmit={handleCreateThread} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Discussion Title"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-xs border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Tags (e.g. Distributed, Exams)"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="px-3 py-2 text-xs border rounded-lg bg-white"
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Elaborate your question, code snippet, or theoretical invariant..."
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm">Publish Discussion</Button>
                </div>
              </form>
            </Card>
          )}

          {/* Thread List & Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedThread(t)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    selectedThread?.id === t.id
                      ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="blue" size="sm">{t.tags}</Badge>
                      {t.is_resolved && (
                        <Badge variant="green" size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{t.content}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => handleUpvote(t.id, e)}
                        className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 font-semibold"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{t.upvotes}</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t.comments?.length || 0} replies</span>
                      </span>
                    </div>
                    <span className="text-blue-600 font-semibold">View Thread →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Thread Comments Sidebar */}
            <div>
              {selectedThread ? (
                <Card title={selectedThread.title} subtitle={`Tags: ${selectedThread.tags}`}>
                  <div className="space-y-4">
                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed whitespace-pre-line">
                      {selectedThread.content}
                    </p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2 border-t">
                      Community Answers ({selectedThread.comments?.length || 0})
                    </h4>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {selectedThread.comments?.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No answers posted yet. Be the first!</p>
                      ) : (
                        selectedThread.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`p-3 rounded-lg text-xs leading-relaxed ${
                              cmt.is_solution
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {cmt.is_solution && (
                              <p className="font-bold text-[10px] text-emerald-700 mb-1 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" /> Faculty / Solution Verified
                              </p>
                            )}
                            <p>{cmt.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Reply Input */}
                    <form onSubmit={handleAddComment} className="pt-3 border-t space-y-2">
                      <textarea
                        rows={2}
                        required
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your explanation or solution..."
                        className="w-full text-xs p-2.5 border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <Button type="submit" size="sm" className="w-full">
                        <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Reply
                      </Button>
                    </form>
                  </div>
                </Card>
              ) : (
                <Card>
                  <p className="text-xs text-slate-400 text-center py-12">
                    Click any discussion thread to review replies or post your solution.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'study_groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Collaborative Study Circles</h2>
            <Button size="sm" onClick={() => setShowNewGroup(!showNewGroup)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {showNewGroup ? 'Cancel' : 'Create Study Group'}
            </Button>
          </div>

          {showNewGroup && (
            <Card className="border-blue-200 bg-blue-50/20">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Create Peer Study Circle</h3>
              <form onSubmit={handleCreateStudyGroup} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Group Name (e.g. Distributed Consensus Lab Circle)"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Schedule (e.g. Thursdays 6:00 PM)"
                  value={groupSchedule}
                  onChange={(e) => setGroupSchedule(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Meeting Link"
                  value={groupLink}
                  onChange={(e) => setGroupLink(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  className="px-3 py-2 text-xs border rounded-lg bg-white"
                />
                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" size="sm">Create Group</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {studyGroups.map((g) => (
              <Card key={g.id} className="hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="md">Study Circle</Badge>
                  <span className="text-xs font-semibold text-slate-500">Max {g.max_members} Members</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2.5">{g.name}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{g.description}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {g.meeting_schedule}
                  </span>
                  {g.meeting_link && (
                    <a
                      href={g.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold flex items-center hover:underline"
                    >
                      Join Room <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
