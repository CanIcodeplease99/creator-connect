import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Heart, MessageCircle, Repeat2, BadgeCheck, MoreHorizontal, Send } from "lucide-react";
import { type Post } from "@/data/mockData";

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard = ({ post, index }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [unlocked, setUnlocked] = useState(!post.isLocked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleUnlock = () => {
    setUnlocked(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <img src={post.creator.avatar} alt={post.creator.name} className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground text-sm">{post.creator.name}</span>
            {post.creator.verified && <BadgeCheck size={14} className="text-primary" />}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{post.creator.handle}</span>
            <div className="flex gap-1">
              {post.lockType === "sub" && <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[10px]">Sub-only</span>}
              {post.lockType === "ppv" && <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[10px]">PPV {post.ppvPrice}</span>}
              {!post.lockType && <span className="px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px]">Free</span>}
              {post.creator.isLive && <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[10px]">🔴 Live</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">{post.timestamp}</span>
          <button className="p-1 rounded-full hover:bg-secondary transition-colors">
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Media */}
      {post.media && (
        <div className="relative">
          <img
            src={post.media}
            alt=""
            className={`w-full aspect-[4/3] object-cover transition-all duration-250 ${!unlocked && post.isLocked ? "blur-locked" : ""}`}
          />
          {!unlocked && post.isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <Lock size={28} className="text-primary-foreground relative z-10 mb-2" />
              <p className="text-primary-foreground text-sm font-medium relative z-10 mb-3">
                {post.lockType === "ppv" ? `Unlock for ${post.ppvPrice}` : `Subscribe to ${post.creator.name} to view`}
              </p>
              <button
                onClick={handleUnlock}
                className="relative z-10 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5"
              >
                {post.lockType === "ppv" ? `Unlock ${post.ppvPrice}` : "Subscribe to unlock"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <div className="p-4 pt-3">
        <p className="text-foreground text-sm mb-1">{post.content}</p>
        {post.hashtags && (
          <p className="text-primary text-xs mb-3">{post.hashtags.map(t => `#${t}`).join(" ")}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-5">
            <button onClick={handleLike} className="flex items-center gap-1 text-sm transition-all duration-200">
              <motion.div whileTap={{ scale: 1.3 }} transition={{ duration: 0.15 }}>
                <Heart size={18} className={liked ? "fill-accent text-accent" : "text-muted-foreground"} />
              </motion.div>
              <span className={liked ? "text-accent" : "text-muted-foreground"}>{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle size={18} /> {post.comments}
            </button>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Repeat2 size={18} /> {post.reposts}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
              <Send size={14} className="inline mr-1" />Tip
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
