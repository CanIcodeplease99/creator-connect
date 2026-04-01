import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Crown, Radio, Users, BadgeCheck, Shield, AlertTriangle,
  Play, Eye, ToggleLeft, ToggleRight, UserCheck, Camera, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creators, type Creator } from "@/data/mockData";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";

/* ── mock lounge preview videos (short loops) ── */
const PREVIEW_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
];

const premiumStreams = creators.map((c, i) => ({
  ...c,
  viewers: Math.floor(Math.random() * 300 + 50),
  isLive: i < 4,
  rating: "18+" as const,
  category: ["Exclusive", "VIP", "Premium", "Private", "Diamond", "Platinum"][i % 6],
  previewVideo: PREVIEW_VIDEOS[i % PREVIEW_VIDEOS.length],
}));

/* ── Looping video preview ── */
const LoopPreview = ({ src, blur }: { src: string; blur: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // cap at ~8 seconds loop
    const handler = () => {
      if (v.currentTime >= 8) v.currentTime = 0;
    };
    v.addEventListener("timeupdate", handler);
    return () => v.removeEventListener("timeupdate", handler);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      muted
      autoPlay
      loop
      playsInline
      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${blur ? "blur-md brightness-75" : ""}`}
    />
  );
};

/* ── Age gate ── */
const AgeGate = ({ onConfirm }: { onConfirm: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
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
      <p className="text-white/40 text-xs mb-2">
        By entering, you confirm you are at least 18 years old and agree to our terms.
      </p>
      <div className="flex items-center gap-2 justify-center text-yellow-400 text-xs mb-6">
        <AlertTriangle size={14} />
        <span>Premium subscription required for full access</span>
      </div>

      {/* ID verification hint */}
      <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 text-left">
        <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-1">
          <UserCheck size={14} />
          Identity Verification
        </div>
        <p className="text-white/50 text-[11px]">
          For your safety, Lounge creators must complete ID verification. Users may be asked to verify age via photo ID.
        </p>
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

/* ── Creator/User mode toggle ── */
const ModeToggle = ({
  isCreatorMode,
  onToggle,
  hasLoungeAccess,
  onToggleAccess,
}: {
  isCreatorMode: boolean;
  onToggle: () => void;
  hasLoungeAccess: boolean;
  onToggleAccess: () => void;
}) => (
  <div className="mb-6 space-y-3">
    {/* Creator mode */}
    <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <Camera size={16} className="text-white" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-sm">Creator Mode</p>
          <p className="text-muted-foreground text-[11px]">Post Lounge content (separate from regular)</p>
        </div>
      </div>
      <button onClick={onToggle} className="text-primary">
        {isCreatorMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
      </button>
    </div>

    {/* Lounge access toggle for regular users */}
    <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Eye size={16} className="text-white" />
        </div>
        <div>
          <p className="text-foreground font-semibold text-sm">Lounge in Feed</p>
          <p className="text-muted-foreground text-[11px]">Show Lounge content in your home feed</p>
        </div>
      </div>
      <button onClick={onToggleAccess} className="text-primary">
        {hasLoungeAccess ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-muted-foreground" />}
      </button>
    </div>
  </div>
);

/* ── Premium stream card with video loop ── */
const PremiumCard = ({
  stream,
  isPremiumUser,
}: {
  stream: (typeof premiumStreams)[0];
  isPremiumUser: boolean;
}) => {
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => {
          if (isPremiumUser) navigate(`/live/${stream.handle.replace("@", "")}`);
          else setShowPaywall(true);
        }}
        className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-lift cursor-pointer transition-all duration-300"
      >
        {/* Cover / Video loop */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          {stream.isLive && (isHovered || window.innerWidth < 640) ? (
            <LoopPreview src={stream.previewVideo} blur={!isPremiumUser} />
          ) : (
            <img
              src={stream.cover}
              alt={stream.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isPremiumUser ? "blur-md" : ""}`}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Play indicator for loop */}
          {stream.isLive && (
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium">
                <Play size={10} fill="white" />
                Preview
              </span>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full bg-accent/90 text-accent-foreground text-[10px] font-bold">{stream.rating}</span>
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
              <Crown size={10} />{stream.category}
            </span>
          </div>

          {/* Lock overlay */}
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
                <Users size={11} />{stream.viewers}
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
            {/* Verified lounge creator badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-card">
              <UserCheck size={10} className="text-white" />
            </div>
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
  const [isPremiumUser] = useState(false);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [hasLoungeAccess, setHasLoungeAccess] = useState(false);

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
              <p className="text-muted-foreground text-xs">Premium exclusive content • ID verified creators</p>
            </div>
          </div>

          {/* Mode toggles */}
          <ModeToggle
            isCreatorMode={isCreatorMode}
            onToggle={() => setIsCreatorMode(!isCreatorMode)}
            hasLoungeAccess={hasLoungeAccess}
            onToggleAccess={() => setHasLoungeAccess(!hasLoungeAccess)}
          />

          {/* Creator mode panel */}
          <AnimatePresence>
            {isCreatorMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles size={18} className="text-yellow-500" />
                    <h3 className="text-foreground font-bold text-sm">Creator Lounge Dashboard</h3>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">
                    Lounge content is completely separate from your regular profile. Go live, post exclusive content, and earn premium revenue.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold hover:opacity-90 transition-all">
                      <Radio size={14} />
                      Go Live (Lounge)
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-medium hover:bg-secondary transition-colors">
                      <Camera size={14} />
                      Post Content
                    </button>
                  </div>
                  <div className="mt-3 p-2 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <UserCheck size={12} className="text-emerald-500" />
                      <span>ID Verification: <span className="text-emerald-500 font-semibold">Verified</span></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lounge access info */}
          {hasLoungeAccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2"
            >
              <Eye size={14} className="text-purple-400" />
              <p className="text-foreground text-xs">Lounge content will appear in your home feed tab</p>
            </motion.div>
          )}

          {/* Live now section */}
          <div className="flex items-center gap-2 mb-3">
            <Radio size={14} className="text-accent animate-pulse" />
            <h2 className="font-bold text-foreground text-sm">Live Now</h2>
            <span className="text-muted-foreground text-xs">
              ({premiumStreams.filter((s) => s.isLive).length} streams)
            </span>
            <span className="ml-auto text-muted-foreground text-[10px]">Hover for preview</span>
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
