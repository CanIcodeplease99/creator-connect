import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Camera, Edit3, MapPin, Link as LinkIcon, Calendar,
  Heart, Users, Grid3X3, CreditCard, Settings, LogOut, ChevronRight, Bell, Shield, Palette, Bookmark, TrendingUp, Sparkles
} from "lucide-react";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";
import { creators } from "@/data/mockData";

const subscribedCreators = creators.slice(0, 4);

const settingsItems = [
  { label: "Notifications", icon: Bell, description: "Manage push & email alerts" },
  { label: "Privacy & Security", icon: Shield, description: "Password, 2FA, blocked users" },
  { label: "Appearance", icon: Palette, description: "Theme, language, display" },
  { label: "Billing", icon: CreditCard, description: "Payment methods & invoices" },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Thompson",
    handle: "@alexthompson",
    bio: "Digital creator & music lover. Supporting independent artists and discovering new talent every day 🎵✨",
    location: "Johannesburg, SA",
    website: "alexthompson.co",
    joined: "March 2024",
  });
  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const stats = [
    { val: subscribedCreators.length, label: "Subscriptions", icon: Users },
    { val: "2.1K", label: "Likes Given", icon: Heart },
    { val: "R1,240", label: "Tips Sent", icon: TrendingUp },
    { val: "8", label: "Saved", icon: Bookmark },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="My Profile" />

        <main className="flex-1 max-w-[820px] mx-auto w-full pb-20 lg:pb-6">
          {/* Cover */}
          <div className="relative">
            <div className="w-full h-36 sm:h-48 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary" />
            <button className="absolute bottom-3 right-3 p-2 rounded-full bg-card/70 backdrop-blur-md hover:bg-card transition-all shadow-lift">
              <Camera size={16} className="text-foreground" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10">
            <div className="flex items-end justify-between mb-3 sm:mb-4">
              <div className="relative group">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="Your profile"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-card bg-muted shadow-lift"
                />
                <button className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera size={20} className="text-primary-foreground" />
                </button>
              </div>
              <button
                onClick={() => {
                  if (isEditing) handleSave();
                  else {
                    setEditForm(profile);
                    setIsEditing(true);
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isEditing
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                <Edit3 size={14} />
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>

            {/* Name & Bio */}
            {isEditing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-4">
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full text-xl font-bold bg-secondary rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location"
                    className="text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="Website"
                    className="text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{profile.name}</h1>
                  <p className="text-muted-foreground text-sm">{profile.handle}</p>
                </div>
                <p className="text-foreground text-sm sm:text-[15px] leading-relaxed mb-4">{profile.bio}</p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground mb-4 sm:mb-5">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {profile.location}</span>
                  <span className="flex items-center gap-1">
                    <LinkIcon size={13} />
                    <span className="text-primary hover:underline cursor-pointer">{profile.website}</span>
                  </span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> Joined {profile.joined}</span>
                </div>
              </>
            )}

            {/* Stats */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-2xl bg-secondary mb-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 flex flex-col items-center py-2 sm:py-3 rounded-xl hover:bg-card transition-colors cursor-default">
                  <stat.icon size={14} className="text-primary mb-1" />
                  <span className="text-base sm:text-lg font-bold text-foreground">{stat.val}</span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Subscriptions — fan subscribing to creators */}
          <div className="px-4 sm:px-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users size={16} className="text-primary" /> Creators I Follow
              </h2>
              <button className="text-xs text-primary font-medium hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {subscribedCreators.map((creator) => (
                <motion.div
                  key={creator.id}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/creator/${creator.handle.replace("@", "")}`)}
                  className="flex flex-col items-center p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group cursor-pointer"
                >
                  <div className="relative mb-2">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-14 h-14 rounded-full object-cover bg-muted ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                    />
                    {creator.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center truncate w-full">{creator.name}</span>
                  <span className="text-[11px] text-muted-foreground">{creator.price}</span>
                  <span className="text-[10px] text-primary font-medium mt-1">Subscribed ✓</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="px-4 sm:px-6 mb-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
              <Heart size={16} className="text-primary" /> My Activity
            </h2>
            <div className="space-y-2">
              {[
                { text: "You liked Amara's post", time: "2h ago", icon: Heart },
                { text: "You subscribed to Liam Chen", time: "1d ago", icon: Users },
                { text: "You sent a tip to Sofia Reyes", time: "3d ago", icon: CreditCard },
                { text: "You saved Zara's summer collection", time: "5d ago", icon: Bookmark },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon size={14} className="text-primary" />
                  </div>
                  <span className="flex-1 text-sm text-foreground">{activity.text}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="px-4 sm:px-6 mb-6">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
              <Settings size={16} className="text-primary" /> Settings
            </h2>
            <div className="space-y-1">
              {settingsItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-secondary/60 transition-colors text-left"
                >
                  <div className="p-2 rounded-full bg-secondary">
                    <item.icon size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 sm:px-6 pb-6">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium">
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default UserProfile;
