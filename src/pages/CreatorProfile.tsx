import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, ArrowLeft, Send, Mail, Heart, Lock, Star, Gift, Share2, MoreHorizontal, MapPin,
  Link as LinkIcon, Calendar, Image as ImageIcon, Video, Grid3X3, BarChart3, PenSquare, Settings,
  Eye, Users, TrendingUp, Camera, Radio
} from "lucide-react";
import { creators, posts } from "@/data/mockData";
import PostCard from "@/components/app/PostCard";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";
import SignUpModal from "@/components/app/SignUpModal";

const tabs = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Video },
  { id: "locked", label: "Locked", icon: Lock },
];

/* ── Owner-only quick-action panel ── */
const CreatorOwnerActions = ({ creator, navigate }: { creator: any; navigate: any }) => (
  <div className="px-4 sm:px-6 mb-4 sm:mb-6 space-y-3">
    {/* Quick actions grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {[
        { label: "Dashboard", icon: BarChart3, color: "from-primary to-primary/70", action: () => navigate("/dashboard") },
        { label: "New Post", icon: PenSquare, color: "from-emerald-500 to-emerald-600", action: () => {} },
        { label: "Go Live", icon: Radio, color: "from-accent to-accent/70", action: () => navigate(`/live/${creator.handle.replace("@", "")}`) },
        { label: "Settings", icon: Settings, color: "from-muted-foreground/80 to-muted-foreground/50", action: () => {} },
      ].map((item) => (
        <motion.button
          key={item.label}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={item.action}
          className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-primary-foreground shadow-card hover:shadow-lift transition-all`}
        >
          <item.icon size={20} />
          <span className="text-xs font-semibold">{item.label}</span>
        </motion.button>
      ))}
    </div>

    {/* Mini earnings summary */}
    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
        <TrendingUp size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">R3,933 this month</p>
        <p className="text-xs text-muted-foreground">+19.6% from last month</p>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Details
      </button>
    </div>
  </div>
);

const CreatorProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOwnProfile = searchParams.get("own") === "true" || handle === "amara_creates"; // mock: first creator is "you"
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  const creator = creators.find((c) => c.handle.replace("@", "") === handle);
  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Creator not found</p>
      </div>
    );
  }

  const creatorPosts = posts.filter((p) => p.creator.id === creator.id);
  const mediaPosts = creatorPosts.filter((p) => p.media && p.mediaType === "image");
  const videoPosts = creatorPosts.filter((p) => p.mediaType === "video");
  const lockedPosts = creatorPosts.filter((p) => p.isLocked);

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "media": return mediaPosts;
      case "videos": return videoPosts;
      case "locked": return lockedPosts;
      default: return creatorPosts;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={isOwnProfile ? "My Creator Profile" : creator.name} />

        <main className="flex-1 max-w-[820px] mx-auto w-full pb-20 lg:pb-6">
          {/* Cover Banner */}
          <div className="relative group">
            <img src={creator.cover} alt="" className="w-full h-40 sm:h-52 md:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 sm:p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift"
            >
              <ArrowLeft size={18} className="text-foreground" />
            </button>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
              {isOwnProfile && (
                <button className="p-2 sm:p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift">
                  <Camera size={16} className="text-foreground" />
                </button>
              )}
              <button className="p-2 sm:p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift">
                <Share2 size={16} className="text-foreground" />
              </button>
              <button className="p-2 sm:p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift">
                <MoreHorizontal size={16} className="text-foreground" />
              </button>
            </div>
            {creator.isLive && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lift"
              >
                <span className="w-2 h-2 rounded-full bg-accent-foreground animate-pulse" />
                LIVE
              </motion.div>
            )}
          </div>

          {/* Profile Header */}
          <div className="px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10">
            <div className="flex items-end justify-between mb-3 sm:mb-4">
              <div className="relative group">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-card bg-muted shadow-lift"
                />
                {isOwnProfile && (
                  <button className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera size={20} className="text-primary-foreground" />
                  </button>
                )}
                {creator.isOnline && (
                  <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>

              {/* Owner gets edit/view toggle; visitors get action buttons */}
              {isOwnProfile ? (
                <div className="flex gap-2 pb-1 sm:pb-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-card flex items-center gap-1.5"
                  >
                    <BarChart3 size={15} /> Dashboard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-full border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={15} /> Preview as Fan
                  </motion.button>
                </div>
              ) : (
                <div className="flex gap-2 sm:gap-2.5 pb-1 sm:pb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTipModal(true)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-primary-foreground flex items-center justify-center shadow-lg shadow-orange-400/30 hover:shadow-orange-400/50 transition-shadow"
                    title="Send Tip"
                  >
                    <Gift size={20} strokeWidth={2.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/messages?creator=${creator.id}`)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-500 text-primary-foreground flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
                    title="Send Message"
                  >
                    <Mail size={20} strokeWidth={2.5} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-red-400 text-primary-foreground flex items-center justify-center shadow-lg shadow-rose-400/30 hover:shadow-rose-400/50 transition-shadow"
                    title="Favourite"
                  >
                    <Star size={20} strokeWidth={2.5} fill="currentColor" />
                  </motion.button>
                </div>
              )}
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{creator.name}</h1>
                {creator.verified && <BadgeCheck size={18} className="text-primary" />}
              </div>
              <p className="text-muted-foreground text-sm">{creator.handle}</p>
            </div>

            <p className="text-foreground text-sm sm:text-[15px] leading-relaxed mb-3">{creator.tagline}</p>

            {/* Creator category badge */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{creator.category}</span>
              {creator.isLive && (
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Live Now
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-4 sm:mb-5">
              <span className="flex items-center gap-1"><MapPin size={13} /> South Africa</span>
              <span className="flex items-center gap-1">
                <LinkIcon size={13} />
                <span className="text-primary hover:underline cursor-pointer">keeth.co/{handle}</span>
              </span>
              <span className="flex items-center gap-1"><Calendar size={13} /> Joined Jan 2024</span>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-2xl bg-secondary mb-4 sm:mb-6">
              {[
                { val: creatorPosts.length, label: "Posts" },
                { val: creator.subscribers >= 1000 ? `${(creator.subscribers / 1000).toFixed(1)}K` : creator.subscribers, label: "Fans" },
                { val: creator.totalLikes >= 1000 ? `${(creator.totalLikes / 1000).toFixed(1)}K` : creator.totalLikes, label: "Likes" },
                { val: mediaPosts.length + videoPosts.length, label: "Media" },
              ].map((stat) => (
                <div key={stat.label} className="flex-1 flex flex-col items-center py-2 sm:py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                  <span className="text-base sm:text-lg font-bold text-foreground">{stat.val}</span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Subscribe CTA - only for visitors */}
            {!isOwnProfile && (
              <motion.div className="mb-4 sm:mb-6" layout>
                {!subscribed ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowSignUp(true)}
                      className="w-full py-3 sm:py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm sm:text-[15px] hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lift tracking-wide"
                    >
                      SUBSCRIBE · {creator.price}
                    </button>
                    {creator.promoDiscount && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                          🔥 Limited offer: {creator.promoDiscount}
                        </span>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full py-3.5 rounded-full bg-secondary text-foreground font-bold text-[15px] text-center border border-primary/20"
                  >
                    ✓ Subscribed
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Owner quick actions */}
          {isOwnProfile && <CreatorOwnerActions creator={creator} navigate={navigate} />}

          {/* Content Tabs */}
          <div className="sticky top-0 z-20 bg-card border-b border-border">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                    activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <tab.icon size={15} />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" transition={{ duration: 0.25, ease: "easeOut" }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Post Feed */}
          <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {filteredPosts.length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {activeTab === "media" ? (
                    <div className="grid grid-cols-3 gap-0.5 sm:gap-1 rounded-2xl overflow-hidden">
                      {mediaPosts.map((post) => (
                        <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden">
                          <img src={post.media} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          {post.isLocked && !subscribed && !isOwnProfile && (
                            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                              <Lock size={24} className="text-primary-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center gap-3 text-primary-foreground text-sm font-medium">
                              <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    filteredPosts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} onSubscribe={() => setShowSignUp(true)} />
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    {activeTab === "videos" ? <Video size={24} className="text-muted-foreground" /> :
                     activeTab === "locked" ? <Lock size={24} className="text-muted-foreground" /> :
                     <ImageIcon size={24} className="text-muted-foreground" />}
                  </div>
                  <p className="text-muted-foreground font-medium">No {activeTab} yet</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {isOwnProfile ? "Create your first post to get started!" : "Check back later for new content"}
                  </p>
                  {isOwnProfile && (
                    <button className="mt-3 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                      <PenSquare size={14} className="inline mr-1.5" /> Create Post
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Tip Modal - only for visitors */}
      {!isOwnProfile && (
        <AnimatePresence>
          {showTipModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
              onClick={() => setShowTipModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-card rounded-3xl p-6 w-full max-w-sm shadow-lift"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <img src={creator.avatar} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 bg-muted" />
                  <h3 className="text-lg font-bold text-foreground">Send a tip to {creator.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">Show your support!</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["R25", "R50", "R100"].map((amount) => (
                    <button key={amount} onClick={() => setTipAmount(amount)} className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${tipAmount === amount ? "bg-primary text-primary-foreground shadow-card" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                      {amount}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {["R200", "R500", "R1000"].map((amount) => (
                    <button key={amount} onClick={() => setTipAmount(amount)} className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${tipAmount === amount ? "bg-primary text-primary-foreground shadow-card" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
                      {amount}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowTipModal(false)}
                  disabled={!tipAmount}
                  className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-card"
                >
                  <Send size={16} className="inline mr-2" />
                  Send {tipAmount || "Tip"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <SignUpModal
        open={showSignUp}
        onClose={() => setShowSignUp(false)}
        creatorName={creator.name}
        creatorPrice={creator.price}
        creatorAvatar={creator.avatar}
      />
    </div>
  );
};

export default CreatorProfile;
