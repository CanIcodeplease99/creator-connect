import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, Star, MessageCircle, Sparkles, MapPin, BadgeCheck, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creators, type Creator } from "@/data/mockData";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";

/* ── Mock dating profiles ── */
const datingProfiles = [
  ...creators.map((c, i) => ({
    ...c,
    age: 22 + i * 2,
    distance: `${Math.floor(Math.random() * 20 + 1)} km away`,
    bio: c.tagline,
    interests: [c.category, "Music", "Travel", "Photography", "Food"].slice(0, 3 + (i % 2)),
    photos: [c.avatar, c.cover],
  })),
];

/* ── Swipe Card ── */
const SWIPE_THRESHOLD = 120;

const SwipeCard = ({
  profile,
  onSwipe,
  isTop,
}: {
  profile: (typeof datingProfiles)[0];
  onSwipe: (dir: "left" | "right" | "super") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, zIndex: isTop ? 10 : 1 }}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7, y: isTop ? 0 : 12 }}
      exit={{
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lift bg-card border border-border">
        {/* Photo */}
        <img
          src={profile.cover}
          alt={profile.name}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* LIKE stamp */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-6 px-4 py-2 rounded-xl border-4 border-emerald-400 text-emerald-400 font-black text-3xl uppercase rotate-[-15deg]"
        >
          LIKE
        </motion.div>

        {/* NOPE stamp */}
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-6 px-4 py-2 rounded-xl border-4 border-red-400 text-red-400 font-black text-3xl uppercase rotate-[15deg]"
        >
          NOPE
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end gap-3 mb-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-14 h-14 rounded-full border-[3px] border-white object-cover"
              draggable={false}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-xl">{profile.name}</h2>
                <span className="text-white/80 font-medium text-lg">{profile.age}</span>
                {profile.verified && <BadgeCheck size={18} className="text-primary" />}
              </div>
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin size={13} />
                {profile.distance}
              </div>
            </div>
          </div>

          <p className="text-white/80 text-sm mb-3 line-clamp-2">{profile.bio}</p>

          {/* Interest tags */}
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Match popup ── */
const MatchPopup = ({ profile, onClose }: { profile: (typeof datingProfiles)[0]; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
      onClick={(e) => e.stopPropagation()}
      className="text-center px-8"
    >
      {/* Sparkle burst */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: [1, 0],
            scale: [0, 1],
            x: Math.cos((i * 30 * Math.PI) / 180) * 120,
            y: Math.sin((i * 30 * Math.PI) / 180) * 120,
          }}
          transition={{ duration: 1, delay: 0.1 }}
          className="absolute text-2xl"
        >
          ✨
        </motion.span>
      ))}

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Sparkles size={48} className="text-primary mx-auto mb-4" />
      </motion.div>

      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-accent mb-2">
        It's a Match!
      </h2>
      <p className="text-white/70 text-sm mb-6">You and {profile.name} liked each other</p>

      <div className="flex items-center justify-center gap-4 mb-8">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" className="w-20 h-20 rounded-full border-[3px] border-primary" alt="You" />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <Heart size={32} className="text-accent" fill="currentColor" />
        </motion.div>
        <img src={profile.avatar} className="w-20 h-20 rounded-full border-[3px] border-primary object-cover" alt={profile.name} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
        >
          Keep Swiping
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Send Message
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Main Dating Page ── */
const Dating = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [matchPopup, setMatchPopup] = useState<(typeof datingProfiles)[0] | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | "super" | null>(null);

  const currentProfile = datingProfiles[currentIdx % datingProfiles.length];
  const nextProfile = datingProfiles[(currentIdx + 1) % datingProfiles.length];

  const handleSwipe = useCallback(
    (dir: "left" | "right" | "super") => {
      setSwipeAnim(dir);

      // Random match on right swipe (30% chance)
      if ((dir === "right" || dir === "super") && Math.random() < 0.3) {
        setTimeout(() => setMatchPopup(currentProfile), 400);
      }

      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
        setSwipeAnim(null);
      }, 300);
    },
    [currentProfile]
  );

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Dating" />

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20 lg:pb-6">
          {/* Card stack */}
          <div className="relative w-full max-w-[380px] h-[520px] sm:h-[580px]">
            <AnimatePresence>
              {/* Next card (behind) */}
              <SwipeCard
                key={`next-${(currentIdx + 1) % datingProfiles.length}`}
                profile={nextProfile}
                onSwipe={() => {}}
                isTop={false}
              />
              {/* Top card */}
              {!swipeAnim && (
                <SwipeCard
                  key={`top-${currentIdx % datingProfiles.length}`}
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                  isTop
                />
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4 mt-6">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSwipe("left")}
              className="w-14 h-14 rounded-full bg-card border-2 border-red-400/30 flex items-center justify-center shadow-card hover:shadow-lift hover:border-red-400 transition-all"
            >
              <X size={28} className="text-red-400" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSwipe("super")}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
            >
              <Star size={22} className="text-white" fill="white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => handleSwipe("right")}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
            >
              <Heart size={28} className="text-white" fill="white" />
            </motion.button>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && <MatchPopup profile={matchPopup} onClose={() => setMatchPopup(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dating;
