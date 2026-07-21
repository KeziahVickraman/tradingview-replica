import React, { useState } from 'react';
import { X, Search, Star, ArrowUpRight, ArrowDownRight, Eye, ListFilter } from 'lucide-react';
import { Asset } from '../types';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  category: 'Stocks' | 'Crypto';
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: Asset) => void;
}

export default function ScreenerModal({
  isOpen,
  onClose,
  assets,
  category,
  watchlist,
  onToggleWatchlist,
  onSelectAsset
}: ScreenerModalProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'change' | 'price' | 'symbol'>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  if (!isOpen) return null;

  // Filter items matching search and category
  const filtered = assets
    .filter(a => a.category === category)
    .filter(a => 
      a.symbol.toLowerCase().includes(search.toLowerCase()) || 
      a.name.toLowerCase().includes(search.toLowerCase())
    );

  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    let multiplier = sortOrder === 'desc' ? -1 : 1;
    if (sortBy === 'change') {
      return (a.change - b.change) * multiplier;
    }
    if (sortBy === 'price') {
      return (a.price - b.price) * multiplier;
    }
    return a.symbol.localeCompare(b.symbol) * multiplier;
  });

  const toggleSort = (field: 'change' | 'price' | 'symbol') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl border border-border-subtle shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border-subtle bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <ListFilter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface font-headline-section">
                {category === 'Stocks' ? 'US Equities Screener' : 'Digital Assets Screener'}
              </h2>
              <p className="text-xs text-outline font-body-muted">
                Analyze and monitor {category === 'Stocks' ? 'top volume companies' : 'leading token contracts'} in real-time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${category}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-border-subtle rounded-full text-xs font-body-main outline-none focus:border-primary w-48 transition-all"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-outline hover:text-on-surface rounded-full hover:bg-surface-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dense Grid Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-surface-container-high border-b border-border-subtle sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted cursor-pointer hover:text-on-surface" onClick={() => toggleSort('symbol')}>
                  Symbol {sortBy === 'symbol' && (sortOrder === 'desc' ? '▼' : '▲')}
                </th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted">Company / Name</th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted text-right cursor-pointer hover:text-on-surface" onClick={() => toggleSort('price')}>
                  Price {sortBy === 'price' && (sortOrder === 'desc' ? '▼' : '▲')}
                </th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted text-right cursor-pointer hover:text-on-surface" onClick={() => toggleSort('change')}>
                  24h Change {sortBy === 'change' && (sortOrder === 'desc' ? '▼' : '▲')}
                </th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted text-right">Volume</th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted text-right">Market Cap</th>
                <th className="px-6 py-3 font-label-caps text-label-caps text-text-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface-container-lowest">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-outline text-body-muted">
                    No records matched your filters
                  </td>
                </tr>
              ) : (
                sorted.map((asset) => {
                  const isPositive = asset.change >= 0;
                  const isStarred = watchlist.includes(asset.symbol);

                  return (
                    <tr key={asset.symbol} className="hover:bg-surface-muted transition-colors group">
                      <td className="px-6 py-4.5 font-bold font-body-main text-on-surface">
                        {asset.symbol}
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="font-body-main text-on-surface text-sm truncate max-w-[180px]">{asset.name}</p>
                      </td>
                      <td className="px-6 py-4.5 text-right font-data-tabular text-sm">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4.5 text-right font-data-tabular text-sm ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                        {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4.5 text-right font-data-tabular text-sm text-on-surface-variant">
                        {asset.volume || 'N/A'}
                      </td>
                      <td className="px-6 py-4.5 text-right font-data-tabular text-sm text-on-surface-variant">
                        {asset.marketCap || 'N/A'}
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => {
                              onSelectAsset(asset);
                              onClose();
                            }}
                            className="p-1.5 text-outline hover:text-primary rounded-md hover:bg-surface-container transition-colors"
                            title="Set Focused Asset"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleWatchlist(asset.symbol)}
                            className={`p-1.5 rounded-md hover:bg-surface-container transition-colors ${
                              isStarred ? 'text-amber-500' : 'text-outline hover:text-on-surface'
                            }`}
                            title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
                          >
                            <Star className="w-4 h-4" fill={isStarred ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-surface-container-low px-6 py-3 border-t border-border-subtle flex justify-between items-center text-xs text-outline font-body-muted">
          <span>Showing {sorted.length} active securities</span>
          <span>Click eye icon to focus chart inside dashboard</span>
        </div>
      </div>
    </div>
  );
}
