import React, { useState } from 'react';
import { X, Star, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';
import { Asset } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export default function AssetDetailModal({
  isOpen,
  onClose,
  asset,
  watchlist,
  onToggleWatchlist
}: AssetDetailModalProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1M');
  const isStarred = watchlist.includes(asset.symbol);
  const isPositive = asset.change >= 0;

  if (!isOpen) return null;

  // Let's adapt data slightly based on timeframe to simulate dynamic timelines
  const getTimelineData = () => {
    const original = asset.history;
    if (timeframe === '1D') {
      // Return 6 high-density points representing hourly movements
      return [
        { time: '09:30', price: asset.price * 0.992 },
        { time: '11:00', price: asset.price * 0.995 },
        { time: '12:30', price: asset.price * 0.991 },
        { time: '14:00', price: asset.price * 1.003 },
        { time: '15:30', price: asset.price * 1.001 },
        { time: '16:00', price: asset.price }
      ];
    }
    if (timeframe === '5D') {
      return original.slice(-5);
    }
    if (timeframe === '1Y') {
      // Simulate monthly points
      return [
        { time: 'Jan', price: asset.price * 0.85 },
        { time: 'Mar', price: asset.price * 0.89 },
        { time: 'May', price: asset.price * 0.92 },
        { time: 'Jul', price: asset.price * 0.95 },
        { time: 'Sep', price: asset.price * 0.98 },
        { time: 'Nov', price: asset.price * 1.02 },
        { time: 'Current', price: asset.price }
      ];
    }
    return original; // default 1M
  };

  const chartData = getTimelineData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl border border-border-subtle shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center space-x-4">
            {asset.logoUrl ? (
              <img src={asset.logoUrl} alt={asset.name} className="w-12 h-12 rounded-full border border-border-subtle" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm text-on-surface">
                {asset.symbol.substring(0, 4)}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-on-surface font-headline-section">{asset.name}</h2>
                <span className="text-sm font-semibold font-mono text-outline">{asset.symbol}</span>
                {asset.trendingRank && (
                  <span className="bg-status-positive/10 text-status-positive text-[10px] font-bold font-label-caps px-2 py-0.5 rounded uppercase">
                    Trending #{asset.trendingRank}
                  </span>
                )}
              </div>
              <p className="text-xs text-outline font-body-muted mt-0.5">Asset Class: <span className="font-semibold text-on-surface-variant">{asset.category}</span></p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`p-2 rounded-full hover:bg-surface-muted transition-colors ${
                isStarred ? 'text-amber-500' : 'text-outline hover:text-on-surface'
              }`}
              title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star className="w-5 h-5" fill={isStarred ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-outline hover:text-on-surface rounded-full hover:bg-surface-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Price Header */}
          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <span className="text-4xl font-extrabold text-on-surface font-display-hero">
                {asset.category === 'Bonds' ? `${asset.price.toFixed(3)}%` : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`ml-3 text-lg font-bold font-data-tabular ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
              </span>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-surface-muted p-1 rounded-lg self-start">
              {(['1D', '5D', '1M', '1Y'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    timeframe === t
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="h-64 w-full bg-surface-muted/30 rounded-xl p-2 border border-border-subtle">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#737687" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#737687" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-container)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    color: 'var(--color-on-surface)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  formatter={(val: number) => [val.toLocaleString(undefined, { minimumFractionDigits: 2 }), 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#chartColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats & Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Description */}
            <div className="md:col-span-7 space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-outline font-label-caps flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-primary" />
                Profile & Overview
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed font-body-main">
                {asset.description}
              </p>
            </div>

            {/* Performance Stats */}
            <div className="md:col-span-5 bg-surface-container-low p-4 rounded-xl border border-border-subtle space-y-3.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-text-muted font-label-caps">
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4 divide-y divide-border-subtle">
                <div className="pt-0">
                  <p className="text-[10px] uppercase font-bold text-outline font-label-caps">Volume</p>
                  <p className="font-data-tabular text-sm text-on-surface mt-0.5">{asset.volume || 'N/A'}</p>
                </div>
                <div className="pt-0">
                  <p className="text-[10px] uppercase font-bold text-outline font-label-caps">Market Cap</p>
                  <p className="font-data-tabular text-sm text-on-surface mt-0.5">{asset.marketCap || 'N/A'}</p>
                </div>
                <div className="pt-3">
                  <p className="text-[10px] uppercase font-bold text-outline font-label-caps">Day High</p>
                  <p className="font-data-tabular text-sm text-status-positive mt-0.5">
                    {asset.category === 'Bonds' ? `${(asset.high || asset.price).toFixed(3)}%` : (asset.high || asset.price).toLocaleString()}
                  </p>
                </div>
                <div className="pt-3">
                  <p className="text-[10px] uppercase font-bold text-outline font-label-caps">Day Low</p>
                  <p className="font-data-tabular text-sm text-status-negative mt-0.5">
                    {asset.category === 'Bonds' ? `${(asset.low || asset.price).toFixed(3)}%` : (asset.low || asset.price).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface-container-low px-6 py-4 border-t border-border-subtle flex justify-between items-center">
          <div className="flex items-center space-x-1.5 text-[11px] text-outline">
            <span className="w-2 h-2 rounded-full bg-status-positive animate-pulse"></span>
            <span>Live Feed Connected</span>
          </div>
          <button 
            onClick={onClose} 
            className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold text-xs hover:bg-on-primary-fixed-variant transition-transform active:scale-95 shadow-md shadow-primary/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
