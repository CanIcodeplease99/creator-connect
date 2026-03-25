import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, PenSquare, Heart, User } from "lucide-react";

const mobileNavItems = [
  { label: "Home", icon: Home, path: "/home" },
  { label: "Discover", icon: Compass, path: "/discover" },
  { label: "Post", icon: PenSquare, path: "/new-post" },
  { label: "Dating", icon: Heart, path: "/dating" },
  { label: "Profile", icon: User, path: "/profile" },
];

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => {
          const active = location.pathname === item.path;
          const isPost = item.label === "Post";
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isPost ? "" : active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {isPost ? (
                <div className="w-10 h-10 rounded-full gradient-promo flex items-center justify-center -mt-4 shadow-lift">
                  <PenSquare size={18} className="text-primary-foreground" />
                </div>
              ) : (
                <>
                  <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
