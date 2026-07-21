import React, { useState, useEffect } from 'react';
import { Search, X, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Asset } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
  watchlist,
  onToggleWatchlist
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Asset[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      // Suggest trending/high volume assets initially
      setFiltered(assets.filter(a => a.trendingRank === 1 || ['AAPL', 'BTC', 'S&P 500', 'USA 10Y'].includes(a.symbol)));
    } else {
      const q = query.toLowerCase();
      const results = assets.filter(
        a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      );
      setFiltered(results);
    }
  }, [query, assets]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl border border-border-subtle shadow-2xl overflow-hidden animate-slide-up mx-4">
        {/* Input area */}
        <div className="flex items-center px-4 py-3.5 border-b border-border-subtle">
          <Search className="text-outline mr-3 w-5 h-5" />
          <input
            autoFocus
            type="text"
            placeholder="Search by symbol, name, or category (e.g., AAPL, Bitcoin, Bonds)..."
            className="flex-1 bg-transparent border-none outline-none text-on-surface font-body-main text-sm placeholder-outline"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose} 
            className="p-1 text-outline hover:text-on-surface rounded-full hover:bg-surface-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-2">
          <p className="px-3 py-1.5 font-label-caps text-[10px] text-text-muted uppercase tracking-widest">
            {query.trim() ? 'Search Results' : 'Suggested & Trending Assets'}
          </p>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-outline text-body-muted">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((asset) => {
                const isPositive = asset.change >= 0;
                const isStarred = watchlist.includes(asset.symbol);

                return (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-muted transition-colors cursor-pointer group"
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded bg-surface-container flex items-center justify-center font-bold text-xs text-on-surface flex-shrink-0">
                        {asset.symbol.substring(0, 4)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-on-surface text-sm truncate">{asset.symbol}</span>
                          <span className="px-1.5 py-0.5 bg-surface-container text-[10px] text-outline rounded font-medium capitalize">
                            {asset.category}
                          </span>
                        </div>
                        <p className="text-body-muted text-outline truncate">{asset.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="text-right">
                        <p className="font-data-tabular text-sm text-on-surface">
                          {asset.category === 'Bonds' ? `${asset.price.toFixed(3)}%` : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`font-data-tabular text-xs flex items-center justify-end ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                          {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
                        </p>
                      </div>

                      <button
                        onClick={() => onToggleWatchlist(asset.symbol)}
                        className={`p-1.5 rounded-full hover:bg-surface-container transition-colors ${
                          isStarred ? 'text-amber-500' : 'text-outline hover:text-on-surface'
                        }`}
                        title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className="w-4 h-4" fill={isStarred ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-surface-container-low px-4 py-2 border-t border-border-subtle flex justify-between items-center text-[11px] text-outline font-body-muted">
          <span>Tip: Press <kbd className="bg-surface-container px-1 py-0.5 rounded text-on-surface font-mono text-[9px] border border-border-subtle">ESC</kbd> to close</span>
          <span>Click rows to open live chart</span>
        </div>
      </div>
    </div>
  );
}
