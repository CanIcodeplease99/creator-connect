import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, ArrowLeft, Send, Mail, Heart, Users, FileText, TrendingUp } from "lucide-react";
import { creators, posts } from "@/data/mockData";
import PostCard from "@/components/app/PostCard";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";

const CreatorProfile = () => {
  const { handle } = useParams();
  const navigate = useNavigate();

  const creator = creators.find((c) => c.handle.replace("@", "") === handle);
  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Creator not found</p>
      </div>
    );
  }

  const creatorPosts = posts.filter((p) => p.creator.id === creator.id);

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={creator.name} />

        <main className="flex-1 max-w-[820px] mx-auto w-full">
          {/* Banner */}
          <div className="relative">
            <img src={creator.cover} alt="" className="w-full h-48 sm:h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            >
              <ArrowLeft size={18} className="text-foreground" />
            </button>
          </div>

          {/* Profile info */}
          <div className="px-6 -mt-12 relative z-10">
            <div className="flex items-end gap-4 mb-4">
              <img src={creator.avatar} alt={creator.name} className="w-24 h-24 rounded-full border-4 border-card bg-muted shadow-lift" />
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-foreground">{creator.name}</h1>
                  {creator.verified && <BadgeCheck size={18} className="text-primary" />}
                  {creator.isLive && (
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">🔴 Live</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{creator.handle}</p>
              </div>
            </div>

            <p className="text-foreground text-sm mb-4">{creator.tagline}</p>

            {/* Stats */}
            <div className="flex gap-6 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users size={16} /> <span className="font-semibold text-foreground">{(creator.subscribers / 1000).toFixed(1)}K</span> subscribers
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <FileText size={16} /> <span className="font-semibold text-foreground">{creator.totalPosts}</span> posts
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Heart size={16} /> <span className="font-semibold text-foreground">{(creator.totalLikes / 1000).toFixed(1)}K</span> likes
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <button className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-card">
                Subscribe · {creator.price}
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary transition-colors">
                <Mail size={18} />
              </button>
              <button className="px-4 py-2.5 rounded-xl bg-accent/10 text-accent font-medium hover:bg-accent/20 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="px-4 sm:px-6 pb-10 space-y-6">
            {creatorPosts.length > 0 ? (
              creatorPosts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
            ) : (
              <p className="text-center text-muted-foreground py-8">No posts from this creator yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorProfile;
