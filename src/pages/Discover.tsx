import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BadgeCheck, Radio, Users, TrendingUp, X } from "lucide-react";
import { creators, type Creator } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";
import { Input } from "@/components/ui/input";

const categories = ["All", "Music", "Fitness", "Art", "Cooking", "Fashion"];

const sortOptions = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low", value: "price-low" },
  { label: "Price: High", value: "price-high" },
];

const LiveBadge = () => (
  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-wide">
    <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground animate-pulse" />
    Live
  </span>
);

const CreatorCard = ({ creator, index }: { creator: Creator; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => navigate(creator.isLive ? `/live/${creator.handle.replace("@", "")}` : `/creator/${creator.handle.replace("@", "")}`)}
      className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-lift cursor-pointer transition-all duration-250"
    >
      {/* Cover */}
      <div className="relative h-32 sm:h-36 overflow-hidden">
        <img
          src={creator.cover}
          alt={creator.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Live badge */}
        {creator.isLive && (
          <div className="absolute top-3 left-3">
            <LiveBadge />
          </div>
        )}

        {/* Online indicator */}
        {creator.isOnline && !creator.isLive && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/80 backdrop-blur-sm text-[11px] font-medium text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md">
            {creator.price}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="relative px-4 pb-4 pt-0">
        <div className="absolute -top-7 left-4">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-14 h-14 rounded-full border-[3px] border-card bg-muted object-cover"
          />
        </div>

        <div className="pt-9">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-foreground text-sm truncate">{creator.name}</h3>
            {creator.verified && <BadgeCheck size={14} className="text-primary shrink-0" />}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">{creator.handle}</p>
          <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{creator.tagline}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {creator.subscribers >= 1000
                ? `${(creator.subscribers / 1000).toFixed(1)}k`
                : creator.subscribers}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {creator.totalPosts} posts
            </span>
          </div>
        </div>
      </div>

      {/* Promo badge */}
      {creator.promoDiscount && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
            {creator.promoDiscount}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const LiveCreatorStrip = ({ liveCreators }: { liveCreators: Creator[] }) => {
  const navigate = useNavigate();

  if (liveCreators.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Radio size={16} className="text-accent animate-pulse" />
        <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Live Now</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {liveCreators.map((c) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate(`/live/${c.handle.replace("@", "")}`)}
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-accent/30 hover:border-accent/60 shadow-card hover:shadow-lift transition-all duration-200"
          >
            <div className="relative">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-accent ring-offset-2 ring-offset-card" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-card" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground text-sm">{c.name}</span>
                {c.verified && <BadgeCheck size={12} className="text-primary" />}
              </div>
              <span className="text-muted-foreground text-xs">{c.category}</span>
            </div>
            <LiveBadge />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Discover = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const liveCreators = useMemo(() => creators.filter((c) => c.isLive), []);

  const filtered = useMemo(() => {
    let result = creators.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.handle.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.tagline.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    switch (activeSort) {
      case "popular":
        result.sort((a, b) => b.subscribers - a.subscribers);
        break;
      case "newest":
        result.sort((a, b) => b.totalPosts - a.totalPosts);
        break;
      case "price-low":
        result.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        break;
      case "price-high":
        result.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        break;
    }

    return result;
  }, [search, activeCategory, activeSort]);

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Discover" />

        <main className="flex-1 w-full max-w-[1100px] mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 lg:pb-6">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search creators, categories…"
              className="pl-10 pr-10 h-11 rounded-xl bg-card border-border text-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category pills + filter toggle */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`ml-auto p-2 rounded-xl border transition-colors ${
                showFilters ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Filter size={16} />
            </button>
          </div>

          {/* Sort options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mb-4 flex-wrap"
            >
              <span className="text-xs text-muted-foreground font-medium mr-1">Sort by:</span>
              {sortOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setActiveSort(s.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeSort === s.value
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Live Now strip */}
          <LiveCreatorStrip liveCreators={liveCreators} />

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length} creator{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Creator grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((creator, i) => (
              <CreatorCard key={creator.id} creator={creator} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No creators match your search.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-2 text-primary text-sm font-medium hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default Discover;
