import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Heart, X, Star, MessageCircle, Sparkles, MapPin, BadgeCheck,
  Flame, Users, Send, ImageIcon, Smile, ArrowLeft, SlidersHorizontal,
  Zap, Crown, Eye, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { creators, type Creator } from "@/data/mockData";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";

/* ═══════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════ */

type DatingProfile = Creator & {
  age: number;
  distance: string;
  bio: string;
  interests: string[];
  photos: string[];
};

const datingProfiles: DatingProfile[] = creators.map((c, i) => ({
  ...c,
  age: 22 + i * 2,
  distance: `${Math.floor(Math.random() * 20 + 1)} km away`,
  bio: c.tagline,
  interests: [c.category, "Music", "Travel", "Photography", "Food", "Art", "Fitness"].slice(0, 3 + (i % 3)),
  photos: [c.avatar, c.cover],
}));

interface DatingMatch {
  id: string;
  profile: DatingProfile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread: number;
  isOnline: boolean;
}

interface DatingMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

const mockMatches: DatingMatch[] = [
  {
    id: "dm1", profile: datingProfiles[0], matchedAt: "2h ago",
    lastMessage: "Hey! I love your music 🎵", lastMessageTime: "5m ago", unread: 2, isOnline: true,
  },
  {
    id: "dm2", profile: datingProfiles[2], matchedAt: "1d ago",
    lastMessage: "That painting is incredible!", lastMessageTime: "1h ago", unread: 0, isOnline: true,
  },
  {
    id: "dm3", profile: datingProfiles[4], matchedAt: "2d ago",
    lastMessage: "We should collab sometime 🔥", lastMessageTime: "3h ago", unread: 1, isOnline: false,
  },
  {
    id: "dm4", profile: datingProfiles[1], matchedAt: "3d ago",
    lastMessage: undefined, lastMessageTime: undefined, unread: 0, isOnline: false,
  },
  {
    id: "dm5", profile: datingProfiles[5], matchedAt: "5d ago",
    lastMessage: "What studio do you use?", lastMessageTime: "1d ago", unread: 0, isOnline: true,
  },
];

const mockDatingMessages: Record<string, DatingMessage[]> = {
  dm1: [
    { id: "1", senderId: "them", text: "Hey! Saw your profile, you have great taste in music 🎵", timestamp: "2h ago" },
    { id: "2", senderId: "user", text: "Thanks! I love your work too. What's your fav genre?", timestamp: "1h ago" },
    { id: "3", senderId: "them", text: "Afrobeats and R&B mostly, but I'm open to everything", timestamp: "45m ago" },
    { id: "4", senderId: "them", text: "Hey! I love your music 🎵", timestamp: "5m ago" },
  ],
  dm2: [
    { id: "1", senderId: "user", text: "Your art is absolutely stunning!", timestamp: "1d ago" },
    { id: "2", senderId: "them", text: "Thank you so much! 🎨 I'd love to paint you sometime", timestamp: "1d ago" },
    { id: "3", senderId: "user", text: "That painting is incredible!", timestamp: "1h ago" },
  ],
  dm3: [
    { id: "1", senderId: "them", text: "Love your style!", timestamp: "2d ago" },
    { id: "2", senderId: "user", text: "Thanks! You too 😍", timestamp: "2d ago" },
    { id: "3", senderId: "them", text: "We should collab sometime 🔥", timestamp: "3h ago" },
  ],
  dm5: [
    { id: "1", senderId: "them", text: "Yo! Your beats are fire 🔥", timestamp: "2d ago" },
    { id: "2", senderId: "user", text: "Appreciate that! Wanna link up?", timestamp: "2d ago" },
    { id: "3", senderId: "user", text: "What studio do you use?", timestamp: "1d ago" },
  ],
};

/* ═══════════════════════════════════════════════
   SWIPE CARD
   ═══════════════════════════════════════════════ */
const SWIPE_THRESHOLD = 120;

