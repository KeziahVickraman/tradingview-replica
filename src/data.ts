import { Asset } from './types';

// Helper to generate a upward trending history
const genTrendHistory = (startPrice: number, pointsCount: number, changePercent: number, trend: 'up' | 'down' | 'flat' = 'up'): { time: string, price: number }[] => {
  const points: { time: string, price: number }[] = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = pointsCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Seed price simulation
    const volatility = 0.015; // 1.5% max random daily shift
    const randomMultiplier = 1 + (Math.random() - 0.45) * volatility; // slightly positive bias by default
    let trendFactor = 1.001; // default slight up
    
    if (trend === 'up') {
      trendFactor = 1.0025; // stronger up
    } else if (trend === 'down') {
      trendFactor = 0.997; // stronger down
    } else if (trend === 'flat') {
      trendFactor = 1.0; // flat
    }
    
    currentPrice = currentPrice * randomMultiplier * trendFactor;
    points.push({ time: dateStr, price: Math.round(currentPrice * 100) / 100 });
  }
  
  // Force final point to exact desired target price
  if (points.length > 0) {
    points[points.length - 1].price = startPrice;
  }
  
  return points;
};

export const INITIAL_ASSETS: Asset[] = [
  // --- INDICES ---
  {
    symbol: 'S&P 500',
    name: "Standard & Poor's 500",
    price: 5137.08,
    change: 0.80,
    prevClose: 5096.31,
    volume: '2.4B',
    marketCap: '44.3T',
    high: 5143.20,
    low: 5091.10,
    description: 'The Standard & Poor\'s 500 Index is a market-capitalization-weighted index of 500 leading publicly traded companies in the U.S. It is widely regarded as the best single gauge of large-cap U.S. equities.',
    category: 'Indices',
    iconType: 'circle-badge',
    badgeText: '500',
    badgeColor: '#D32F2F', // index-red
    history: genTrendHistory(5137.08, 15, 0.80, 'up')
  },
  {
    symbol: 'Nasdaq 100',
    name: 'Technology Index',
    price: 18103.84,
    change: 1.14,
    prevClose: 17899.80,
    volume: '3.1B',
    marketCap: '22.1T',
    high: 18150.40,
    low: 17875.20,
    description: 'The Nasdaq-100 is a stock market index made up of 101 non-financial equity securities issued by the 100 largest non-financial companies listed on the Nasdaq stock market.',
    category: 'Indices',
    iconType: 'circle-badge',
    badgeText: '100',
    badgeColor: '#00BCD4', // index-blue
    history: genTrendHistory(18103.84, 15, 1.14, 'up')
  },
  {
    symbol: 'Dow 30',
    name: 'Industrial Average',
    price: 39087.38,
    change: -0.12,
    prevClose: 39134.20,
    volume: '1.2B',
    marketCap: '11.8T',
    high: 39160.00,
    low: 38995.50,
    description: 'The Dow Jones Industrial Average is a stock market index that measures the stock performance of 30 large companies listed on stock exchanges in the United States.',
    category: 'Indices',
    iconType: 'circle-badge',
    badgeText: '30',
    badgeColor: '#2962ff', // primary-container
    history: genTrendHistory(39087.38, 15, -0.12, 'down')
  },
  {
    symbol: 'Russell 2000',
    name: 'Small Cap Index',
    price: 2076.35,
    change: 0.45,
    prevClose: 2067.04,
    volume: '950M',
    marketCap: '3.2T',
    high: 2083.50,
    low: 2062.10,
    description: 'The Russell 2000 Index is a small-cap stock market index that makes up the smallest 2,000 stocks in the Russell 3000 Index. It is a benchmark for small-cap U.S. stocks.',
    category: 'Indices',
    iconType: 'circle-badge',
    badgeText: 'R2',
    badgeColor: '#5a5e6b',
    history: genTrendHistory(2076.35, 15, 0.45, 'up')
  },

  // --- US STOCKS ---
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 924.35,
    change: 3.48,
    prevClose: 893.26,
    volume: '58.4M',
    marketCap: '2.31T',
    high: 927.67,
    low: 889.02,
    description: 'NVIDIA Corporation designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market, and is a dominant provider of hardware and software for artificial intelligence (AI) workloads.',
    category: 'Stocks',
    iconType: 'logo',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkXFYqQks5lOtyuLcL2YKGkFb8NY0WMMLUgdc5eLht9rRUA6uQdI8tYXJ64gj2pqhD2h6BuTE7Nq9UnEsWuV68lpfngamJplefLPh-s22xRXcEJ7BLQQUoIHbv23UmRI42FGPpFUojIxiuw9lpMCOkl8vm9oavCpzGjLDBRULOciHMgwXg4hSS0zv2Ef5cS9MmuGRzhzKGtpmZR9Xbkx3doE6yR7t2RbqsTOUaYHDidjwixKPl3DlK',
    trendingRank: 1,
    history: genTrendHistory(924.35, 15, 3.48, 'up')
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.24,
    change: 1.02,
    prevClose: 187.33,
    volume: '52.4M',
    marketCap: '2.92T',
    high: 189.99,
    low: 187.01,
    description: 'Apple Inc. is an American multinational technology company headquartered in Cupertino, California. It designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'AAPL',
    history: genTrendHistory(189.24, 15, 1.02, 'up')
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 415.52,
    change: 0.75,
    prevClose: 412.43,
    volume: '22.8M',
    marketCap: '3.09T',
    high: 416.30,
    low: 411.50,
    description: 'Microsoft Corporation is an American multinational technology company. It is best known for its software products, including the Windows line of operating systems, the Microsoft 365 suite, and the Internet Explorer and Edge web browsers.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'MSFT',
    history: genTrendHistory(415.52, 15, 0.75, 'up')
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.34,
    change: -2.34,
    prevClose: 179.54,
    volume: '88.1M',
    marketCap: '558B',
    high: 180.20,
    low: 174.12,
    description: 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'TSLA',
    history: genTrendHistory(175.34, 15, -2.34, 'down')
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.22,
    change: 1.22,
    prevClose: 176.07,
    volume: '38.5M',
    marketCap: '1.85T',
    high: 179.43,
    low: 175.80,
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing (AWS), online advertising, digital streaming, and artificial intelligence.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'AMZN',
    history: genTrendHistory(178.22, 15, 1.22, 'up')
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 148.48,
    change: 0.94,
    prevClose: 147.10,
    volume: '28.1M',
    marketCap: '1.86T',
    high: 149.20,
    low: 146.90,
    description: 'Alphabet Inc. is an American multinational technology collection of companies, of which Google is the principal subsidiary. It operates through Google Services, Google Cloud, and Other Bets segments.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'GOOG',
    history: genTrendHistory(148.48, 15, 0.94, 'up')
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 505.12,
    change: 1.84,
    prevClose: 496.00,
    volume: '18.9M',
    marketCap: '1.29T',
    high: 508.40,
    low: 495.20,
    description: 'Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., is an American multinational technology conglomerate that operates Facebook, Instagram, Threads, and WhatsApp, among other services.',
    category: 'Stocks',
    iconType: 'icon',
    badgeText: 'META',
    history: genTrendHistory(505.12, 15, 1.84, 'up')
  },

  // --- CRYPTO ---
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 68432.12,
    change: 2.40,
    prevClose: 66828.24,
    volume: '34.5B',
    marketCap: '1.34T',
    high: 68900.00,
    low: 66250.00,
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    category: 'Crypto',
    iconType: 'icon',
    badgeText: 'BTC',
    history: genTrendHistory(68432.12, 15, 2.40, 'up')
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3842.55,
    change: 1.80,
    prevClose: 3774.60,
    volume: '18.2B',
    marketCap: '461.3B',
    high: 3875.00,
    low: 3740.00,
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform.',
    category: 'Crypto',
    iconType: 'icon',
    badgeText: 'ETH',
    history: genTrendHistory(3842.55, 15, 1.80, 'up')
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 145.20,
    change: -0.40,
    prevClose: 145.78,
    volume: '3.8B',
    marketCap: '64.5B',
    high: 147.50,
    low: 142.10,
    description: 'Solana is a blockchain platform designed to host decentralized, scalable applications. It uses a proof-of-stake consensus mechanism along with a novel proof-of-history mechanism.',
    category: 'Crypto',
    iconType: 'icon',
    badgeText: 'SOL',
    history: genTrendHistory(145.20, 15, -0.40, 'down')
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.642,
    change: -1.24,
    prevClose: 0.650,
    volume: '420M',
    marketCap: '22.8B',
    high: 0.658,
    low: 0.635,
    description: 'Cardano is a decentralized public blockchain and cryptocurrency project and is fully open source. Cardano is developing a smart contract platform which seeks to deliver more advanced features than any protocol previously developed.',
    category: 'Crypto',
    iconType: 'icon',
    badgeText: 'ADA',
    history: genTrendHistory(0.642, 15, -1.24, 'down')
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 0.589,
    change: 0.15,
    prevClose: 0.588,
    volume: '980M',
    marketCap: '32.1B',
    high: 0.595,
    low: 0.582,
    description: 'XRP is the native cryptocurrency of the XRP Ledger, an open-source, public blockchain designed to facilitate faster and cheaper global payments.',
    category: 'Crypto',
    iconType: 'icon',
    badgeText: 'XRP',
    history: genTrendHistory(0.589, 15, 0.15, 'flat')
  },

  // --- BONDS ---
  {
    symbol: 'USA 10Y',
    name: 'United States 10-Year Treasury Note',
    price: 98.172,
    change: -0.11,
    yield: 4.608,
    prevClose: 98.280,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 98.350,
    low: 98.050,
    description: 'The US 10-Year Treasury Note is a debt obligation issued by the United States government with a maturity of 10 years. It is widely considered the ultimate global risk-free benchmark.',
    category: 'Bonds',
    iconType: 'icon',
    badgeText: 'US10Y',
    history: genTrendHistory(98.172, 15, -0.11, 'down')
  },
  {
    symbol: 'EU 10Y',
    name: 'Eurozone 10-Year Bund Benchmark',
    price: 98.518,
    change: -0.12,
    yield: 3.174,
    prevClose: 98.636,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 98.700,
    low: 98.450,
    description: 'The Eurozone 10-Year Bund represents the benchmark 10-year sovereign debt of Germany, acting as the primary credit benchmark for the entire European Union currency zone.',
    category: 'Bonds',
    iconType: 'icon',
    badgeText: 'EU10Y',
    history: genTrendHistory(98.518, 15, -0.12, 'down')
  },
  {
    symbol: 'UK 10Y',
    name: 'United Kingdom 10-Year Gilt',
    price: 97.858,
    change: 0.02,
    yield: 5.042,
    prevClose: 97.838,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 98.020,
    low: 97.710,
    description: 'The UK 10-Year Gilt is a British government bond that matures in 10 years, serving as the benchmark interest rate indicator for the UK sterling economy.',
    category: 'Bonds',
    iconType: 'icon',
    badgeText: 'UK10Y',
    history: genTrendHistory(97.858, 15, 0.02, 'flat')
  },
  {
    symbol: 'GER 10Y',
    name: 'Germany 10-Year Government Bund',
    price: 98.518,
    change: -0.12,
    yield: 3.174,
    prevClose: 98.636,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 98.700,
    low: 98.450,
    description: 'Germany 10-Year Bund issued by the Federal Republic of Germany, the highest quality sovereign credit standard in Continental Europe.',
    category: 'Bonds',
    iconType: 'icon',
    badgeText: 'GER10',
    history: genTrendHistory(98.518, 15, -0.12, 'down')
  },

  // --- FOREX ---
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    price: 1.0842,
    change: 0.00,
    prevClose: 1.0842,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 1.0865,
    low: 1.0815,
    description: 'The EUR/USD currency pair tells the user how many US Dollars are needed to buy one Euro. It is the most actively traded forex pair in the world.',
    category: 'Forex',
    iconType: 'icon',
    badgeText: 'EURUSD',
    history: genTrendHistory(1.0842, 15, 0.0, 'flat')
  },
  {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    price: 1.2685,
    change: 0.18,
    prevClose: 1.2662,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 1.2710,
    low: 1.2650,
    description: 'The GBP/USD exchange rate represents the value of Sterling against the US Dollar. It is colloquially referred to as "the Cable".',
    category: 'Forex',
    iconType: 'icon',
    badgeText: 'GBPUSD',
    history: genTrendHistory(1.2685, 15, 0.18, 'up')
  },
  {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    price: 150.45,
    change: -0.22,
    prevClose: 150.78,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 151.05,
    low: 150.12,
    description: 'The USD/JPY exchange rate shows how many Japanese Yen are needed to purchase one US Dollar. It is highly sensitive to yield spreads between the Treasury and Bank of Japan.',
    category: 'Forex',
    iconType: 'icon',
    badgeText: 'USDJPY',
    history: genTrendHistory(150.45, 15, -0.22, 'down')
  },

  // --- FUTURES ---
  {
    symbol: 'Gold',
    name: 'Gold Continuous Contract',
    price: 2185.50,
    change: 0.85,
    prevClose: 2167.10,
    volume: '220K',
    marketCap: 'N/A',
    high: 2195.00,
    low: 2164.30,
    description: 'Gold continuous futures contracts are the ultimate global store of value and hedging vehicle against inflation and geopolitical currency dilution.',
    category: 'Futures',
    iconType: 'icon',
    badgeText: 'GC',
    history: genTrendHistory(2185.50, 15, 0.85, 'up')
  },
  {
    symbol: 'Crude Oil',
    name: 'WTI Crude Oil Futures',
    price: 78.26,
    change: -0.45,
    prevClose: 78.61,
    volume: '340K',
    marketCap: 'N/A',
    high: 78.95,
    low: 77.80,
    description: 'West Texas Intermediate (WTI) Light Sweet Crude Oil futures represent the primary global physical commodity price benchmark for crude petroleum.',
    category: 'Futures',
    iconType: 'icon',
    badgeText: 'CL',
    history: genTrendHistory(78.26, 15, -0.45, 'down')
  },

  // --- ECONOMY ---
  {
    symbol: 'US Inflation',
    name: 'US Consumer Price Index (CPI YoY)',
    price: 3.1,
    change: -0.10, // fell from 3.2%
    prevClose: 3.2,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 3.2,
    low: 3.0,
    description: 'The Consumer Price Index (CPI) measures the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services.',
    category: 'Economy',
    iconType: 'icon',
    badgeText: 'CPI',
    history: [
      { time: 'Aug', price: 3.7 },
      { time: 'Sep', price: 3.7 },
      { time: 'Oct', price: 3.2 },
      { time: 'Nov', price: 3.1 },
      { time: 'Dec', price: 3.4 },
      { time: 'Jan', price: 3.1 }
    ]
  },
  {
    symbol: 'US Fed Rate',
    name: 'Federal Funds Effective Rate',
    price: 5.33,
    change: 0.00,
    prevClose: 5.33,
    volume: 'N/A',
    marketCap: 'N/A',
    high: 5.33,
    low: 5.33,
    description: 'The Federal Funds Rate is the target interest rate range set by the Federal Open Market Committee (FOMC) at which commercial banks borrow and lend overnight.',
    category: 'Economy',
    iconType: 'icon',
    badgeText: 'FED',
    history: [
      { time: 'Jul', price: 5.08 },
      { time: 'Aug', price: 5.33 },
      { time: 'Sep', price: 5.33 },
      { time: 'Oct', price: 5.33 },
      { time: 'Nov', price: 5.33 },
      { time: 'Dec', price: 5.33 }
    ]
  }
];

export const WATCHLIST_SYMBOLS = ['NI225 Japan', 'UKX FTSE 100', 'BTCUSD', 'EURUSD'];
