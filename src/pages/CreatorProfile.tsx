import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, ArrowLeft, Send, Mail, Heart, Users, FileText,
  Lock, Star, Gift, Share2, MoreHorizontal, MapPin, Link as LinkIcon,
  Calendar, Image as ImageIcon, Video, Grid3X3, List
} from "lucide-react";
import { creators, posts } from "@/data/mockData";
import PostCard from "@/components/app/PostCard";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";

const tabs = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Video },
  { id: "locked", label: "Locked", icon: Lock },
];

const CreatorProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("");

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
        <TopBar title={creator.name} />

        <main className="flex-1 max-w-[820px] mx-auto w-full">
          {/* Cover Banner */}
          <div className="relative group">
            <img
              src={creator.cover}
              alt=""
              className="w-full h-52 sm:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift"
            >
              <ArrowLeft size={18} className="text-foreground" />
            </button>

            {/* Share & More */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift">
                <Share2 size={16} className="text-foreground" />
              </button>
              <button className="p-2.5 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all duration-200 shadow-lift">
                <MoreHorizontal size={16} className="text-foreground" />
              </button>
            </div>

            {/* Live indicator on cover */}
            {creator.isLive && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-lift"
              >
                <span className="w-2 h-2 rounded-full bg-accent-foreground animate-pulse" />
                LIVE
              </motion.div>
            )}
          </div>

          {/* Profile Header */}
          <div className="px-6 -mt-16 relative z-10">
            {/* Avatar row */}
            <div className="flex items-end justify-between mb-4">
              <div className="relative">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-28 h-28 rounded-full border-4 border-card bg-muted shadow-lift"
                />
                {creator.isOnline && (
                  <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => setShowTipModal(true)}
                  className="p-2.5 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
                  title="Send Tip"
                >
                  <Gift size={18} />
                </button>
                <button className="p-2.5 rounded-full border border-border text-foreground hover:bg-secondary transition-colors">
                  <Mail size={18} />
                </button>
                <button className="p-2.5 rounded-full border border-border text-foreground hover:bg-secondary transition-colors">
                  <Star size={18} />
                </button>
              </div>
            </div>

            {/* Name & handle */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold text-foreground">{creator.name}</h1>
                {creator.verified && (
                  <BadgeCheck size={20} className="text-primary" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">{creator.handle}</p>
            </div>

            {/* Bio */}
            <p className="text-foreground text-[15px] leading-relaxed mb-4">
              {creator.tagline}
            </p>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-5">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> South Africa
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon size={13} />
                <span className="text-primary hover:underline cursor-pointer">keeth.co/{handle}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> Joined Jan 2024
              </span>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary mb-6">
              <div className="flex-1 flex flex-col items-center py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                <span className="text-lg font-bold text-foreground">{creatorPosts.length}</span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Posts</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex-1 flex flex-col items-center py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                <span className="text-lg font-bold text-foreground">
                  {creator.subscribers >= 1000 ? `${(creator.subscribers / 1000).toFixed(1)}K` : creator.subscribers}
                </span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Fans</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex-1 flex flex-col items-center py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                <span className="text-lg font-bold text-foreground">
                  {creator.totalLikes >= 1000 ? `${(creator.totalLikes / 1000).toFixed(1)}K` : creator.totalLikes}
                </span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Likes</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex-1 flex flex-col items-center py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                <span className="text-lg font-bold text-foreground">{mediaPosts.length + videoPosts.length}</span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Media</span>
              </div>
            </div>

            {/* Subscribe CTA */}
            <motion.div className="mb-6" layout>
              {!subscribed ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setSubscribed(true)}
                    className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-[15px] hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lift tracking-wide"
                  >
                    SUBSCRIBE · {creator.price}
                  </button>
                  {creator.promoDiscount && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
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
          </div>

          {/* Content Tabs */}
          <div className="sticky top-0 z-20 bg-card border-b border-border">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Post Feed */}
          <div className="px-4 sm:px-6 py-6 space-y-6">
            <AnimatePresence mode="wait">
              {filteredPosts.length > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {activeTab === "media" ? (
                    /* Media grid */
                    <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
                      {mediaPosts.map((post) => (
                        <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden">
                          <img
                            src={post.media}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {post.isLocked && !subscribed && (
                            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm flex items-center justify-center">
                              <Lock size={24} className="text-primary-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex items-center gap-3 text-primary-foreground text-sm font-medium">
                              <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                              <span className="flex items-center gap-1"><Lock size={14} /> {post.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    filteredPosts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    {activeTab === "videos" ? <Video size={24} className="text-muted-foreground" /> :
                     activeTab === "locked" ? <Lock size={24} className="text-muted-foreground" /> :
                     <ImageIcon size={24} className="text-muted-foreground" />}
                  </div>
                  <p className="text-muted-foreground font-medium">No {activeTab} yet</p>
                  <p className="text-muted-foreground text-sm mt-1">Check back later for new content</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Tip Modal */}
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
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      tipAmount === amount
                        ? "bg-primary text-primary-foreground shadow-card"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {["R200", "R500", "R1000"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTipAmount(amount)}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      tipAmount === amount
                        ? "bg-primary text-primary-foreground shadow-card"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
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
    </div>
  );
};

export default CreatorProfile;