const SwipeCard = ({
  profile,
  onSwipe,
  isTop,
}: {
  profile: DatingProfile;
  onSwipe: (dir: "left" | "right" | "super") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
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
      exit={{ x: 500, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lift bg-card border border-border">
        <img src={profile.cover} alt={profile.name} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* LIKE stamp */}
        <motion.div style={{ opacity: likeOpacity }}
          className="absolute top-8 left-6 px-4 py-2 rounded-xl border-4 border-emerald-400 text-emerald-400 font-black text-3xl uppercase -rotate-[15deg]"
        >LIKE</motion.div>

        {/* NOPE stamp */}
        <motion.div style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-6 px-4 py-2 rounded-xl border-4 border-red-400 text-red-400 font-black text-3xl uppercase rotate-[15deg]"
        >NOPE</motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end gap-3 mb-3">
            <img src={profile.avatar} alt={profile.name}
              className="w-14 h-14 rounded-full border-[3px] border-white object-cover" draggable={false} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-xl">{profile.name}</h2>
                <span className="text-white/80 font-medium text-lg">{profile.age}</span>
                {profile.verified && <BadgeCheck size={18} className="text-primary" />}
              </div>
              <div className="flex items-center gap-1.5 text-white/60 text-sm">
                <MapPin size={13} />{profile.distance}
              </div>
            </div>
          </div>
          <p className="text-white/80 text-sm mb-3 line-clamp-2">{profile.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   MATCH POPUP
   ═══════════════════════════════════════════════ */
const MatchPopup = ({
  profile,
  onClose,
  onMessage,
}: {
  profile: DatingProfile;
  onClose: () => void;
  onMessage: () => void;
}) => (
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
      className="text-center px-8 relative"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <motion.span key={i}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: [1, 0], scale: [0, 1], x: Math.cos((i * 30 * Math.PI) / 180) * 120, y: Math.sin((i * 30 * Math.PI) / 180) * 120 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="absolute text-2xl"
        >✨</motion.span>
      ))}
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
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
        <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
          Keep Swiping
        </button>
        <button onClick={onMessage} className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <MessageCircle size={18} />Send Message
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════════
   DATING CHAT VIEW
   ═══════════════════════════════════════════════ */
const DatingChat = ({
  match,
  messages: initialMsgs,
  onBack,
}: {
  match: DatingMatch;
  messages: DatingMessage[];
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState(initialMsgs);
  const [newMsg, setNewMsg] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { id: `m-${Date.now()}`, senderId: "user", text: newMsg.trim(), timestamp: "Just now" }]);
    setNewMsg("");
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 250 }}
      className="absolute inset-0 z-20 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="relative">
          <img src={match.profile.avatar} alt={match.profile.name} className="w-10 h-10 rounded-full object-cover bg-muted" />
          {match.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-foreground">{match.profile.name}</span>
            {match.profile.verified && <BadgeCheck size={14} className="text-primary" />}
            <span className="text-[10px] text-muted-foreground">{match.profile.age}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {match.isOnline ? (
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            ) : `Matched ${match.matchedAt}`}
          </span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-card">
          <Heart size={16} />
        </motion.button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Match header */}
        <div className="text-center py-4">
          <img src={match.profile.avatar} alt={match.profile.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-primary" />
          <p className="text-foreground font-semibold text-sm">{match.profile.name}</p>
          <p className="text-muted-foreground text-xs">You matched {match.matchedAt}</p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {match.profile.interests.slice(0, 3).map(i => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{i}</span>
            ))}
          </div>
        </div>

        {messages.map((msg, i) => {
          const isUser = msg.senderId === "user";
          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
              }`}>
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card px-3 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"><ImageIcon size={20} /></button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"><Smile size={20} /></button>
          <input ref={inputRef} type="text" placeholder="Type a message..."
            value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 py-2.5 px-4 rounded-full bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={handleSend} disabled={!newMsg.trim()}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   MATCHES TAB
   ═══════════════════════════════════════════════ */
const MatchesView = ({ onOpenChat }: { onOpenChat: (match: DatingMatch) => void }) => {
  const newMatches = mockMatches.filter(m => !m.lastMessage);
  const conversations = mockMatches.filter(m => m.lastMessage);

  return (
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
      {/* New matches horizontal strip */}
      {newMatches.length > 0 && (
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            New Matches
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {newMatches.map(m => (
              <motion.button key={m.id} whileTap={{ scale: 0.95 }} onClick={() => onOpenChat(m)}
                className="flex flex-col items-center gap-1.5 min-w-[72px]"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-primary via-pink-500 to-accent">
                    <img src={m.profile.avatar} alt={m.profile.name} className="w-full h-full rounded-full object-cover border-2 border-card" />
                  </div>
                  {m.isOnline && <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />}
                </div>
                <span className="text-foreground text-[11px] font-medium truncate w-16 text-center">{m.profile.name.split(" ")[0]}</span>
              </motion.button>
            ))}

            {/* "Likes you" placeholder */}
            <motion.button whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5 min-w-[72px]"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center relative">
                <Heart size={24} className="text-white" fill="white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <span className="text-foreground text-[11px] font-medium">Likes You</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Conversations */}
      <div className="px-4 pt-3">
        <h3 className="text-foreground font-bold text-sm mb-2 flex items-center gap-2">
          <MessageCircle size={14} className="text-primary" />
          Messages
        </h3>
      </div>

      <div className="divide-y divide-border">
        {conversations.map(m => (
          <motion.button key={m.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenChat(m)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/60 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img src={m.profile.avatar} alt={m.profile.name} className="w-14 h-14 rounded-full object-cover bg-muted" />
              {m.isOnline && <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-card" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-sm truncate ${m.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                    {m.profile.name}
                  </span>
                  {m.profile.verified && <BadgeCheck size={13} className="text-primary flex-shrink-0" />}
                  <span className="text-[10px] text-muted-foreground">{m.profile.age}</span>
                </div>
                <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{m.lastMessageTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs truncate ${m.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {m.lastMessage}
                </p>
                {m.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {m.unread}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
          </motion.button>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-primary" />
          </div>
          <h3 className="text-foreground font-semibold text-base mb-1">No conversations yet</h3>
          <p className="text-muted-foreground text-sm">Start swiping to find your match!</p>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   LIKES TAB
   ═══════════════════════════════════════════════ */
const LikesView = () => {
  const likedProfiles = datingProfiles.slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 lg:pb-6">
      {/* Upgrade banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0">
            <Crown size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-foreground font-bold text-sm">See who likes you</p>
            <p className="text-muted-foreground text-xs">Upgrade to KEETH Gold to see all your admirers</p>
          </div>
          <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold hover:opacity-90 transition-opacity">
            Upgrade
          </button>
        </div>
      </motion.div>

      {/* Blurred likes grid */}
      <div className="grid grid-cols-2 gap-3">
        {likedProfiles.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-card border border-border"
          >
            <img src={p.cover} alt="Liked you" className="w-full h-full object-cover blur-lg scale-110" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-red-400 flex items-center justify-center mx-auto mb-2">
                  <Heart size={22} className="text-white" fill="white" />
                </div>
                <p className="text-white text-xs font-semibold">Liked you</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN DATING PAGE
   ═══════════════════════════════════════════════ */
type DatingTab = "discover" | "matches" | "likes";

const tabConfig: { id: DatingTab; label: string; icon: typeof Flame }[] = [
  { id: "discover", label: "Discover", icon: Flame },
  { id: "matches", label: "Matches", icon: MessageCircle },
  { id: "likes", label: "Likes", icon: Heart },
];

const Dating = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DatingTab>("discover");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [matchPopup, setMatchPopup] = useState<DatingProfile | null>(null);
  const [swipeAnim, setSwipeAnim] = useState<"left" | "right" | "super" | null>(null);
  const [activeChat, setActiveChat] = useState<DatingMatch | null>(null);

  const currentProfile = datingProfiles[currentIdx % datingProfiles.length];
  const nextProfile = datingProfiles[(currentIdx + 1) % datingProfiles.length];

  const handleSwipe = useCallback(
    (dir: "left" | "right" | "super") => {
      setSwipeAnim(dir);
      if ((dir === "right" || dir === "super") && Math.random() < 0.3) {
        setTimeout(() => setMatchPopup(currentProfile), 400);
      }
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setSwipeAnim(null);
      }, 300);
    },
    [currentProfile]
  );

  const handleMatchMessage = () => {
    if (matchPopup) {
      setMatchPopup(null);
      setActiveTab("matches");
    }
  };

  const totalUnread = mockMatches.reduce((acc, m) => acc + m.unread, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar title="Dating" />

        {/* Tab bar */}
        <div className="flex items-center border-b border-border bg-card px-2">
          {tabConfig.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={16} fill={isActive ? "currentColor" : "none"} />
                {tab.label}
                {tab.id === "matches" && totalUnread > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white text-[9px] font-bold flex items-center justify-center min-w-[18px] px-1">
                    {totalUnread}
                  </span>
                )}
                {tab.id === "likes" && (
                  <span className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[9px] font-bold flex items-center justify-center min-w-[18px] px-1">
                    3
                  </span>
                )}
                {isActive && (
                  <motion.div layoutId="dating-tab-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-4 pb-20 lg:pb-6"
            >
              <div className="relative w-full max-w-[380px] h-[520px] sm:h-[560px]">
                <AnimatePresence>
                  <SwipeCard key={`next-${(currentIdx + 1) % datingProfiles.length}`} profile={nextProfile} onSwipe={() => {}} isTop={false} />
                  {!swipeAnim && (
                    <SwipeCard key={`top-${currentIdx % datingProfiles.length}`} profile={currentProfile} onSwipe={handleSwipe} isTop />
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-4 mt-5">
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleSwipe("left")}
                  className="w-14 h-14 rounded-full bg-card border-2 border-red-400/30 flex items-center justify-center shadow-card hover:shadow-lift hover:border-red-400 transition-all"
                >
                  <X size={28} className="text-red-400" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleSwipe("super")}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
                >
                  <Star size={22} className="text-white" fill="white" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleSwipe("right")}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
                >
                  <Heart size={28} className="text-white" fill="white" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === "matches" && (
            <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <MatchesView onOpenChat={(m) => setActiveChat(m)} />
            </motion.div>
          )}

          {activeTab === "likes" && (
            <motion.div key="likes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <LikesView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat overlay */}
        <AnimatePresence>
          {activeChat && (
            <DatingChat
              match={activeChat}
              messages={mockDatingMessages[activeChat.id] || []}
              onBack={() => setActiveChat(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <MobileNav />

      {/* Match popup */}
      <AnimatePresence>
        {matchPopup && (
          <MatchPopup
            profile={matchPopup}
            onClose={() => setMatchPopup(null)}
            onMessage={handleMatchMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dating;
