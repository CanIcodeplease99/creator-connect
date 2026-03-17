import { useState } from "react";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import Composer from "@/components/app/Composer";
import PostCard from "@/components/app/PostCard";
import DiscoverySidebar from "@/components/app/DiscoverySidebar";
import MobileNav from "@/components/app/MobileNav";
import SignUpModal from "@/components/app/SignUpModal";
import { posts, type Post } from "@/data/mockData";

const feedFilters = ["All", "Sub-only", "PPV", "Live"];

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [signUpModal, setSignUpModal] = useState<{
    open: boolean;
    creatorName?: string;
    creatorPrice?: string;
    creatorAvatar?: string;
  }>({ open: false });

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Sub-only") return p.lockType === "sub";
    if (activeFilter === "PPV") return p.lockType === "ppv";
    if (activeFilter === "Live") return p.creator.isLive;
    return true;
  });

  const handleSubscribe = (post: Post) => {
    setSignUpModal({
      open: true,
      creatorName: post.creator.name,
      creatorPrice: post.creator.price,
      creatorAvatar: post.creator.avatar,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Home" />

        <div className="flex-1 flex justify-center">
          {/* Center feed */}
          <main className="w-full max-w-[820px] px-3 sm:px-6 py-4 sm:py-6 pb-20 lg:pb-6">
            <Composer />

            {/* Filters */}
            <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-1 scrollbar-hide">
              {feedFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Feed */}
            <div className="space-y-4 sm:space-y-6">
              {filteredPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} onSubscribe={handleSubscribe} />
              ))}
              {filteredPosts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No posts match this filter.</div>
              )}
            </div>
          </main>

          <DiscoverySidebar />
        </div>
      </div>

      <MobileNav />

      <SignUpModal
        open={signUpModal.open}
        onClose={() => setSignUpModal({ open: false })}
        creatorName={signUpModal.creatorName}
        creatorPrice={signUpModal.creatorPrice}
        creatorAvatar={signUpModal.creatorAvatar}
      />
    </div>
  );
};

export default HomePage;
