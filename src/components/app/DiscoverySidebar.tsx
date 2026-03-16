import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { creators, type Creator } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const suggestedCreators = creators.slice(1, 6);

const CreatorSuggestionCard = ({ creator }: { creator: Creator }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/creator/${creator.handle.replace("@", "")}`)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:shadow-lift transition-all duration-250"
    >
      <img src={creator.cover} alt={creator.name} className="w-full h-36 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent group-hover:from-foreground/80 transition-all duration-250" />

      {/* Price chip */}
      <div className="absolute top-2 left-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-card/90 text-foreground font-medium">
          {creator.promoDiscount ? `Promo ${creator.promoDiscount}` : `From ${creator.price}`}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-1.5">
          <span className="text-primary-foreground font-semibold text-sm">{creator.name}</span>
          {creator.verified && <BadgeCheck size={12} className="text-primary-foreground" />}
        </div>
        <div className="flex items-center gap-2 text-primary-foreground/80 text-xs">
          <span>{creator.handle}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-[10px]">{creator.category}</span>
        </div>
        <p className="text-primary-foreground/70 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
          {creator.tagline} · {(creator.subscribers / 1000).toFixed(1)}K fans {creator.isOnline ? "· Online now" : ""}
        </p>
      </div>
    </div>
  );
};

const DiscoverySidebar = () => {
  const [startIdx, setStartIdx] = useState(0);
  const visible = suggestedCreators.slice(startIdx, startIdx + 2);
  const navigate = useNavigate();

  return (
    <aside className="hidden xl:block w-[320px] h-screen sticky top-0 overflow-y-auto py-6 pr-6 space-y-6">
      {/* Suggestions */}
      <div className="bg-card rounded-2xl shadow-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground text-sm">Suggestions</h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setStartIdx(Math.max(0, startIdx - 1))} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
            <button onClick={() => setStartIdx(Math.min(suggestedCreators.length - 2, startIdx + 1))} className="p-1 rounded-full hover:bg-secondary transition-colors">
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
            <button className="p-1 rounded-full hover:bg-secondary transition-colors">
              <RefreshCw size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {visible.map((c) => <CreatorSuggestionCard key={c.id} creator={c} />)}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-card rounded-2xl shadow-card p-4">
        <h3 className="font-bold text-foreground text-sm mb-3">Trending in your region</h3>
        <div className="space-y-2">
          {creators.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/creator/${c.handle.replace("@", "")}`)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 text-left">
                <span className="text-foreground text-sm font-medium">{c.name}</span>
                <span className="text-muted-foreground text-xs block">{c.category}</span>
              </div>
              <span className="text-primary text-xs">↑</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div className="gradient-promo rounded-2xl p-5 text-primary-foreground">
        <p className="font-bold text-sm mb-2">Welcome offer</p>
        <p className="text-xs opacity-90 mb-4">Get 50% off your first month with selected creators</p>
        <button className="w-full py-2 rounded-xl bg-card text-primary font-semibold text-sm hover:opacity-90 transition-all duration-200">
          View creators
        </button>
      </div>
    </aside>
  );
};

export default DiscoverySidebar;
