import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  User, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  Coins,
  DollarSign,
  Activity,
  Award,
  BookOpen,
  X,
  MessageSquare,
  Sparkles,
  Flame,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

import { Asset } from './types';
import { INITIAL_ASSETS } from './data';
import SearchModal from './components/SearchModal';
import AssetDetailModal from './components/AssetDetailModal';
import CommunityDrawer from './components/CommunityDrawer';
import ScreenerModal from './components/ScreenerModal';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('marketflow_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('marketflow_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('marketflow_dark_mode', 'false');
    }
  }, [isDarkMode]);

  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['NI225 Japan', 'UKX FTSE 100', 'BTCUSD', 'EURUSD']);
  
  // Active states
  const [focusedAsset, setFocusedAsset] = useState<Asset>(
    INITIAL_ASSETS.find(a => a.symbol === 'NVDA') || INITIAL_ASSETS[4]
  );
  const [activeTab, setActiveTab] = useState('Indices');

  // Modal / drawer controls
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [screenerCategory, setScreenerCategory] = useState<'Stocks' | 'Crypto'>('Stocks');
  
  // Custom alerts and welcome modal
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Keyboard shortcut listener for Search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Utility to handle adding/removing from watchlist
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols(prev => {
      const exists = prev.includes(symbol);
      let next: string[];
      if (exists) {
        next = prev.filter(s => s !== symbol);
        triggerAlert(`Removed ${symbol} from Watchlist`);
      } else {
        next = [...prev, symbol];
        triggerAlert(`Added ${symbol} to Watchlist`);
      }
      return next;
    });
  };

  // Temporary notifications
  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Smooth scroll to element ID
  const scrollToSection = (id: string, tabName: string) => {
    setActiveTab(tabName);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getWatchlistAssets = () => {
    // Find matching assets by symbol or name
    return watchlistSymbols.map(sym => {
      const found = assets.find(a => a.symbol === sym || a.name === sym || `${a.symbol}USD` === sym);
      if (found) return found;
      // Fallback dummy for NI225 Japan or UKX FTSE 100 which might be special names
      if (sym.includes('NI225')) {
        return {
          symbol: 'NI225',
          name: 'NI225 Japan',
          price: 39120.50,
          change: 1.24,
          description: 'Nikkei 225 index',
          category: 'Indices',
          iconType: 'icon'
        } as Asset;
      }
      if (sym.includes('UKX')) {
        return {
          symbol: 'UKX',
          name: 'UKX FTSE 100',
          price: 7912.40,
          change: -0.42,
          description: 'FTSE 100 Index',
          category: 'Indices',
          iconType: 'icon'
        } as Asset;
      }
      if (sym.includes('BTC')) {
        return assets.find(a => a.symbol === 'BTC') || assets[7];
      }
      if (sym.includes('EUR')) {
        return assets.find(a => a.symbol === 'EURUSD') || assets[11];
      }
      return {
        symbol: sym,
        name: sym,
        price: 100,
        change: 0.5,
        category: 'Indices',
        iconType: 'icon'
      } as Asset;
    });
  };

  const watchlistAssets = getWatchlistAssets();

  // Active indices
  const sp500 = assets.find(a => a.symbol === 'S&P 500') || assets[0];
  const nasdaq = assets.find(a => a.symbol === 'Nasdaq 100') || assets[1];
  const dow = assets.find(a => a.symbol === 'Dow 30') || assets[2];

  // Top gainers (click to focus)
  const topGainers = assets.filter(a => ['AAPL', 'MSFT', 'TSLA', 'AMZN'].includes(a.symbol));

  // Crypto coins for preview
  const btc = assets.find(a => a.symbol === 'BTC') || assets[7];
  const eth = assets.find(a => a.symbol === 'ETH') || assets[8];
  const sol = assets.find(a => a.symbol === 'SOL') || assets[9];

  // Bonds
  const bonds = assets.filter(a => a.category === 'Bonds');

  return (
    <div className={`bg-background text-on-surface font-sans antialiased min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      
      {/* Dynamic Alerts Banner */}
      {alertMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 animate-slide-up border border-outline-variant">
          <CheckCircle2 className="w-5 h-5 text-status-positive" />
          <span className="text-xs font-semibold">{alertMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border-subtle h-14 flex items-center">
        <div className="flex items-center justify-between px-6 w-full max-w-7xl mx-auto">
          {/* Brand & Search */}
          <div className="flex items-center space-x-8 flex-1">
            <a className="font-headline-section text-lg font-extrabold text-on-background flex items-center group" href="#" onClick={() => window.location.reload()}>
              <span className="text-primary mr-1.5 transition-transform group-hover:scale-110">
                <svg fill="none" height="22" viewBox="0 0 24 24" width="22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18V13.7C4 13.06 4.25 12.45 4.7 12L10.3 7.3C10.75 6.9 11.25 6.7 11.8 6.7C12.35 6.7 12.85 6.9 13.3 7.3L19.3 12.7C19.75 13.15 20 13.76 20 14.4V18" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </span>
              <span className="tracking-tight text-on-surface font-bold text-base md:text-lg">MarketFlow</span>
            </a>

            {/* Simulated instant search triggers the actual functional modal */}
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center bg-surface-muted hover:bg-surface-container px-3.5 py-1.5 rounded-full w-64 group cursor-pointer border border-transparent hover:border-border-subtle transition-all"
            >
              <Search className="text-outline mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="text-outline text-xs font-body-muted select-none flex-1">Search (Ctrl+K)</span>
              <kbd className="font-mono text-[9px] bg-surface-container border border-border-subtle px-1.5 py-0.2 rounded text-outline group-hover:text-on-surface transition-colors">⌘K</kbd>
            </div>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center space-x-6 mx-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-main text-xs font-semibold" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Navigating to Products suite...') }}>Products</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-main text-xs font-semibold" href="#" onClick={(e) => { e.preventDefault(); setIsCommunityOpen(true); }}>Community</a>
            <a className="text-primary border-b-2 border-primary font-bold font-body-main text-xs h-14 flex items-center" href="#" onClick={(e) => e.preventDefault()}>Markets</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-main text-xs font-semibold" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Loading authorized partner brokers...') }}>Brokers</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-main text-xs font-semibold" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('More tools coming soon!') }}>More</a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-on-surface-variant hover:bg-surface-muted rounded-full transition-colors"
              title={isDarkMode ? 'Switch to Day version' : 'Switch to Night version'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => triggerAlert('Language selected: English')}
              className="p-1.5 text-on-surface-variant hover:bg-surface-muted rounded-full transition-colors"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsWelcomeOpen(true)}
              className="p-1.5 text-on-surface-variant hover:bg-surface-muted rounded-full transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsWelcomeOpen(true)}
              className="bg-primary text-on-primary px-4 py-1.5 rounded-full font-bold text-xs hover:bg-on-primary-fixed-variant hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/15"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        
        {/* Hero Section */}
        <section className="mb-10">
          <div 
            onClick={() => setIsWelcomeOpen(true)}
            className="flex items-center space-x-3 mb-6 group cursor-pointer inline-flex"
          >
            <h1 className="font-headline-section text-3xl md:text-4xl font-extrabold text-on-background tracking-tight flex items-center">
              Markets, everywhere
              <ChevronDown className="ml-3 text-2xl text-outline group-hover:text-primary group-hover:translate-y-1 transition-all" />
            </h1>
          </div>

          {/* Sub-navigation categories */}
          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-3 border-b border-border-subtle">
            {[
              { label: 'Indices', id: 'indices-section' },
              { label: 'Stocks', id: 'stocks-section' },
              { label: 'Crypto', id: 'crypto-section' },
              { label: 'Forex', id: 'bonds-section' }, // smooth scrolls to sections containing forex assets
              { label: 'Futures', id: 'bonds-section' },
              { label: 'Bonds', id: 'bonds-section' },
              { label: 'Economy', id: 'bonds-section' }
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => scrollToSection(tab.id, tab.label)}
                className={`px-5 py-1.5 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                  activeTab === tab.label
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-muted hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Desktop grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Area */}
          <aside className="lg:col-span-3 space-y-8 order-2 lg:order-1">
            
            {/* Global Watchlist Card */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-border-subtle shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-caps text-xs text-outline uppercase tracking-wider font-bold">
                  Global Watchlist
                </h3>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1 hover:bg-surface-container text-primary rounded-full transition-colors"
                  title="Search & Add Assets"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                {watchlistAssets.map((asset) => {
                  const isPositive = asset.change >= 0;
                  return (
                    <div 
                      key={asset.symbol} 
                      className="flex items-center justify-between group cursor-pointer hover:bg-surface-container p-1.5 rounded-lg transition-all"
                      onClick={() => {
                        setFocusedAsset(asset);
                        triggerAlert(`Active chart set to ${asset.symbol}`);
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <span className={`material-symbols-outlined text-sm mr-2.5 ${
                          asset.category === 'Crypto' ? 'text-amber-500' :
                          asset.category === 'Bonds' ? 'text-primary' :
                          isPositive ? 'text-status-positive' : 'text-status-negative'
                        }`}>
                          {asset.category === 'Crypto' ? 'currency_bitcoin' :
                           asset.category === 'Bonds' ? 'leaderboard' : 'show_chart'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-on-surface truncate leading-tight">{asset.symbol}</p>
                          <p className="text-[10px] text-outline truncate">{asset.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="text-right">
                          <p className="font-data-tabular text-xs text-on-surface font-semibold">
                            {asset.category === 'Bonds' ? `${asset.price.toFixed(3)}%` : asset.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </p>
                          <p className={`font-data-tabular text-[10px] font-bold ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                            {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleWatchlist(asset.symbol)}
                          className="text-outline hover:text-status-negative opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-surface-muted transition-all"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Master the Markets Promotional Banner */}
            <div className="bg-surface-muted rounded-xl overflow-hidden relative group h-64 border border-border-subtle shadow-xs">
              <div 
                className="bg-cover bg-center w-full h-full opacity-35 group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqakkLwAfL3unG6pQ5-nsza-W7w-7_fuuJIkmf2PHqVhTCFEB9cr-U7mcwrQ7WAGu_g7Eqt6mF8_Sx6rc0YvY4D0cgBi6Tb_Ld5WKxYIMrVM0IQaLfLtqN5kNNvgD--8hwgFlgAfJ8xOXIsWC4eGZi1g91LsSK78C7s5zW4_52Mv-VoF3ZW0EyZP9bRPq3eITkpEqUWrksC9ch0KZKce5HotaFsR9bsFcL6uAF7SOrIqdO8BymqHv1')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent p-5 flex flex-col justify-end">
                <h4 className="font-headline-section text-on-background text-base font-bold mb-1">Master the Markets</h4>
                <p className="font-body-muted text-[11px] text-outline mb-3.5 leading-relaxed">Join our community of 50M+ professional traders worldwide.</p>
                <button 
                  onClick={() => setIsCommunityOpen(true)}
                  className="bg-on-background text-background w-full py-2 rounded-lg font-bold text-xs transition-colors hover:bg-primary hover:text-white"
                >
                  Open Community
                </button>
              </div>
            </div>

          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-12 order-1 lg:order-2">
            
            {/* Indices Section */}
            <section id="indices-section" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-5 group cursor-pointer">
                <h2 className="font-headline-section text-xl md:text-2xl font-bold flex items-center group-hover:text-primary transition-colors text-on-surface">
                  Indices
                  <ChevronRight className="ml-1.5 text-xl text-outline group-hover:translate-x-1 transition-transform" />
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[sp500, nasdaq, dow].map((index) => {
                  const isPositive = index.change >= 0;
                  return (
                    <div 
                      key={index.symbol}
                      onClick={() => {
                        setFocusedAsset(index);
                        setIsDetailOpen(true);
                      }}
                      className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4.5 transition-all hover:shadow-md hover:bg-surface-muted/30 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-full text-on-primary flex items-center justify-center font-bold text-xs`} style={{ backgroundColor: index.badgeColor || '#0049db' }}>
                            {index.badgeText}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface leading-tight">{index.symbol}</p>
                            <p className="text-[11px] text-outline font-body-muted truncate max-w-[120px]">{index.name}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-data-tabular text-sm font-semibold text-on-surface">{index.price.toLocaleString()}</p>
                          <p className={`font-data-tabular text-xs font-bold ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                            {isPositive ? '+' : ''}{index.change.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      {/* Small inline sparkline chart using Recharts */}
                      <div className="h-16 w-full mt-2 bg-surface-muted/30 rounded overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={index.history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke={isPositive ? '#089981' : '#F23645'} 
                              strokeWidth={1.5} 
                              fill={isPositive ? '#089981' : '#F23645'} 
                              fillOpacity={0.06} 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* US Stocks Section */}
            <section id="stocks-section" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-5 group cursor-pointer">
                <h2 className="font-headline-section text-xl md:text-2xl font-bold flex items-center group-hover:text-primary transition-colors text-on-surface">
                  US Stocks
                  <ChevronRight className="ml-1.5 text-xl text-outline group-hover:translate-x-1 transition-transform" />
                </h2>
              </div>

              <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  
                  {/* Focus Highlight Card */}
                  <div className="md:col-span-5 p-6 border-r border-border-subtle bg-surface-container-low flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-3">
                          {focusedAsset.logoUrl ? (
                            <img src={focusedAsset.logoUrl} alt={focusedAsset.name} className="w-11 h-11 rounded-full border border-border-subtle" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs text-on-surface">
                              {focusedAsset.symbol.substring(0, 4)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-base text-on-surface leading-tight">{focusedAsset.name}</h4>
                            <span className="text-xs text-outline font-semibold font-mono">{focusedAsset.symbol}</span>
                          </div>
                        </div>

                        {focusedAsset.symbol === 'NVDA' && (
                          <span className="text-[10px] font-bold font-label-caps bg-status-positive/10 text-status-positive px-2 py-0.5 rounded uppercase">
                            Trending #1
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-3xl md:text-4xl font-extrabold text-on-surface font-headline-section tracking-tight">
                          {focusedAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm font-bold font-data-tabular ${focusedAsset.change >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                          {focusedAsset.change >= 0 ? '+' : ''}{focusedAsset.change.toFixed(2)}%
                        </span>
                      </div>

                      {/* Interactive focus stock chart */}
                      <div className="h-44 w-full bg-surface-container-lowest rounded-xl p-2 border border-border-subtle relative mt-2 shadow-inner">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={focusedAsset.history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <defs>
                              <linearGradient id="focusChart" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={focusedAsset.change >= 0 ? '#089981' : '#F23645'} stopOpacity={0.2}/>
                                <stop offset="95%" stopColor={focusedAsset.change >= 0 ? '#089981' : '#F23645'} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'var(--color-surface-container)', 
                                color: 'var(--color-on-surface)', 
                                fontSize: '11px', 
                                borderRadius: '6px',
                                border: '1px solid var(--color-border-subtle)'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke={focusedAsset.change >= 0 ? '#089981' : '#F23645'} 
                              strokeWidth={2} 
                              fill="url(#focusChart)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsDetailOpen(true)}
                      className="mt-6 w-full bg-primary text-on-primary py-2.5 rounded-full font-bold text-xs hover:bg-on-primary-fixed-variant transition-transform active:scale-95 shadow-md shadow-primary/15"
                    >
                      Launch full chart
                    </button>
                  </div>

                  {/* List Sidebar - Top Gainers */}
                  <div className="md:col-span-7 flex flex-col justify-between bg-surface-container-lowest">
                    <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5 bg-surface-container-low/40">
                      <span className="font-label-caps text-xs text-outline uppercase font-bold">Top Gainers (Pre-market)</span>
                      <Activity className="w-4 h-4 text-primary" />
                    </div>

                    <div className="divide-y divide-border-subtle flex-1">
                      {topGainers.map((stock) => {
                        const isPositive = stock.change >= 0;
                        const isFocused = focusedAsset.symbol === stock.symbol;

                        return (
                          <div 
                            key={stock.symbol}
                            onClick={() => {
                              setFocusedAsset(stock);
                              triggerAlert(`Focused asset updated to ${stock.symbol}`);
                            }}
                            className={`flex items-center justify-between px-5 py-3.5 hover:bg-surface-muted transition-colors cursor-pointer group ${
                              isFocused ? 'bg-surface-container-low/50 border-l-4 border-primary' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded bg-surface-muted flex items-center justify-center font-bold text-xs mr-3 text-outline group-hover:text-primary transition-colors">
                                {stock.symbol}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-xs text-on-surface truncate leading-snug">{stock.name}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 flex-shrink-0">
                              <div className="text-right">
                                <p className="font-data-tabular text-xs font-semibold text-on-surface">${stock.price.toFixed(2)}</p>
                                <p className={`font-data-tabular text-[11px] font-bold ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                                  {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-outline group-hover:text-on-surface group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stock Screener Trigger */}
                    <div className="px-5 py-3.5 border-t border-border-subtle bg-surface-container-low/30 text-center">
                      <a 
                        onClick={(e) => {
                          e.preventDefault();
                          setScreenerCategory('Stocks');
                          setIsScreenerOpen(true);
                        }}
                        className="text-primary font-bold text-xs flex items-center justify-center hover:underline cursor-pointer group" 
                        href="#"
                      >
                        See all stocks with largest daily growth
                        <ExternalLink className="w-3.5 h-3.5 ml-1 text-primary group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Crypto Bento Grid Section */}
            <section id="crypto-section" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-5 group cursor-pointer">
                <h2 className="font-headline-section text-xl md:text-2xl font-bold flex items-center group-hover:text-primary transition-colors text-on-surface">
                  Crypto
                  <ChevronRight className="ml-1.5 text-xl text-outline group-hover:translate-x-1 transition-transform" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* BTC */}
                <div 
                  onClick={() => {
                    setFocusedAsset(btc);
                    setIsDetailOpen(true);
                  }}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span className="font-bold text-xs text-on-surface">Bitcoin</span>
                    </div>
                    <span className="font-mono text-[10px] text-outline uppercase font-bold">BTC</span>
                  </div>
                  <div>
                    <p className="font-data-tabular text-lg md:text-xl font-extrabold text-on-surface">${btc.price.toLocaleString()}</p>
                    <p className="font-data-tabular text-status-positive text-xs font-bold mt-0.5 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      +{btc.change}%
                    </p>
                  </div>
                </div>

                {/* ETH */}
                <div 
                  onClick={() => {
                    setFocusedAsset(eth);
                    setIsDetailOpen(true);
                  }}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold text-xs text-on-surface">Ethereum</span>
                    </div>
                    <span className="font-mono text-[10px] text-outline uppercase font-bold">ETH</span>
                  </div>
                  <div>
                    <p className="font-data-tabular text-lg md:text-xl font-extrabold text-on-surface">${eth.price.toLocaleString()}</p>
                    <p className="font-data-tabular text-status-positive text-xs font-bold mt-0.5 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      +{eth.change}%
                    </p>
                  </div>
                </div>

                {/* SOL */}
                <div 
                  onClick={() => {
                    setFocusedAsset(sol);
                    setIsDetailOpen(true);
                  }}
                  className="bg-surface-container-lowest p-5 rounded-2xl border border-border-subtle shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-36"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-teal-500" />
                      <span className="font-bold text-xs text-on-surface">Solana</span>
                    </div>
                    <span className="font-mono text-[10px] text-outline uppercase font-bold">SOL</span>
                  </div>
                  <div>
                    <p className="font-data-tabular text-lg md:text-xl font-extrabold text-on-surface">${sol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="font-data-tabular text-status-negative text-xs font-bold mt-0.5 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                      {sol.change}%
                    </p>
                  </div>
                </div>

                {/* Explore Screeners Block */}
                <div 
                  onClick={() => {
                    setScreenerCategory('Crypto');
                    setIsScreenerOpen(true);
                  }}
                  className="bg-primary p-5 rounded-2xl border border-primary flex flex-col justify-between cursor-pointer hover:bg-on-primary-fixed-variant hover:scale-102 transition-all text-on-primary h-36 shadow-lg shadow-primary/20"
                >
                  <p className="font-headline-section text-base font-extrabold leading-tight">Explore 5000+ Assets</p>
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs tracking-wider">Crypto Screeners</span>
                    <span className="material-symbols-outlined font-bold">trending_flat</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bonds Section */}
            <section id="bonds-section" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-5 group cursor-pointer">
                <h2 className="font-headline-section text-xl md:text-2xl font-bold flex items-center group-hover:text-primary transition-colors text-on-surface">
                  Major 10Y Bonds
                  <ChevronRight className="ml-1.5 text-xl text-outline group-hover:translate-x-1 transition-transform" />
                </h2>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface-container-lowest shadow-xs">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="bg-surface-container-high border-b border-border-subtle">
                    <tr>
                      <th className="px-6 py-3 font-label-caps text-xs text-outline font-bold">Symbol</th>
                      <th className="px-6 py-3 font-label-caps text-xs text-outline font-bold text-right">Price</th>
                      <th className="px-6 py-3 font-label-caps text-xs text-outline font-bold text-right">Change %</th>
                      <th className="px-6 py-3 font-label-caps text-xs text-outline font-bold text-right">Yield %</th>
                      <th className="px-6 py-3 font-label-caps text-xs text-outline font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {bonds.map((bond) => {
                      const isPositive = bond.change >= 0;
                      return (
                        <tr 
                          key={bond.symbol} 
                          onClick={() => {
                            setFocusedAsset(bond);
                            setIsDetailOpen(true);
                          }}
                          className="hover:bg-surface-muted transition-colors cursor-pointer group h-14"
                        >
                          <td className="px-6 font-bold text-xs text-on-surface font-body-main">
                            {bond.symbol}
                          </td>
                          <td className="px-6 text-right font-data-tabular text-xs font-semibold text-on-surface-variant">
                            {bond.price.toFixed(3)}%
                          </td>
                          <td className={`px-6 text-right font-data-tabular text-xs font-bold ${isPositive ? 'text-status-positive' : 'text-status-negative'}`}>
                            {isPositive ? '+' : ''}{bond.change.toFixed(2)}%
                          </td>
                          <td className="px-6 text-right font-data-tabular text-xs font-semibold text-on-surface">
                            {bond.yield?.toFixed(3)}%
                          </td>
                          <td className="px-6 text-center">
                            <span className="relative flex h-2.5 w-2.5 mx-auto">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPositive ? 'bg-status-positive' : 'bg-status-negative'} opacity-75`}></span>
                              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isPositive ? 'bg-status-positive' : 'bg-status-negative'}`}></span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle py-12 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 w-full max-w-7xl mx-auto space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-1.5">
            <div className="font-label-caps text-xs font-bold text-primary flex items-center space-x-1.5">
              <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18V13.7C4 13.06 4.25 12.45 4.7 12L10.3 7.3C10.75 6.9 11.25 6.7 11.8 6.7C12.35 6.7 12.85 6.9 13.3 7.3L19.3 12.7C19.75 13.15 20 13.76 20 14.4V18" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
              <span>MarketFlow Terminal</span>
            </div>
            <p className="font-body-muted text-xs text-outline">© 2026 MarketFlow Terminal. Real-time institutional grade monitoring.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a className="font-body-muted text-xs text-outline hover:text-primary transition-colors hover:underline" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Reviewing privacy practices...') }}>Privacy Policy</a>
            <a className="font-body-muted text-xs text-outline hover:text-primary transition-colors hover:underline" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Reviewing terminal terms...') }}>Terms of Service</a>
            <a className="font-body-muted text-xs text-outline hover:text-primary transition-colors hover:underline" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Cookie options...') }}>Cookies</a>
            <a className="font-body-muted text-xs text-outline hover:text-primary transition-colors hover:underline" href="#" onClick={(e) => { e.preventDefault(); triggerAlert('Opening developer API portal...') }}>API Documentation</a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-3.5">
            {['twitter', 'github'].map((social) => (
              <a 
                key={social}
                href="#"
                onClick={(e) => { e.preventDefault(); triggerAlert(`Redirecting to our official ${social} account...`) }}
                className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center text-outline hover:text-primary hover:border-primary transition-colors"
              >
                {social === 'twitter' ? '𝕏' : 'Git'}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* --- ALL FUNCTIONAL MODALS --- */}

      {/* Search Modal (Ctrl+K) */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        watchlist={watchlistSymbols}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectAsset={(asset) => {
          setFocusedAsset(asset);
          setIsDetailOpen(true);
        }}
      />

      {/* Detailed Analysis / Timeline Chart Modal */}
      <AssetDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        asset={focusedAsset}
        watchlist={watchlistSymbols}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Community Drawer with Simulated Group Chat */}
      <CommunityDrawer
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />

      {/* Comprehensive Ticker Screener Modal */}
      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        assets={assets}
        category={screenerCategory}
        watchlist={watchlistSymbols}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectAsset={(asset) => {
          setFocusedAsset(asset);
          setIsDetailOpen(true);
        }}
      />

      {/* Welcome / Get Started Modal */}
      {isWelcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl border border-border-subtle shadow-2xl p-6 relative animate-slide-up text-center">
            <button 
              onClick={() => setIsWelcomeOpen(false)} 
              className="absolute top-4 right-4 p-1 text-outline hover:text-on-surface rounded-full hover:bg-surface-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7" />
            </div>

            <h3 className="font-headline-section text-xl font-bold text-on-surface mb-2">Welcome to MarketFlow</h3>
            <p className="text-sm text-outline font-body-main mb-6 leading-relaxed">
              Your institutional-grade terminal simulation is live. Create watchlists, monitor bond yields, track AI trending hardware, and join live broker chats.
            </p>

            <div className="space-y-3 mb-6 text-left bg-surface-container-low p-4 rounded-xl border border-border-subtle">
              <div className="flex items-start space-x-2.5 text-xs text-on-surface">
                <CheckCircle2 className="w-4 h-4 text-status-positive flex-shrink-0 mt-0.5" />
                <span><strong>Instant Search:</strong> Use <kbd className="bg-surface-container px-1 py-0.2 border border-border-subtle rounded font-mono">⌘K</kbd> anywhere to search assets.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-on-surface">
                <CheckCircle2 className="w-4 h-4 text-status-positive flex-shrink-0 mt-0.5" />
                <span><strong>Hot-Swappable Charts:</strong> Click any top gainer stock to swap the focus chart.</span>
              </div>
              <div className="flex items-start space-x-2.5 text-xs text-on-surface">
                <CheckCircle2 className="w-4 h-4 text-status-positive flex-shrink-0 mt-0.5" />
                <span><strong>Interactive Chat:</strong> Toggle the Community drawer to chat with other traders.</span>
              </div>
            </div>

            <button
              onClick={() => setIsWelcomeOpen(false)}
              className="w-full bg-primary text-on-primary py-2.5 rounded-full font-bold text-xs hover:bg-on-primary-fixed-variant transition-transform active:scale-95 shadow-md shadow-primary/15"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
