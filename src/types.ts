export interface AssetHistoryPoint {
  time: string;
  price: number;
  yield?: number;
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;         // percentage, e.g., +1.02 or -0.42
  prevClose?: number;
  yield?: number;          // for bonds
  volume?: string;
  marketCap?: string;
  high?: number;
  low?: number;
  description: string;
  category: 'Indices' | 'Stocks' | 'Crypto' | 'Forex' | 'Futures' | 'Bonds' | 'Economy';
  iconType: 'circle-badge' | 'logo' | 'icon';
  badgeText?: string;     // e.g. "500", "100", "30"
  badgeColor?: string;    // CSS class or hex code
  logoUrl?: string;
  history: AssetHistoryPoint[];
  trendingRank?: number;  // e.g. 1 for NVIDIA
}
