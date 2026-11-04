import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, Search, Terminal } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { auditApi } from '../api';
import { AuditLogEntry } from '../types';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await auditApi.getLogs(actionFilter || undefined);
        setLogs(res);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Immutable Audit Ledger</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Security & Audit Trails
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-evident logs tracking authentication, permission enforcement, course modifications, and document indexing
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
          >
            <option value="">All Actions</option>
            <option value="SYSTEM_INIT">SYSTEM_INIT</option>
            <option value="DOCUMENT_INDEX">DOCUMENT_INDEX</option>
            <option value="THREAD_CREATE">THREAD_CREATE</option>
            <option value="MARKETPLACE_LISTING_CREATE">MARKETPLACE_LISTING_CREATE</option>
          </select>
        </div>
      </div>

      <Card title="Security Event Ledger" subtitle="Real-time chronological events from the backend">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Client IP</th>
                <th className="px-4 py-3">Metadata / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <Badge variant="blue" size="sm">{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">
                    {log.user_id ? `User #${log.user_id}` : 'System'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{log.ip_address || '127.0.0.1'}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
