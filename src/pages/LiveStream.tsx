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

/* ── Particle burst helper ── */
const Particle = ({ delay, x, y, emoji, size }: { delay: number; x: number; y: number; emoji: string; size: number }) => (
  <motion.span
    initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
    animate={{
      opacity: [1, 1, 0],
      x: x,
      y: y,
      scale: [0, 1.2, 0.6],
      rotate: [0, Math.random() * 360],
    }}
    transition={{ duration: 1.8 + Math.random() * 0.8, delay, ease: "easeOut" }}
    className="absolute pointer-events-none"
    style={{ fontSize: size }}
  >
    {emoji}
  </motion.span>
);

/* ── Full-screen gift animation (TikTok/Snapchat style) ── */
const GiftAnimation = ({ fg, onDone }: { fg: FloatingGift; onDone: () => void }) => {
  const tier = fg.gift.coins >= 1000 ? "legendary" : fg.gift.coins >= 199 ? "epic" : fg.gift.coins >= 50 ? "rare" : "common";

  useEffect(() => {
    const duration = tier === "legendary" ? 5000 : tier === "epic" ? 4000 : tier === "rare" ? 3200 : 2500;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, tier]);

  // Generate particle positions
  const particles = Array.from({ length: tier === "legendary" ? 24 : tier === "epic" ? 16 : tier === "rare" ? 10 : 5 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * (tier === "legendary" ? 600 : 400),
    y: (Math.random() - 0.5) * (tier === "legendary" ? 500 : 300) - 100,
    delay: Math.random() * 0.4,
    size: tier === "legendary" ? 28 + Math.random() * 20 : 18 + Math.random() * 14,
  }));

  // Streaking emojis that fly across screen
  const streamers = tier === "legendary" || tier === "epic" ? Array.from({ length: tier === "legendary" ? 8 : 4 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: 100 + Math.random() * 20,
    delay: i * 0.15,
  })) : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      {/* Full-screen colour wash for legendary/epic */}
      {(tier === "legendary" || tier === "epic") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0.15, 0] }}
          transition={{ duration: tier === "legendary" ? 4 : 3, ease: "easeOut" }}
          className={`absolute inset-0 ${
            tier === "legendary"
              ? "bg-gradient-to-t from-yellow-500/40 via-orange-500/20 to-transparent"
              : "bg-gradient-to-t from-purple-500/30 via-pink-500/10 to-transparent"
          }`}
        />
      )}

      {/* Screen-edge glow pulse for rare+ */}
      {tier !== "common" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            boxShadow: tier === "legendary"
              ? "inset 0 0 120px 40px rgba(234,179,8,0.3)"
              : tier === "epic"
              ? "inset 0 0 80px 30px rgba(168,85,247,0.25)"
              : "inset 0 0 60px 20px rgba(59,130,246,0.2)",
          }}
        />
      )}

      {/* Streaking emojis flying upward across screen */}
      {streamers.map((s) => (
        <motion.span
          key={`stream-${s.id}`}
          initial={{ x: `${s.startX}%`, y: "110%", opacity: 0.9, scale: 0.8 }}
          animate={{ y: "-20%", opacity: [0.9, 0.9, 0], scale: [0.8, 1.2, 0.5], rotate: [0, -15 + Math.random() * 30] }}
          transition={{ duration: 1.6 + Math.random() * 0.6, delay: s.delay, ease: "easeOut" }}
          className="absolute text-3xl pointer-events-none"
        >
          {fg.gift.emoji}
        </motion.span>
      ))}

      {/* Centre-stage gift reveal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Shockwave ring for rare+ */}
        {tier !== "common" && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 3, 5], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`absolute w-24 h-24 rounded-full border-2 ${
              tier === "legendary" ? "border-yellow-400" : tier === "epic" ? "border-purple-400" : "border-blue-400"
            }`}
          />
        )}

        {/* Main emoji with dramatic entrance */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{
            scale: tier === "legendary" ? [0, 2.5, 1.8] : tier === "epic" ? [0, 2, 1.5] : tier === "rare" ? [0, 1.6, 1.2] : [0, 1.3, 1],
            rotate: [tier === "legendary" ? -30 : -15, 8, 0],
          }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          {/* Glow behind emoji */}
          {tier !== "common" && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: 2, ease: "easeInOut" }}
              className={`absolute inset-0 blur-2xl rounded-full -m-8 ${
                tier === "legendary" ? "bg-yellow-400/50" : tier === "epic" ? "bg-purple-400/40" : "bg-blue-400/30"
              }`}
            />
          )}
          <span
            className="relative drop-shadow-2xl"
            style={{
              fontSize: tier === "legendary" ? 96 : tier === "epic" ? 80 : tier === "rare" ? 64 : 48,
              filter: tier === "legendary" ? "drop-shadow(0 0 30px rgba(234,179,8,0.6))" : undefined,
            }}
          >
            {fg.gift.emoji}
          </span>
        </motion.div>

        {/* Particle burst from centre */}
        {particles.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} emoji={fg.gift.emoji} size={p.size} />
        ))}
      </div>

      {/* Gift info banner - slides in from left (TikTok style) */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-32 left-4 sm:left-8"
      >
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border ${
          tier === "legendary"
            ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/20 border-yellow-500/40"
            : tier === "epic"
            ? "bg-gradient-to-r from-purple-500/30 to-pink-500/20 border-purple-500/40"
            : tier === "rare"
            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border-blue-500/30"
            : "bg-black/40 border-white/10"
        }`}>
          <span className="text-3xl">{fg.gift.emoji}</span>
          <div>
            <p className="text-white font-bold text-sm">
              {fg.user}
              <span className="font-normal text-white/70"> sent </span>
              {fg.gift.name}
            </p>
            <p className={`text-xs font-semibold ${
              tier === "legendary" ? "text-yellow-300" : tier === "epic" ? "text-purple-300" : tier === "rare" ? "text-blue-300" : "text-white/60"
            }`}>
              {fg.gift.coins.toLocaleString()} coins
              {tier === "legendary" && " 🔥🔥🔥"}
              {tier === "epic" && " 🔥🔥"}
              {tier === "rare" && " 🔥"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Legendary/epic: raining emojis from top */}
      {tier === "legendary" && Array.from({ length: 20 }, (_, i) => (
        <motion.span
          key={`rain-${i}`}
          initial={{ x: `${5 + Math.random() * 90}%`, y: "-5%", opacity: 0.8 }}
          animate={{ y: "110%", opacity: [0.8, 0.6, 0], rotate: Math.random() * 180 }}
          transition={{ duration: 2.5 + Math.random() * 1.5, delay: 0.8 + i * 0.12, ease: "easeIn" }}
          className="absolute text-xl pointer-events-none"
        >
          {fg.gift.emoji}
        </motion.span>
      ))}
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
