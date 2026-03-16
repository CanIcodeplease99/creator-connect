import { motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { creators, type Creator } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const suggestedCreators = creators.slice(1, 6);

const CreatorSuggestionCard = ({ creator }: { creator: Creator }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/creator/${creator.handle.replace("@", "")}`)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-lift transition-all duration-250"
    >
      {/* Cover image */}
      <img src={creator.cover} alt={creator.name} className="w-full h-[140px] object-cover" />

      {/* Price chip */}
      <div className="absolute top-3 left-3">
        <span className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold shadow-md">
          {creator.promoDiscount ? `Promo ${creator.promoDiscount}` : creator.price === "R59/mo" || creator.price === "R79/mo" ? "Free" : `From ${creator.price}`}
        </span>
      </div>

      {/* 3-dot menu */}
      <div className="absolute top-3 right-3">
        <button className="w-7 h-7 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:bg-card/90 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Avatar overlapping cover and info */}
      <div className="relative bg-card px-4 pb-4 pt-0">
        {/* Avatar positioned to overlap */}
        <div className="absolute -top-8 left-4">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 rounded-full border-[3px] border-card bg-muted object-cover"
          />
        </div>

        {/* Creator info - offset right of avatar */}
        <div className="pl-[76px] pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground font-bold text-sm truncate">{creator.name}</span>
            {creator.verified && <BadgeCheck size={14} className="text-primary shrink-0" />}
          </div>
          <span className="text-muted-foreground text-xs">{creator.handle}</span>
        </div>
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
