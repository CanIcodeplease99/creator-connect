import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, ImageIcon, Gift, Smile, MoreVertical, Search, BadgeCheck, Circle } from "lucide-react";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";
import { conversations as initialConversations, type Conversation, type Message } from "@/data/mockMessages";

const Messages = () => {
  const [convos, setConvos] = useState<Conversation[]>(initialConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConvo = convos.find((c) => c.id === activeConvoId) ?? null;

  const filteredConvos = convos.filter((c) =>
    c.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages.length]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeConvoId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      senderId: "user",
      text: newMessage.trim(),
      timestamp: "Just now",
      read: true,
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? { ...c, messages: [...c.messages, msg], lastActive: "Just now" }
          : c
      )
    );
    setNewMessage("");
    inputRef.current?.focus();
  };

  const openConvo = (id: string) => {
    setActiveConvoId(id);
    // Mark as read
    setConvos((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unreadCount: 0, messages: c.messages.map((m) => ({ ...m, read: true })) }
          : c
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Show TopBar only when no convo is active on mobile, always on desktop */}
        <div className={activeConvoId ? "hidden lg:block" : ""}>
          <TopBar title="Messages" />
        </div>

        <div className="flex-1 flex min-h-0">
          {/* Conversation List */}
          <div
            className={`w-full lg:w-[360px] lg:border-r border-border flex flex-col bg-card ${
              activeConvoId ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvos.map((convo) => {
                const lastMsg = convo.messages[convo.messages.length - 1];
                const isActive = convo.id === activeConvoId;
                return (
                  <button
                    key={convo.id}
                    onClick={() => openConvo(convo.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60 ${
                      isActive ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={convo.creator.avatar}
                        alt={convo.creator.name}
                        className="w-12 h-12 rounded-full object-cover bg-muted"
                      />
                      {convo.creator.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-sm truncate ${convo.unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                            {convo.creator.name}
                          </span>
                          {convo.creator.verified && <BadgeCheck size={14} className="text-primary flex-shrink-0" />}
                        </div>
                        <span className="text-[11px] text-muted-foreground flex-shrink-0 ml-2">{convo.lastActive}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${convo.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {lastMsg.senderId === "user" ? "You: " : ""}
                          {lastMsg.text}
                        </p>
                        {convo.unreadCount > 0 && (
                          <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat View */}
          <div className={`flex-1 flex flex-col ${activeConvoId ? "flex" : "hidden lg:flex"}`}>
            {activeConvo ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
                  <button
                    onClick={() => setActiveConvoId(null)}
                    className="lg:hidden p-1.5 rounded-full hover:bg-secondary transition-colors"
                  >
                    <ArrowLeft size={20} className="text-foreground" />
                  </button>
                  <img
                    src={activeConvo.creator.avatar}
                    alt={activeConvo.creator.name}
                    className="w-10 h-10 rounded-full object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-foreground">{activeConvo.creator.name}</span>
                      {activeConvo.creator.verified && <BadgeCheck size={14} className="text-primary" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activeConvo.creator.isOnline ? (
                        <span className="flex items-center gap-1">
                          <Circle size={8} className="fill-green-500 text-green-500" /> Online
                        </span>
                      ) : (
                        `Active ${activeConvo.lastActive}`
                      )}
                    </span>
                  </div>
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Gift size={18} className="text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <MoreVertical size={18} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {activeConvo.messages.map((msg, i) => {
                    const isUser = msg.senderId === "user";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isUser
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-secondary text-foreground rounded-bl-md"
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div className="border-t border-border bg-card px-3 py-3 pb-safe-area">
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                      <ImageIcon size={20} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                      <Smile size={20} />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      className="flex-1 py-2.5 px-4 rounded-full bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Your Messages</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Send private messages to creators you're subscribed to. Start a conversation!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Messages;
