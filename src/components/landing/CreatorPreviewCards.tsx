import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { creators } from "@/data/mockData";

const previewCreators = creators.slice(0, 3);

const CreatorPreviewCards = () => {
  return (
    <div className="flex flex-col gap-4">
      {previewCreators.map((creator, i) => (
        <motion.div
          key={creator.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: "easeOut" }}
          className="group bg-card/90 backdrop-blur-sm rounded-2xl shadow-card p-4 flex items-center gap-4 cursor-pointer hover:shadow-lift hover:-translate-y-0.5 transition-all duration-250"
        >
          <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full bg-muted" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground text-sm truncate">{creator.name}</span>
              {creator.verified && <BadgeCheck size={14} className="text-primary shrink-0" />}
            </div>
            <p className="text-muted-foreground text-xs">{creator.handle}</p>
            <p className="text-muted-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 truncate">{creator.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">From {creator.price}</span>
            <div className="flex gap-1 mt-1.5 justify-end">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{creator.category}</span>
              {creator.isLive && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Live</span>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CreatorPreviewCards;
