import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, MessageCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { marketplaceApi } from '../api';
import { MarketplaceListing } from '../types';

export const MarketplacePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);

  // New Listing Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Textbook');
  const [newPrice, setNewPrice] = useState('₹500');
  const [newCondition, setNewCondition] = useState('Good');

  // Contact Modal
  const [contactItem, setContactItem] = useState<MarketplaceListing | null>(null);
  const [inquiryText, setInquiryText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const categories = ['All', 'Textbook', 'Electronics', 'Bicycle', 'Dorm', 'Lost & Found'];

  const loadListings = async () => {
    try {
      const data = await marketplaceApi.getListings(activeCategory);
      setItems(data);
    } catch (err) {
      console.error('Failed to load marketplace listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [activeCategory]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await marketplaceApi.createListing({
        title: newTitle,
        description: newDesc,
        category: newCat,
        price: newPrice,
        condition: newCondition,
      });
      setItems((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewDesc('');
      setSuccessMsg('Your listing was published successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create listing');
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactItem || !inquiryText.trim()) return;
    try {
      await marketplaceApi.sendInquiry(contactItem.id, inquiryText);
      setSuccessMsg(`Inquiry sent to seller for "${contactItem.title}"!`);
      setContactItem(null);
      setInquiryText('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to send inquiry');
    }
  };

  const filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Marketplace & Student Exchange
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Student peer-to-peer textbook trades, dorm equipment, bicycles, and verified lost & found registry
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(!showAddModal)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {showAddModal ? 'Cancel' : 'Create New Listing'}
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center">
          <CheckCircle className="w-5 h-5 mr-3 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* New Listing Modal */}
      {showAddModal && (
        <Card className="border-blue-200 bg-blue-50/20">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Publish Item Listing</h3>
          <form onSubmit={handleCreateListing} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Item Title (e.g. Operating Systems Textbook)"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="sm:col-span-2 px-3 py-2 text-xs border rounded-lg bg-white"
              />
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              >
                <option value="Textbook">Textbook</option>
                <option value="Electronics">Electronics</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Dorm">Dorm</option>
                <option value="Lost & Found">Lost & Found</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Price (e.g. ₹600 or Free)"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Condition (e.g. Like New / Good / Mint)"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                className="px-3 py-2 text-xs border rounded-lg bg-white"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Detailed description, pickup block or verification instructions..."
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm">Publish to Marketplace</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      {contactItem && (
        <Card className="border-emerald-200 bg-emerald-50/20">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Contact Seller for: {contactItem.title}
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Send an instant inquiry or meeting request for item pickup.
          </p>
          <form onSubmit={handleSendInquiry} className="space-y-3">
            <textarea
              rows={2}
              required
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              placeholder="Hi, is this still available? I can meet at Academic Block A..."
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white"
            />
            <div className="flex items-center space-x-2 justify-end">
              <Button type="button" size="sm" variant="ghost" onClick={() => setContactItem(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Send Inquiry
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    item.category === 'Lost & Found'
                      ? 'red'
                      : item.category === 'Textbook'
                      ? 'blue'
                      : 'navy'
                  }
                  size="sm"
                >
                  {item.category}
                </Badge>
                <span className="text-[11px] font-semibold text-slate-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.condition}</p>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {item.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Price / Claim</p>
                <p className="text-base font-extrabold text-slate-900">{item.price}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setContactItem(item)}>
                <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
