import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, BadgeCheck, Heart, Send, Gift, Users, Share2,
  MoreHorizontal, Volume2, VolumeX, Maximize, Radio
} from "lucide-react";
import { creators } from "@/data/mockData";
import { Input } from "@/components/ui/input";

const mockChatMessages = [
  { id: 1, user: "FanOfMusic", message: "🔥🔥🔥 this is amazing!", time: "2m ago" },
  { id: 2, user: "ArtLover23", message: "So talented!", time: "1m ago" },
  { id: 3, user: "VibeChaser", message: "Can you play that again?", time: "45s ago" },
  { id: 4, user: "CreativeKing", message: "Wow the detail is incredible", time: "30s ago" },
  { id: 5, user: "NightOwl", message: "First time here, love it!", time: "20s ago" },
  { id: 6, user: "TopFan99", message: "❤️❤️❤️", time: "10s ago" },
];

const LiveStream = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(mockChatMessages);
  const [viewerCount] = useState(() => Math.floor(Math.random() * 800) + 200);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const creator = creators.find((c) => c.handle.replace("@", "") === handle);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!creator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Stream not found</p>
      </div>
    );
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", message: chatInput, time: "now" },
    ]);
    setChatInput("");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black">
      {/* Video area */}
      <div className="flex-1 relative flex flex-col">
        {/* Stream video placeholder */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src={creator.cover}
            alt={`${creator.name} live stream`}
            className="w-full h-full object-cover"
          />
          {/* Simulated live overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

          {/* Top controls */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                <img src={creator.avatar} alt={creator.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-white text-sm font-semibold">{creator.name}</span>
                {creator.verified && <BadgeCheck size={14} className="text-primary" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold">
                <Radio size={12} className="animate-pulse" />
                LIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                <Users size={12} />
                {viewerCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  liked ? "bg-accent text-accent-foreground" : "bg-black/50 backdrop-blur-sm text-white"
                }`}
              >
                <Heart size={18} fill={liked ? "currentColor" : "none"} />
              </motion.button>
              <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <Gift size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stream title (mobile) */}
        <div className="lg:hidden bg-card px-4 py-3 border-t border-border">
          <h2 className="text-foreground font-bold text-sm">{creator.name} is live!</h2>
          <p className="text-muted-foreground text-xs mt-0.5">{creator.category} · {creator.tagline}</p>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="w-full lg:w-[360px] h-[45vh] lg:h-full flex flex-col bg-card border-l border-border">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-bold text-foreground text-sm">Live Chat</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{viewerCount} watching</span>
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <MoreHorizontal size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold ${msg.user === "You" ? "text-primary" : "text-foreground"}`}>
                  {msg.user}
                </span>
                <span className="text-xs text-muted-foreground ml-1.5">{msg.time}</span>
                <p className="text-sm text-foreground/90 mt-0.5">{msg.message}</p>
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Say something…"
              className="flex-1 h-9 rounded-xl bg-secondary border-0 text-sm"
            />
            <button
              onClick={handleSendChat}
              disabled={!chatInput.trim()}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
