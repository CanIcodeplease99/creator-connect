import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Coins, TrendingUp, DollarSign, Gift, Eye, Users,
  Calendar, Download, ChevronRight, Wallet, BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarNav from "@/components/app/SidebarNav";
import TopBar from "@/components/app/TopBar";
import MobileNav from "@/components/app/MobileNav";
import { COIN_TO_RAND_RATE } from "@/data/coins";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "gifts", label: "Gift History", icon: Gift },
  { id: "payouts", label: "Payouts", icon: Wallet },
];

const mockEarnings = {
  totalCoins: 142850,
  totalRands: 16427.75,
  thisMonth: 34200,
  thisMonthRands: 3933,
  lastMonth: 28600,
  pendingPayout: 8450.50,
  totalPayouts: 7977.25,
  subscribers: 1240,
  views: 45200,
};

const mockGiftHistory = [
  { id: 1, from: "TopFan99", gift: "🦁", giftName: "Lion", coins: 1000, date: "Today, 14:32", stream: "Chill vibes & music" },
  { id: 2, from: "NightOwl", gift: "🚀", giftName: "Rocket", coins: 500, date: "Today, 13:15", stream: "Chill vibes & music" },
  { id: 3, from: "VibeChaser", gift: "💎", giftName: "Diamond", coins: 199, date: "Today, 12:45", stream: "Chill vibes & music" },
  { id: 4, from: "CreativeKing", gift: "👑", giftName: "Crown", coins: 50, date: "Yesterday, 20:10", stream: "Art session" },
  { id: 5, from: "ArtLover23", gift: "🔥", giftName: "Fire", coins: 10, date: "Yesterday, 19:30", stream: "Art session" },
  { id: 6, from: "FanOfMusic", gift: "🌌", giftName: "Universe", coins: 2999, date: "2 days ago", stream: "Live Q&A" },
  { id: 7, from: "TopFan99", gift: "🪐", giftName: "Planet", coins: 4999, date: "3 days ago", stream: "Music production" },
  { id: 8, from: "NightOwl", gift: "⭐", giftName: "Star", coins: 99, date: "4 days ago", stream: "Cooking class" },
];

const mockPayouts = [
  { id: 1, amount: "R2,450.00", date: "15 Mar 2024", status: "completed", method: "Bank Transfer" },
  { id: 2, amount: "R1,890.50", date: "1 Mar 2024", status: "completed", method: "Bank Transfer" },
  { id: 3, amount: "R3,636.75", date: "15 Feb 2024", status: "completed", method: "Bank Transfer" },
  { id: 4, amount: "R8,450.50", date: "Pending", status: "pending", method: "Bank Transfer" },
];

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const growthPercent = mockEarnings.thisMonth > mockEarnings.lastMonth
    ? ((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth * 100).toFixed(1)
    : "0";

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Creator Dashboard" />

        <main className="flex-1 max-w-[900px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 pb-20 lg:pb-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl bg-secondary mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Earned", value: `R${mockEarnings.totalRands.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                  { label: "This Month", value: `R${mockEarnings.thisMonthRands.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", badge: `+${growthPercent}%` },
                  { label: "Total Coins", value: mockEarnings.totalCoins.toLocaleString(), icon: Coins, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                  { label: "Subscribers", value: mockEarnings.subscribers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon size={18} className={stat.color} />
                        </div>
                        {stat.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">{stat.badge}</span>
                        )}
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Earnings breakdown */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Stream Gifts", value: "R9,840.00", percent: 60, color: "bg-primary" },
                    { label: "Subscriptions", value: "R4,120.00", percent: 25, color: "bg-emerald-500" },
                    { label: "Tips", value: "R1,650.00", percent: 10, color: "bg-yellow-500" },
                    { label: "PPV Content", value: "R817.75", percent: 5, color: "bg-blue-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <span className="text-sm font-semibold text-foreground">{item.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pending payout card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Pending Payout</p>
                    <p className="text-2xl font-bold text-primary mt-1">R{mockEarnings.pendingPayout.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Next payout: 1 Apr 2024</p>
                  </div>
                  <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                    Request Payout
                  </button>
                </CardContent>
              </Card>

              {/* Recent gifts preview */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Gifts</CardTitle>
                    <button onClick={() => setActiveTab("gifts")} className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
                      View all <ChevronRight size={12} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockGiftHistory.slice(0, 4).map((g) => (
                    <div key={g.id} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-secondary/50 transition-colors">
                      <span className="text-2xl">{g.gift}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          <span className="text-primary">{g.from}</span> sent {g.giftName}
                        </p>
                        <p className="text-xs text-muted-foreground">{g.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground flex items-center gap-1">
                          <Coins size={12} className="text-yellow-500" />{g.coins}
                        </p>
                        <p className="text-[10px] text-muted-foreground">≈ R{(g.coins * COIN_TO_RAND_RATE).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "gifts" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              {mockGiftHistory.map((g) => (
                <div key={g.id} className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-card border border-border hover:shadow-card transition-all">
                  <span className="text-3xl">{g.gift}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-primary font-semibold">{g.from}</span> sent {g.giftName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.stream} · {g.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground flex items-center gap-1">
                      <Coins size={13} className="text-yellow-500" />{g.coins.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">≈ R{(g.coins * COIN_TO_RAND_RATE).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "payouts" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Payout summary */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Paid Out</p>
                    <p className="text-xl font-bold text-foreground">R{mockEarnings.totalPayouts.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Pending</p>
                    <p className="text-xl font-bold text-primary">R{mockEarnings.pendingPayout.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Payout list */}
              {mockPayouts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-card border border-border">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    p.status === "completed" ? "bg-emerald-500/10" : "bg-yellow-500/10"
                  }`}>
                    {p.status === "completed" ? (
                      <DollarSign size={18} className="text-emerald-500" />
                    ) : (
                      <Calendar size={18} className="text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{p.amount}</p>
                    <p className="text-xs text-muted-foreground">{p.method} · {p.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    p.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-yellow-500/10 text-yellow-600"
                  }`}>
                    {p.status === "completed" ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default CreatorDashboard;
