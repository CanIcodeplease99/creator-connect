import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, BadgeCheck, MoreHorizontal, Send, Play, Crown } from "lucide-react";
import { type Post } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: Post;
  index: number;
}

const VIDEO_PREVIEW_SECONDS = 15;

const PostCard = ({ post, index }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [videoTimeLeft, setVideoTimeLeft] = useState(VIDEO_PREVIEW_SECONDS);
  const [previewExpired, setPreviewExpired] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const isVideo = post.mediaType === "video";

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handlePlayPreview = () => {
    if (previewExpired) return;
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setVideoTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPreviewExpired(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const creatorHandle = post.creator.handle.replace("@", "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <img
          src={post.creator.avatar}
          alt={post.creator.name}
          className="w-10 h-10 rounded-full bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => navigate(`/creator/${creatorHandle}`)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-semibold text-foreground text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/creator/${creatorHandle}`)}
            >
              {post.creator.name}
            </span>
            {post.creator.verified && <BadgeCheck size={14} className="text-primary" />}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{post.creator.handle}</span>
            {isVideo && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-[10px] flex items-center gap-0.5">
                <Play size={8} fill="currentColor" /> Video
              </span>
            )}
            {post.creator.isLive && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium text-[10px]">🔴 Live</span>
            )}
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
        <div className="relative group">
          <img
            src={post.media}
            alt=""
            className={`w-full aspect-[4/3] object-cover transition-all duration-300 ${previewExpired ? "blur-locked" : ""}`}
          />
          {/* Video play overlay */}
          {isVideo && !isPlaying && !previewExpired && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-foreground/20 cursor-pointer transition-all hover:bg-foreground/30"
              onClick={handlePlayPreview}
            >
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lift backdrop-blur-sm">
                <Play size={28} className="text-primary-foreground ml-1" fill="currentColor" />
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-foreground/70 text-primary-foreground text-xs font-medium backdrop-blur-sm">
                {post.videoDuration ? `${Math.floor(post.videoDuration / 60)}:${String(post.videoDuration % 60).padStart(2, "0")}` : "Video"}
              </div>
            </div>
          )}
          {/* Playing state with countdown */}
          {isVideo && isPlaying && !previewExpired && (
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-3 bg-gradient-to-t from-foreground/60 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-primary-foreground text-xs font-medium">Preview playing...</span>
                  <span className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold animate-pulse">
                    {videoTimeLeft}s left
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1 rounded-full bg-primary-foreground/30 overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((VIDEO_PREVIEW_SECONDS - videoTimeLeft) / VIDEO_PREVIEW_SECONDS) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          )}
          {/* Preview expired overlay */}
          {previewExpired && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/50 backdrop-blur-sm">
              <Crown size={32} className="text-accent mb-2" />
              <p className="text-primary-foreground font-bold text-lg mb-1">Preview ended</p>
              <p className="text-primary-foreground/80 text-sm mb-4">Subscribe to watch the full video</p>
              <button
                onClick={() => navigate(`/creator/${creatorHandle}`)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-[hsl(280,80%,55%)] text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lift"
              >
                Subscribe to {post.creator.name} — {post.creator.price}
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

        {/* Subscribe CTA banner */}
        <button
          onClick={() => navigate(`/creator/${creatorHandle}`)}
          className="w-full mb-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-[hsl(280,80%,55%)] text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-lift"
        >
          <Crown size={16} />
          Subscribe to {post.creator.name} — {post.creator.price}
          {post.creator.promoDiscount && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
              {post.creator.promoDiscount}
            </span>
          )}
        </button>

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
