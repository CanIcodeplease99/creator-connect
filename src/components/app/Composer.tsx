import { Image, Video, BarChart3, Type } from "lucide-react";

const Composer = () => {
  return (
    <div className="bg-card rounded-2xl shadow-card p-4 mb-6">
      <div className="flex items-start gap-3">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="You" className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1">
          <textarea
            placeholder="Compose new post…"
            rows={2}
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              {[Image, Video, BarChart3, Type].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200">
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <button className="px-5 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all duration-200">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
