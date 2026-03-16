import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedPosts from "@/components/landing/FeaturedPosts";
import LandingNavbar from "@/components/landing/LandingNavbar";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection onLogin={handleLogin} />
      <FeaturedPosts />
    </div>
  );
};

export default Index;
