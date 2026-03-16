import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, MessageCircle, Repeat2, BadgeCheck, X } from "lucide-react";
import { posts, type Post } from "@/data/mockData";

interface PostCardPublicProps {
  post: Post;
  onPreview: (post: Post) => void;
}

const PostCardPublic = ({ post, onPreview }: PostCardPublicProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-lift transition-shadow duration-250 cursor-pointer"
      onClick={() => onPreview(post)}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5">
        <img src={post.creator.avatar} alt={post.creator.name} className="w-12 h-12 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{post.creator.name}</span>
            {post.creator.verified && <BadgeCheck size={16} className="text-primary" />}
          </div>
          <p className="text-muted-foreground text-sm">{post.creator.handle} · {post.timestamp}</p>
        </div>
        <div className="flex gap-1.5">
          {post.lockType === "sub" && <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Sub-only</span>}
          {post.lockType === "ppv" && <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">PPV {post.ppvPrice}</span>}
          {!post.isLocked && <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Free</span>}
        </div>
      </div>

      {/* Caption */}
      <div className="px-5 pb-3">
        <p className="text-foreground text-[15px] leading-relaxed">{post.content}</p>
        {post.hashtags && (
          <p className="text-primary text-sm mt-1.5">{post.hashtags.map(t => `#${t}`).join(" ")}</p>
        )}
      </div>

      {/* Media - large like OnlyFans */}
      {post.media && (
        <div className="relative w-full">
          <img src={post.media} alt="" className={`w-full aspect-[4/5] object-cover ${post.isLocked ? "blur-locked" : ""}`} />
          {post.isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/20">
              <Lock size={36} className="text-primary-foreground mb-3" />
              <span className="text-primary-foreground font-semibold text-base mb-3">
                {post.lockType === "ppv" ? `Unlock for ${post.ppvPrice}` : "Sign up to unlock"}
              </span>
              <button className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200">
                {post.lockType === "ppv" ? `Unlock ${post.ppvPrice}` : "Sign up to unlock"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-6 px-5 py-4 text-muted-foreground">
        <span className="flex items-center gap-1.5 text-sm"><Heart size={18} /> {post.likes}</span>
        <span className="flex items-center gap-1.5 text-sm"><MessageCircle size={18} /> {post.comments}</span>
        <span className="flex items-center gap-1.5 text-sm"><Repeat2 size={18} /> {post.reposts}</span>
      </div>
    </motion.div>
  );
};

const PostPreviewModal = ({ post, onClose }: { post: Post; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={post.creator.avatar} alt={post.creator.name} className="w-10 h-10 rounded-full bg-muted" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-foreground">{post.creator.name}</span>
                {post.creator.verified && <BadgeCheck size={14} className="text-primary" />}
              </div>
              <p className="text-muted-foreground text-xs">{post.creator.handle} · {post.timestamp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {post.media && (
          <div className="relative">
            <img src={post.media} alt="" className={`w-full object-cover ${post.isLocked ? "blur-locked" : ""}`} />
            {post.isLocked && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/20">
                <Lock size={32} className="text-primary-foreground mb-3" />
                <span className="text-primary-foreground font-semibold text-sm mb-2">
                  {post.lockType === "ppv" ? `Unlock for ${post.ppvPrice}` : `Subscribe to ${post.creator.name}`}
                </span>
                <button className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200">
                  {post.lockType === "ppv" ? `Unlock ${post.ppvPrice}` : "Sign up to unlock"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          <p className="text-foreground text-sm mb-2">{post.content}</p>
          {post.hashtags && (
            <p className="text-primary text-xs mb-4">{post.hashtags.map(t => `#${t}`).join(" ")}</p>
          )}
          <div className="flex items-center gap-5 text-muted-foreground text-sm pt-3 border-t border-border">
            <span className="flex items-center gap-1"><Heart size={16} /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageCircle size={16} /> {post.comments}</span>
            <span className="flex items-center gap-1"><Repeat2 size={16} /> {post.reposts}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturedPosts = () => {
  const [visibleCount, setVisibleCount] = useState(3);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <p className="text-primary font-medium text-sm mb-1">Handpicked for you</p>
        <h2 className="text-3xl font-bold text-foreground">Latest featured posts</h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        {visiblePosts.map((post) => (
          <PostCardPublic key={post.id} post={post} onPreview={setPreviewPost} />
        ))}
      </div>

      {visibleCount < posts.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount(posts.length)}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5"
          >
            Load more featured posts
          </button>
        </div>
      )}

      <AnimatePresence>
        {previewPost && <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedPosts;
