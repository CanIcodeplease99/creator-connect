import { useLocation, useNavigate } from "react-router-dom";
import { Home, Bell, Mail, CreditCard, Compass, Bookmark, Settings, PenSquare, BadgeCheck, Heart, Crown } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Messages", icon: Mail, path: "/messages" },
  { label: "Subscriptions", icon: CreditCard, path: "/subscriptions" },
  { label: "Discover", icon: Compass, path: "/discover" },
  { label: "Dating", icon: Heart, path: "/dating" },
  { label: "Collections", icon: Bookmark, path: "/collections" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-card border-r border-border p-5">
      {/* Logo */}
      <button onClick={() => navigate("/home")} className="text-2xl font-extrabold text-primary mb-8">
        KEETH
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={20} className={active ? "text-primary" : "text-muted-foreground"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Lounge - discreet link */}
      <button
        onClick={() => navigate("/lounge")}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 mb-3 ${
          location.pathname === "/lounge"
            ? "bg-yellow-500/10 text-yellow-600 font-semibold"
            : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary"
        }`}
      >
        <Crown size={16} className={location.pathname === "/lounge" ? "text-yellow-500" : "text-muted-foreground/40"} />
        <span>Lounge</span>
        <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground">18+</span>
      </button>

      {/* New Post */}
      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold mb-6 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-card">
        <PenSquare size={18} />
        New Post
      </button>

      {/* Profile */}
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="You" className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground text-sm truncate">You</span>
            <BadgeCheck size={12} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-xs truncate">@yourusername</p>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
