import { Search, Bell, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
}

const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-6 py-3 flex items-center gap-4">
      {/* Logo (mobile) */}
      <button onClick={() => navigate("/home")} className="lg:hidden text-xl font-extrabold text-primary mr-2">
        KEETH
      </button>

      <h1 className="text-lg font-bold text-foreground hidden sm:block">{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search creators, posts..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Mail size={20} className="text-muted-foreground" />
        </button>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="You" className="w-8 h-8 rounded-full bg-muted cursor-pointer" />
      </div>
    </header>
  );
};

export default TopBar;
