import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, Heart, Send, Users, Share2,
  MoreHorizontal, Volume2, VolumeX, Maximize, Radio,
  Coins, X, ChevronUp, Trophy, Lock, Eye
} from "lucide-react";
import { creators } from "@/data/mockData";
import { streamGifts, coinPackages, type StreamGift } from "@/data/coins";
import { Input } from "@/components/ui/input";

/* ── mock chat seed ── */
const mockChatMessages = [
  { id: 1, user: "FanOfMusic", message: "🔥🔥🔥 this is amazing!", time: "2m ago", gift: null as StreamGift | null },
  { id: 2, user: "ArtLover23", message: "So talented!", time: "1m ago", gift: null },
  { id: 3, user: "VibeChaser", message: "Can you play that again?", time: "45s ago", gift: null },
  { id: 4, user: "CreativeKing", message: "Wow the detail is incredible", time: "30s ago", gift: null },
  { id: 5, user: "NightOwl", message: "First time here, love it!", time: "20s ago", gift: null },
  { id: 6, user: "TopFan99", message: "❤️❤️❤️", time: "10s ago", gift: null },
];

/* ── floating gift animation ── */
interface FloatingGift {
  id: number;
  gift: StreamGift;
  user: string;
  x: number;
}

const GiftAnimation = ({ fg, onDone }: { fg: FloatingGift; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const isBig = fg.gift.coins >= 199;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.5 }}
      animate={{ opacity: 1, y: isBig ? -120 : -80, scale: isBig ? 1.6 : 1 }}
      exit={{ opacity: 0, y: -200, scale: 0.3 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      className="absolute bottom-24 pointer-events-none z-30"
      style={{ left: `${fg.x}%` }}
    >
      <div className="flex flex-col items-center">
        <span className={`${isBig ? "text-5xl" : "text-3xl"} drop-shadow-lg`}>{fg.gift.emoji}</span>
        <span className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 mt-1 whitespace-nowrap">
          {fg.user} sent {fg.gift.name}
        </span>
      </div>
    </motion.div>
  );
};

/* ── Gift panel (bottom sheet style) ── */
const GiftPanel = ({
  open,
  onClose,
  onSend,
  coinBalance,
  onBuyCoins,
}: {
  open: boolean;
  onClose: () => void;
  onSend: (gift: StreamGift) => void;
  coinBalance: number;
  onBuyCoins: () => void;
}) => {
  const [selected, setSelected] = useState<StreamGift | null>(null);

  if (!open) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl rounded-t-3xl border-t border-border"
    >
      {/* Handle + header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">Send Gift</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBuyCoins} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
            <Coins size={14} />
            {coinBalance.toLocaleString()}
            <ChevronUp size={12} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Gift grid */}
      <div className="grid grid-cols-5 gap-1 px-3 pb-2 max-h-[220px] overflow-y-auto">
        {streamGifts.map((g) => {
          const isSelected = selected?.id === g.id;
          const canAfford = coinBalance >= g.coins;
          return (
            <button
              key={g.id}
              onClick={() => setSelected(g)}
              disabled={!canAfford}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-2xl transition-all duration-150 ${
                isSelected
                  ? "bg-primary/15 ring-2 ring-primary scale-105"
                  : canAfford
                    ? "hover:bg-secondary"
                    : "opacity-35 cursor-not-allowed"
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <span className="text-[10px] font-medium text-foreground truncate">{g.name}</span>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Coins size={9} className="text-primary" />
                {g.coins}
              </span>
            </button>
          );
        })}
      </div>

      {/* Send button */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => {
            if (selected) {
              onSend(selected);
              setSelected(null);
            }
          }}
          disabled={!selected}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-all"
        >
          {selected ? `Send ${selected.emoji} ${selected.name} · ${selected.coins} coins` : "Select a gift"}
        </button>
      </div>
    </motion.div>
  );
};

