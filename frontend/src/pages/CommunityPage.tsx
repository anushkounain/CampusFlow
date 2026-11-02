import React, { useState, useEffect } from 'react';
import {
  Users,
  Bell,
  Calendar,
  MapPin,
  PlusCircle,
  ExternalLink,
  Tag,
  Send,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { communityApi } from '../api';
import { Announcement, CampusEvent } from '../types';
import { useAuth } from '../context/AuthContext';

export const CommunityPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New announcement modal/form
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');

  useEffect(() => {
    async function loadData() {
      try {
        const [aRes, eRes] = await Promise.all([
          communityApi.getAnnouncements(),
          communityApi.getEvents(),
        ]);
        setAnnouncements(aRes);
        setEvents(eRes);
      } catch (err) {
        console.error('Failed to load community data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await communityApi.createAnnouncement({
        title,
        content,
        category,
      });
      setAnnouncements((prev) => [created, ...prev]);
      setShowAddAnn(false);
      setTitle('');
      setContent('');
    } catch (err: any) {
      alert(err.message || 'Failed to post announcement');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Community</h1>
          <p className="text-sm text-slate-500 mt-1">
            University circulars, student clubs, hackathons, and cultural festivities
          </p>
        </div>
        {hasRole('admin', 'faculty', 'placement_coordinator') && (
          <Button size="sm" onClick={() => setShowAddAnn(!showAddAnn)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {showAddAnn ? 'Cancel' : 'Post Announcement'}
          </Button>
        )}
      </div>

      {showAddAnn && (
        <Card className="border-blue-200 bg-blue-50/20">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Broadcast Campus Notice</h3>
          <form onSubmit={handleCreateAnnouncement} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Notice Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-2 text-xs border rounded-lg bg-white"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              >
                <option value="Academic">Academic</option>
                <option value="Placement">Placement</option>
                <option value="Event">Event</option>
                <option value="Exam">Exam</option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Announcement Content..."
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                <Send className="w-3.5 h-3.5 mr-1.5" /> Publish Broadcast
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Main Grid: Announcements on Left, Events on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Bell className="w-4 h-4 mr-2 text-blue-600" />
            University Notices & Circulars
          </h2>
          <div className="space-y-4">
            {announcements.map((ann) => (
              <Card key={ann.id} className="hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      ann.category === 'Academic'
                        ? 'blue'
                        : ann.category === 'Placement'
                        ? 'amber'
                        : 'navy'
                    }
                    size="sm"
                  >
                    {ann.category}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2.5">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
            Upcoming Campus Events
          </h2>
          <div className="space-y-4">
            {events.map((ev) => (
              <Card key={ev.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="sm">{ev.organizer_club}</Badge>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{ev.description}</p>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>{ev.event_date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    <span>{ev.location}</span>
                  </div>
                </div>
                {ev.registration_link && (
                  <a
                    href={ev.registration_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 pt-1"
                  >
                    Register / RSVP <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
