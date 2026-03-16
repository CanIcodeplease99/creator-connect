import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedPosts from "@/components/landing/FeaturedPosts";

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onLogin={handleLogin} />
      <FeaturedPosts />
    </div>
  );
};

export default Index;