/* ── Buy Coins modal ── */
const BuyCoinsModal = ({
  open,
  onClose,
  onBuy,
}: {
  open: boolean;
  onClose: () => void;
  onBuy: (coins: number) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-4 bg-card rounded-3xl border border-border shadow-lift overflow-hidden"
      >
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-foreground">Get Coins</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <X size={18} className="text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Buy coins to send gifts to your favourite creators</p>
        </div>

        <div className="px-4 pb-5 space-y-2">
          {coinPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => {
                onBuy(pkg.coins);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all hover:shadow-card ${
                pkg.popular
                  ? "border-primary bg-primary/5 hover:bg-primary/10"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Coins size={20} className="text-primary" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{pkg.coins.toLocaleString()} coins</span>
                    {pkg.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase">Popular</span>
                    )}
                  </div>
                  {pkg.bonus && <span className="text-[11px] text-primary font-medium">{pkg.bonus}</span>}
                </div>
              </div>
              <span className="font-bold text-foreground text-sm">{pkg.price}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

/* ── Top gifters bar ── */
const topGifters = [
  { name: "TopFan99", coins: 5200, avatar: "🏆" },
  { name: "NightOwl", coins: 2800, avatar: "🥈" },
  { name: "VibeChaser", coins: 1400, avatar: "🥉" },
];

/* ── Main component ── */
const LiveStream = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(mockChatMessages);
  const [viewerCount] = useState(() => Math.floor(Math.random() * 800) + 200);
  const [coinBalance, setCoinBalance] = useState(350);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [showBuyCoins, setShowBuyCoins] = useState(false);
  const [floatingGifts, setFloatingGifts] = useState<FloatingGift[]>([]);
  const [totalGiftsValue, setTotalGiftsValue] = useState(4230);
  const [isPrivate, setIsPrivate] = useState(false);
  const [privateUnlocked, setPrivateUnlocked] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const creator = creators.find((c) => c.handle.replace("@", "") === handle);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const removeFloatingGift = useCallback((id: number) => {
    setFloatingGifts((prev) => prev.filter((g) => g.id !== id));
  }, []);

  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Stream not found</p>
      </div>
    );
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", message: chatInput, time: "now", gift: null },
    ]);
    setChatInput("");
  };

  const handleSendGift = (gift: StreamGift) => {
    if (coinBalance < gift.coins) return;

    setCoinBalance((prev) => prev - gift.coins);
    setTotalGiftsValue((prev) => prev + gift.coins);

    // Add to chat
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        message: `sent ${gift.emoji} ${gift.name}`,
        time: "now",
        gift,
      },
    ]);

    // Add floating animation
    const floatId = Date.now() + Math.random();
    setFloatingGifts((prev) => [
      ...prev,
      { id: floatId, gift, user: "You", x: 10 + Math.random() * 60 },
    ]);

    setShowGiftPanel(false);
  };

  const handleBuyCoins = (coins: number) => {
    setCoinBalance((prev) => prev + coins);
  };

  const showPrivateWall = isPrivate && !privateUnlocked;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black">
      {/* Video area */}
      <div className="flex-1 relative flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          <img
            src={creator.cover}
            alt={`${creator.name} live stream`}
            className={`w-full h-full object-cover ${showPrivateWall ? "blur-xl scale-110" : ""} transition-all duration-500`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

          {/* Private stream paywall overlay */}
          {showPrivateWall && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center px-6 max-w-sm"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-primary" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Private Stream</h3>
                <p className="text-white/70 text-sm mb-1">This is an exclusive private stream by {creator.name}</p>
                <p className="text-yellow-400 text-lg font-bold mb-5 flex items-center justify-center gap-1.5">
                  <Coins size={18} />
                  200 coins to unlock
                </p>
                <button
                  onClick={() => {
                    if (coinBalance >= 200) {
                      setCoinBalance(prev => prev - 200);
                      setPrivateUnlocked(true);
                    } else {
                      setShowBuyCoins(true);
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg mb-3"
                >
                  {coinBalance >= 200 ? "Unlock Stream · 200 coins" : "Buy Coins to Unlock"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="text-white/50 text-sm hover:text-white/80 transition-colors"
                >
                  Go back
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Floating gift animations */}
          <AnimatePresence>
            {floatingGifts.map((fg) => (
              <GiftAnimation key={fg.id} fg={fg} onDone={() => removeFloatingGift(fg.id)} />
            ))}
          </AnimatePresence>

          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                <img src={creator.avatar} alt={creator.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-white text-sm font-semibold">{creator.name}</span>
                {creator.verified && <BadgeCheck size={14} className="text-primary" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Public / Private toggle */}
              <button
                onClick={() => {
                  setIsPrivate(!isPrivate);
                  if (!isPrivate) setPrivateUnlocked(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isPrivate
                    ? "bg-yellow-500/20 backdrop-blur-sm text-yellow-300 border border-yellow-500/30"
                    : "bg-black/50 backdrop-blur-sm text-white/80 hover:text-white"
                }`}
              >
                {isPrivate ? <Lock size={12} /> : <Eye size={12} />}
                {isPrivate ? "Private" : "Public"}
              </button>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                <Radio size={12} className="animate-pulse" />
                LIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                <Users size={12} />
                {viewerCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 backdrop-blur-sm text-yellow-300 text-xs font-bold">
                <Coins size={12} />
                {totalGiftsValue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Top gifters strip */}
          <div className="absolute top-16 right-4 flex flex-col gap-1.5">
            {topGifters.map((g, i) => (
              <div key={g.name} className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                <span className="text-xs">{g.avatar}</span>
                <span className="text-white text-[11px] font-medium">{g.name}</span>
                <span className="text-yellow-300 text-[10px] font-bold flex items-center gap-0.5">
                  <Coins size={9} />{g.coins.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  liked ? "bg-accent text-accent-foreground" : "bg-black/50 backdrop-blur-sm text-white"
                }`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </motion.button>

              {/* Gift button - primary CTA */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowGiftPanel(!showGiftPanel)}
                className="h-10 px-4 rounded-full bg-primary text-primary-foreground flex items-center gap-2 font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                <span className="text-lg">🎁</span>
                Gift
              </motion.button>

              {/* Coin balance */}
              <button
                onClick={() => setShowBuyCoins(true)}
                className="h-10 px-3 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1.5 text-xs font-semibold hover:bg-black/70 transition-colors"
              >
                <Coins size={14} className="text-yellow-400" />
                {coinBalance.toLocaleString()}
              </button>

              <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <Maximize size={18} />
              </button>
            </div>
          </div>

          {/* Gift panel overlay */}
          <AnimatePresence>
            {showGiftPanel && (
              <GiftPanel
                open={showGiftPanel}
                onClose={() => setShowGiftPanel(false)}
                onSend={handleSendGift}
                coinBalance={coinBalance}
                onBuyCoins={() => {
                  setShowGiftPanel(false);
                  setShowBuyCoins(true);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Stream title (mobile) */}
        <div className="lg:hidden bg-card px-4 py-3 border-t border-border">
          <h2 className="text-foreground font-bold text-sm">{creator.name} is live!</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{creator.category} · {creator.tagline}</p>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="w-full lg:w-[360px] h-[45vh] lg:h-full flex flex-col bg-card border-l border-border">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-bold text-foreground text-sm">Live Chat</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary">
              <Trophy size={11} className="text-yellow-500" />
              <span className="text-[10px] text-muted-foreground font-medium">Top gifters</span>
            </div>
            <span className="text-xs text-muted-foreground">{viewerCount}</span>
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-2 ${msg.gift ? "py-1.5 px-2.5 rounded-xl bg-primary/5 border border-primary/10" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold ${msg.user === "You" ? "text-primary" : "text-foreground"}`}>
                  {msg.user}
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">{msg.time}</span>
                {msg.gift ? (
                  <p className="text-sm mt-0.5">
                    <span className="text-primary font-medium">{msg.message}</span>
                    <span className="text-muted-foreground text-[10px] ml-1.5">· {msg.gift.coins} coins</span>
                  </p>
                ) : (
                  <p className="text-sm text-foreground/90 mt-0.5">{msg.message}</p>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Say something…"
              className="flex-1 h-9 rounded-xl bg-secondary border-0 text-sm"
            />
            <button
              onClick={() => setShowGiftPanel(true)}
              className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <span className="text-base">🎁</span>
            </button>
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Buy Coins modal */}
      <AnimatePresence>
        {showBuyCoins && (
          <BuyCoinsModal
            open={showBuyCoins}
            onClose={() => setShowBuyCoins(false)}
            onBuy={handleBuyCoins}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveStream;
