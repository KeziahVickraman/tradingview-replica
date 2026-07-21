import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, Flame, TrendingUp } from 'lucide-react';

interface ChatMessage {
  id: string;
  user: string;
  role: string;
  text: string;
  time: string;
  avatarColor: string;
  badge?: string;
}

interface CommunityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityDrawer({ isOpen, onClose }: CommunityDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'AlphaTrader',
      role: 'Pro Analyst',
      text: 'NVIDIA $924 mark is holding incredibly strong. Daily volume is looking ready for a continuation towards $950.',
      time: '06:12 AM',
      avatarColor: 'bg-emerald-500',
      badge: 'Bullish'
    },
    {
      id: '2',
      user: 'CryptoWave',
      role: 'Swing Trader',
      text: 'Bitcoin holding $68k after consolidation is a macro bullish signal. Expecting a push above $70k by the weekend.',
      time: '06:14 AM',
      avatarColor: 'bg-sky-500',
      badge: 'HODL'
    },
    {
      id: '3',
      user: 'BondVigilante',
      role: 'Macro Strategist',
      text: '10Y treasury yield at 4.608% is putting slight pressure on tech multiples, but generative AI cash flow justifies the current valuation.',
      time: '06:15 AM',
      avatarColor: 'bg-indigo-500'
    }
  ]);
  const [input, setInput] = useState('');
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You (Trader_05)',
      role: 'MarketFlow Member',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatarColor: 'bg-primary'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate system bot replies
    setTimeout(() => {
      const botReplies = [
        "Analyzing sentiment... Your perspective aligns with current market momentum indexes. Stay tuned for the upcoming breakout!",
        "Fascinating entry. Our index screeners are reporting high capital inflows for similar ticker configurations.",
        "That matches the current order book liquidity charts! Volume indicators suggest high retail interest.",
        "Excellent point. Make sure to watch the US 10Y yields today to verify your entry risk boundaries."
      ];
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        user: 'MarketFlowBot',
        role: 'AI Analyst',
        text: botReplies[Math.floor(Math.random() * botReplies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatarColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        badge: 'Verified AI'
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Panel */}
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-border-subtle animate-slide-left z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-border-subtle flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface font-headline-section text-base">Terminal Community</h3>
              <p className="text-[11px] text-outline font-body-muted flex items-center">
                <Flame className="w-3 h-3 text-amber-500 mr-1" />
                52,431 active traders online
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-outline hover:text-on-surface rounded-full hover:bg-surface-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hot Tickers bar */}
        <div className="px-5 py-2.5 bg-surface-muted border-b border-border-subtle flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-label-caps whitespace-nowrap">Hot Discussed:</span>
          {['NVDA', 'BTCUSD', 'TSLA', 'AAPL', 'USA10Y'].map((t) => (
            <span key={t} className="bg-white px-2 py-0.5 rounded border border-border-subtle text-[11px] font-semibold text-on-surface flex items-center space-x-1 flex-shrink-0">
              <TrendingUp className="w-2.5 h-2.5 text-status-positive" />
              <span>{t}</span>
            </span>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface/40">
          {messages.map((msg) => {
            const isAI = msg.user === 'MarketFlowBot';
            const isUser = msg.user.startsWith('You');

            return (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-3 max-w-[90%] ${isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full ${msg.avatarColor} text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm`}>
                  {isAI ? '🤖' : <User className="w-4 h-4" />}
                </div>

                {/* Bubble details */}
                <div className="space-y-1">
                  <div className={`flex items-center space-x-2 ${isUser ? 'justify-end' : ''}`}>
                    <span className="font-bold text-xs text-on-surface">{msg.user}</span>
                    <span className="text-[10px] bg-surface-container text-outline px-1.5 py-0.5 rounded font-medium">
                      {msg.role}
                    </span>
                    {msg.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        msg.badge === 'Bullish' ? 'bg-status-positive/10 text-status-positive' :
                        msg.badge === 'HODL' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {msg.badge}
                      </span>
                    )}
                  </div>

                  <div className={`p-3 rounded-xl text-sm ${
                    isUser ? 'bg-primary text-white rounded-tr-none' :
                    isAI ? 'bg-indigo-50 border border-indigo-100 text-on-surface rounded-tl-none' :
                    'bg-white border border-border-subtle text-on-surface rounded-tl-none'
                  } shadow-sm leading-normal`}>
                    {msg.text}
                  </div>

                  <p className={`text-[9px] text-outline font-body-muted ${isUser ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={feedEndRef} />
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="p-4 border-t border-border-subtle bg-white flex items-center space-x-2">
          <input
            type="text"
            placeholder="Discuss market activity, share ideas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-surface-muted px-4 py-2.5 rounded-full border border-border-subtle outline-none font-body-main text-sm focus:border-primary focus:bg-white transition-all placeholder-outline text-on-surface"
          />
          <button 
            type="submit"
            className="p-2.5 bg-primary text-on-primary rounded-full hover:bg-on-primary-fixed-variant transition-colors active:scale-95 shadow-md shadow-primary/20 flex-shrink-0"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
