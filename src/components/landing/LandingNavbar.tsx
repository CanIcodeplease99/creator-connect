import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
        {/* Logo */}
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          KEETH
        </span>

        {/* CTA */}
        <button
          onClick={() => navigate("/home")}
          className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
        >
          Sign up free
        </button>
      </div>
    </header>
  );
};

export default LandingNavbar;
