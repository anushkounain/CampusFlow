import React, { useState } from 'react';
import { ShoppingBag, Search, PlusCircle, Tag, DollarSign, MessageCircle, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

interface MarketItem {
  id: number;
  title: string;
  category: 'Textbook' | 'Electronics' | 'Bicycle' | 'Dorm' | 'Lost & Found';
  price: string;
  seller: string;
  condition: string;
  postedDate: string;
}

export const MarketplacePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [items, setItems] = useState<MarketItem[]>([
    {
      id: 1,
      title: 'Operating System Concepts (Silberschatz - 10th Ed)',
      category: 'Textbook',
      price: '₹650',
      seller: 'Rahul Verma (CS 4th Sem)',
      condition: 'Like New (Minimal highlighting)',
      postedDate: 'Yesterday',
    },
    {
      id: 2,
      title: 'Hero Sprint Pro 21-Speed Geared Mountain Bicycle',
      category: 'Bicycle',
      price: '₹3,200',
      seller: 'Aditya Rao (ECE 6th Sem)',
      condition: 'Good condition, serviced last month',
      postedDate: '2 days ago',
    },
    {
      id: 3,
      title: 'Raspberry Pi 4 Model B (4GB RAM) with Starter Kit',
      category: 'Electronics',
      price: '₹4,500',
      seller: 'Sneha Patel (CS 8th Sem)',
      condition: 'Tested & Verified, original casing included',
      postedDate: '3 days ago',
    },
    {
      id: 4,
      title: 'FOUND: Silver Casio Scientific Calculator (FX-991EX)',
      category: 'Lost & Found',
      price: 'Free / Claim',
      seller: 'Security Desk (Library Block 2)',
      condition: 'Found at 2nd Floor Reading Room',
      postedDate: 'Today',
    },
    {
      id: 5,
      title: 'Ergonomic Desk Study Lamp with Dual USB Ports',
      category: 'Dorm',
      price: '₹400',
      seller: 'Priya Sharma (Mech 6th Sem)',
      condition: 'Excellent working order',
      postedDate: '4 days ago',
    },
  ]);

  const categories = ['All', 'Textbook', 'Electronics', 'Bicycle', 'Dorm', 'Lost & Found'];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Marketplace & Exchange</h1>
          <p className="text-sm text-slate-500 mt-1">
            Student peer-to-peer textbook trades, dorm essentials, and verified lost & found
          </p>
        </div>
        <Button size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Listing
        </Button>
      </div>

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
                <span className="text-[11px] font-semibold text-slate-400">{item.postedDate}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.condition}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Price / Claim</p>
                <p className="text-base font-extrabold text-slate-900">{item.price}</p>
              </div>
              <Button size="sm" variant="outline">
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
