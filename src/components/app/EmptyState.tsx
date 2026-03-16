import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-2xl shadow-card p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Compass size={28} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">You're not following any creators yet</h3>
      <p className="text-muted-foreground text-sm mb-6">Discover amazing creators and subscribe to unlock exclusive content.</p>
      <button
        onClick={() => navigate("/discover")}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all duration-200"
      >
        Discover creators
      </button>
    </div>
  );
};

export default EmptyState;
