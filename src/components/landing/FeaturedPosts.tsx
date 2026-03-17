import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Repeat2, BadgeCheck, X, Play, Crown, Lock } from "lucide-react";
import { posts, type Post } from "@/data/mockData";
import SignUpModal from "@/components/app/SignUpModal";

interface PostCardPublicProps {
  post: Post;
  onPreview: (post: Post) => void;
  onSubscribe: (post: Post) => void;
}

const PostCardPublic = ({ post, onPreview, onSubscribe }: PostCardPublicProps) => {
  const isVideo = post.mediaType === "video";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card rounded-2xl shadow-card overflow-hidden hover:shadow-lift transition-shadow duration-250 cursor-pointer"
      onClick={() => !isVideo && onPreview(post)}
    >
      {/* Creator header */}
      <div className="flex items-center gap-3 p-4 sm:p-5 pb-3">
        <img src={post.creator.avatar} alt={post.creator.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-sm sm:text-base truncate">{post.creator.name}</span>
            {post.creator.verified && <BadgeCheck size={16} className="text-primary shrink-0" />}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">{post.creator.handle} · {post.timestamp}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {isVideo && (
            <span className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
              <Play size={10} fill="currentColor" /> Video
            </span>
          )}
          {!isVideo && (
            <span className="text-xs px-2 sm:px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">Free preview</span>
          )}
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-foreground text-sm sm:text-[15px] leading-relaxed mb-2">{post.content}</p>
        {post.hashtags && (
          <p className="text-primary text-xs sm:text-sm">{post.hashtags.map(t => `#${t}`).join(" ")}</p>
        )}
      </div>

      {/* Media */}
      {post.media && (
        <div className="relative">
          {isVideo ? (
            /* Video: show blurred/locked preview — must sign up */
            <>
              <img src={post.media} alt="" className="w-full aspect-[4/3] object-cover blur-locked" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
                <Lock size={28} className="text-primary-foreground mb-2" />
                <p className="text-primary-foreground font-bold text-base sm:text-lg mb-1 text-center">Video content</p>
                <p className="text-primary-foreground/80 text-xs sm:text-sm mb-3 text-center">Sign up to access video previews</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onSubscribe(post); }}
                  className="px-5 sm:px-6 py-2.5 rounded-xl gradient-promo text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lift"
                >
                  Sign up free to watch
                </button>
              </div>
            </>
          ) : (
            <img src={post.media} alt="" className="w-full aspect-[4/3] object-cover" />
          )}
        </div>
      )}

      {/* Subscribe CTA */}
      <div className="px-4 sm:px-5 py-3">
        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(post); }}
          className="w-full py-2.5 px-4 rounded-xl gradient-promo text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
        >
          <Crown size={16} />
          Subscribe to {post.creator.name} — {post.creator.price}
          {post.creator.promoDiscount && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
              {post.creator.promoDiscount}
            </span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-5 pb-4 text-muted-foreground">
        <span className="flex items-center gap-1.5 text-sm"><Heart size={18} /> {post.likes}</span>
        <span className="flex items-center gap-1.5 text-sm"><MessageCircle size={18} /> {post.comments}</span>
        <span className="flex items-center gap-1.5 text-sm"><Repeat2 size={18} /> {post.reposts}</span>
      </div>
    </motion.div>
  );
};

const PostPreviewModal = ({ post, onClose, onSubscribe }: { post: Post; onClose: () => void; onSubscribe: () => void }) => {
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

        {post.media && <img src={post.media} alt="" className="w-full object-cover" />}

        <div className="p-4">
          <p className="text-foreground text-sm mb-2">{post.content}</p>
          {post.hashtags && (
            <p className="text-primary text-xs mb-4">{post.hashtags.map(t => `#${t}`).join(" ")}</p>
          )}

          <button
            onClick={onSubscribe}
            className="w-full mb-4 py-3 px-4 rounded-xl gradient-promo text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
          >
            <Crown size={16} />
            Subscribe to {post.creator.name} — {post.creator.price}
          </button>

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
  const [visibleCount, setVisibleCount] = useState(4);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [signUpModal, setSignUpModal] = useState<{
    open: boolean;
    creatorName?: string;
    creatorPrice?: string;
    creatorAvatar?: string;
  }>({ open: false });
  const visiblePosts = posts.slice(0, visibleCount);

  const handleSubscribe = (post: Post) => {
    setSignUpModal({
      open: true,
      creatorName: post.creator.name,
      creatorPrice: post.creator.price,
      creatorAvatar: post.creator.avatar,
    });
    setPreviewPost(null);
  };

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 sm:mb-10"
      >
        <p className="text-primary font-medium text-sm mb-1">Handpicked for you</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Latest featured posts</h2>
      </motion.div>

      <div className="flex flex-col gap-6 sm:gap-8">
        {visiblePosts.map((post) => (
          <PostCardPublic key={post.id} post={post} onPreview={setPreviewPost} onSubscribe={handleSubscribe} />
        ))}
      </div>

      {visibleCount < posts.length && (
        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => setVisibleCount((c) => Math.min(c + 4, posts.length))}
            className="px-6 sm:px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5"
          >
            Load more featured posts
          </button>
        </div>
      )}

      <AnimatePresence>
        {previewPost && (
          <PostPreviewModal
            post={previewPost}
            onClose={() => setPreviewPost(null)}
            onSubscribe={() => handleSubscribe(previewPost)}
          />
        )}
      </AnimatePresence>

      <SignUpModal
        open={signUpModal.open}
        onClose={() => setSignUpModal({ open: false })}
        creatorName={signUpModal.creatorName}
        creatorPrice={signUpModal.creatorPrice}
        creatorAvatar={signUpModal.creatorAvatar}
      />
    </section>
  );
};

export default FeaturedPosts;
