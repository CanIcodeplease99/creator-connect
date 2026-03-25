import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Crown, Radio, Users, BadgeCheck, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creators, type Creator } from "@/data/mockData";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";

/* ── mock premium live streams ── */
const premiumStreams = creators.map((c, i) => ({
  ...c,
  viewers: Math.floor(Math.random() * 300 + 50),
  isLive: i < 4,
  rating: "18+",
  category: ["Exclusive", "VIP", "Premium", "Private", "Diamond", "Platinum"][i % 6],
}));

/* ── Age gate ── */
const AgeGate = ({ onConfirm }: { onConfirm: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="max-w-md mx-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-5">
        <Shield size={36} className="text-accent" />
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">Age Verification Required</h2>
      <p className="text-white/60 text-sm mb-2">
        This section contains content intended for adults only (18+).
      </p>
      <div className="flex items-center gap-2 justify-center text-yellow-400 text-xs mb-6">
        <AlertTriangle size={14} />
        <span>Premium subscription required for full access</span>
      </div>
      <button
        onClick={onConfirm}
        className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-all mb-3"
      >
        I am 18 or older — Enter
      </button>
      <a href="/home" className="text-white/40 text-sm hover:text-white/60 transition-colors">
        Take me back
      </a>
    </motion.div>
  </motion.div>
);

/* ── Premium stream card ── */
const PremiumCard = ({ stream, isPremiumUser }: { stream: (typeof premiumStreams)[0]; isPremiumUser: boolean }) => {
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        onClick={() => {
          if (isPremiumUser) {
            navigate(`/live/${stream.handle.replace("@", "")}`);
          } else {
            setShowPaywall(true);
          }
        }}
        className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-lift cursor-pointer transition-all duration-300"
      >
        {/* Cover */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={stream.cover}
            alt={stream.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isPremiumUser ? "blur-md" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full bg-accent/90 text-accent-foreground text-[10px] font-bold">
              {stream.rating}
            </span>
          </div>

          {/* Live / Category */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {stream.isLive && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground animate-pulse" />
                Live
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 backdrop-blur-sm text-yellow-300 text-[11px] font-bold flex items-center gap-1">
              <Crown size={10} />
              {stream.category}
            </span>
          </div>

          {/* Lock overlay if not premium */}
          {!isPremiumUser && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center">
                <Lock size={28} className="text-white/80 mx-auto mb-1" />
                <p className="text-white/70 text-xs font-medium">Premium Only</p>
              </div>
            </div>
          )}

          {/* Viewer count */}
          {stream.isLive && (
            <div className="absolute bottom-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium">
                <Users size={11} />
                {stream.viewers}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative px-4 pb-4 pt-0">
          <div className="absolute -top-7 left-4">
            <img
              src={stream.avatar}
              alt={stream.name}
              className="w-14 h-14 rounded-full border-[3px] border-card bg-muted object-cover ring-2 ring-yellow-500/50 ring-offset-1 ring-offset-card"
            />
          </div>
          <div className="pt-9">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-foreground text-sm truncate">{stream.name}</h3>
              {stream.verified && <BadgeCheck size={14} className="text-primary shrink-0" />}
              <Crown size={12} className="text-yellow-500 shrink-0" />
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">{stream.handle}</p>
            <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{stream.tagline}</p>
          </div>
        </div>
      </motion.div>

      {/* Paywall popup */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm mx-4 bg-card rounded-3xl border border-border p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Crown size={28} className="text-white" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-1">Premium Access Required</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Upgrade to KEETH Premium to unlock exclusive content from {stream.name}
              </p>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg mb-2"
              >
                Upgrade to Premium — R299/mo
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ── Main Lounge Page ── */
const Lounge = () => {
  const [ageVerified, setAgeVerified] = useState(false);
  const [isPremiumUser] = useState(false); // mock: not premium by default

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Lounge" />

        <main className="flex-1 w-full max-w-[1100px] mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 lg:pb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-red-500 flex items-center justify-center">
              <Crown size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-foreground font-bold text-lg flex items-center gap-2">
                The Lounge
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold">18+</span>
              </h1>
              <p className="text-muted-foreground text-xs">Premium exclusive content</p>
            </div>
          </div>

          {/* Live now section */}
          <div className="flex items-center gap-2 mb-3">
            <Radio size={14} className="text-accent animate-pulse" />
            <h2 className="font-bold text-foreground text-sm">Live Now</h2>
            <span className="text-muted-foreground text-xs">
              ({premiumStreams.filter((s) => s.isLive).length} streams)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {premiumStreams
              .filter((s) => s.isLive)
              .map((stream) => (
                <PremiumCard key={stream.id} stream={stream} isPremiumUser={isPremiumUser} />
              ))}
          </div>

          {/* All creators */}
          <h2 className="font-bold text-foreground text-sm mb-3">All Premium Creators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumStreams
              .filter((s) => !s.isLive)
              .map((stream) => (
                <PremiumCard key={stream.id} stream={stream} isPremiumUser={isPremiumUser} />
              ))}
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Age gate */}
      <AnimatePresence>
        {!ageVerified && <AgeGate onConfirm={() => setAgeVerified(true)} />}
      </AnimatePresence>
    </div>
  );
};

export default Lounge;
