import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import LoginCard from "./LoginCard";
import CreatorPreviewCards from "./CreatorPreviewCards";

interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection = ({ onLogin }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-keeth-indigo/80 via-keeth-indigo/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
              KEETH
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground/95 mb-3">
              Where creators earn directly from fans.
            </p>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg">
              Subscribe to exclusive content, unlock premium posts, and support creators you love.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button
              onClick={onLogin}
              className="px-8 py-3.5 rounded-xl bg-card text-primary font-bold text-lg shadow-lift hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            >
              Sign up free
            </button>
            <button className="px-8 py-3.5 rounded-xl border-2 border-primary-foreground/40 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-all duration-200">
              Browse creators
            </button>
          </motion.div>

        </div>

        {/* Right */}
        <div className="flex flex-col items-center lg:items-end gap-8">
          <LoginCard onLogin={onLogin} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
