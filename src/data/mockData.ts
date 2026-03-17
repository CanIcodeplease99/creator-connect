export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  verified: boolean;
  category: string;
  tagline: string;
  price: string;
  subscribers: number;
  totalPosts: number;
  totalLikes: number;
  isLive?: boolean;
  isOnline?: boolean;
  promoDiscount?: string;
}

export interface Post {
  id: string;
  creator: Creator;
  content: string;
  media?: string;
  mediaType?: "image" | "video";
  isLocked: boolean;
  lockType?: "sub" | "ppv";
  ppvPrice?: string;
  likes: number;
  comments: number;
  reposts: number;
  timestamp: string;
  hashtags?: string[];
  videoDuration?: number; // seconds — full video length
}

import avatarAmara from "@/assets/avatars/amara.jpg";
import avatarLiam from "@/assets/avatars/liam.jpg";
import avatarSofia from "@/assets/avatars/sofia.jpg";
import avatarThabo from "@/assets/avatars/thabo.jpg";
import avatarZara from "@/assets/avatars/zara.jpg";
import avatarJay from "@/assets/avatars/jay.jpg";

export const creators: Creator[] = [
  {
    id: "1", name: "Amara Okafor", handle: "@amara_creates", avatar: avatarAmara, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    verified: true, category: "Music", tagline: "Daily BTS drops & custom DMs", price: "R99/mo", subscribers: 12400, totalPosts: 342, totalLikes: 89200, isOnline: true,
  },
  {
    id: "2", name: "Liam Chen", handle: "@liamfit", avatar: avatarLiam, cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    verified: true, category: "Fitness", tagline: "Workout plans & nutrition tips", price: "R149/mo", subscribers: 8700, totalPosts: 215, totalLikes: 45300, promoDiscount: "20% off",
  },
  {
    id: "3", name: "Sofia Reyes", handle: "@sofiaart", avatar: avatarSofia, cover: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    verified: true, category: "Art", tagline: "Timelapse paintings & commissions", price: "R79/mo", subscribers: 5200, totalPosts: 178, totalLikes: 32100, isLive: true,
  },
  {
    id: "4", name: "Thabo Ndlovu", handle: "@thabocooks", avatar: avatarThabo, cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    verified: false, category: "Cooking", tagline: "Traditional recipes made modern", price: "R59/mo", subscribers: 3100, totalPosts: 96, totalLikes: 15400,
  },
  {
    id: "5", name: "Zara Kim", handle: "@zarastyle", avatar: avatarZara, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    verified: true, category: "Fashion", tagline: "Exclusive lookbooks & styling tips", price: "R129/mo", subscribers: 19800, totalPosts: 410, totalLikes: 120500, isOnline: true,
  },
  {
    id: "6", name: "Jay Moodley", handle: "@jaymood", avatar: avatarJay, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    verified: true, category: "Music", tagline: "Beats, collabs & studio sessions", price: "R89/mo", subscribers: 7600, totalPosts: 201, totalLikes: 56700,
  },
];

export const posts: Post[] = [
  // Amara — 4 posts
  {
    id: "p1", creator: creators[0], content: "New track dropping this Friday! Here's a sneak peek of the studio session 🎵🔥", media: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 234, comments: 45, reposts: 12, timestamp: "2h ago", hashtags: ["newmusic", "studiolife"],
  },
  {
    id: "p7", creator: creators[0], content: "Full live performance from last night's show in Cape Town. You don't want to miss this 🎤🔥", media: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 1023, comments: 201, reposts: 89, timestamp: "1d ago", hashtags: ["liveperformance", "capetown"], videoDuration: 180,
  },
  {
    id: "p10", creator: creators[0], content: "Acoustic cover of my favourite song — recorded live in one take 🎸", media: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 678, comments: 98, reposts: 45, timestamp: "3d ago", hashtags: ["acoustic", "onetake", "live"], videoDuration: 240,
  },
  {
    id: "p11", creator: creators[0], content: "My vocal warmup routine before every gig. Try it yourself! 🎶", media: "https://images.unsplash.com/photo-1516280440614-37763b2b15c8?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 412, comments: 67, reposts: 23, timestamp: "5d ago", hashtags: ["vocals", "warmup", "tips"], videoDuration: 120,
  },

  // Liam — 4 posts
  {
    id: "p2", creator: creators[1], content: "Full 6-week shred program now available. Transform your physique with science-backed training 💪", media: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 567, comments: 89, reposts: 34, timestamp: "4h ago", hashtags: ["fitness", "shredprogram"],
  },
  {
    id: "p8", creator: creators[1], content: "Morning mobility routine — follow along with me! This 15-min flow will change your day 🧘‍♂️", media: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 389, comments: 74, reposts: 31, timestamp: "2d ago", hashtags: ["mobility", "wellness", "followalong"], videoDuration: 900,
  },
  {
    id: "p12", creator: creators[1], content: "How I meal prep for the entire week in 2 hours. Full breakdown 🍗🥦", media: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 723, comments: 112, reposts: 67, timestamp: "4d ago", hashtags: ["mealprep", "nutrition", "gains"], videoDuration: 600,
  },
  {
    id: "p13", creator: creators[1], content: "Hit a new deadlift PR today — 220kg! Here's the form breakdown 🏋️", media: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 1102, comments: 198, reposts: 89, timestamp: "6d ago", hashtags: ["deadlift", "PR", "formcheck"],
  },

  // Sofia — 4 posts
  {
    id: "p3", creator: creators[2], content: "Watch me paint this sunset landscape in real-time. 4 hours condensed into 10 minutes ✨🎨", media: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 312, comments: 67, reposts: 23, timestamp: "6h ago", hashtags: ["art", "timelapse", "painting"], videoDuration: 600,
  },
  {
    id: "p14", creator: creators[2], content: "New portrait commission completed! Swipe to see the process 🖌️", media: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 456, comments: 78, reposts: 34, timestamp: "2d ago", hashtags: ["portrait", "commission", "oilpainting"],
  },
  {
    id: "p15", creator: creators[2], content: "Studio tour! Here's where the magic happens ✨🎨", media: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 289, comments: 45, reposts: 19, timestamp: "4d ago", hashtags: ["studiotour", "artist", "behindthescenes"], videoDuration: 300,
  },
  {
    id: "p16", creator: creators[2], content: "Colour mixing masterclass — learn how I create these rich earth tones 🎨", media: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 534, comments: 91, reposts: 42, timestamp: "1w ago", hashtags: ["colormixing", "masterclass", "tutorial"], videoDuration: 480,
  },

  // Thabo — 4 posts
  {
    id: "p5", creator: creators[3], content: "My grandmother's secret bunny chow recipe, passed down 3 generations. Made with love ❤️", media: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 445, comments: 92, reposts: 56, timestamp: "12h ago", hashtags: ["cooking", "traditional", "familyrecipe"],
  },
  {
    id: "p17", creator: creators[3], content: "Making the perfect chakalaka from scratch — step by step 🌶️🔥", media: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 321, comments: 56, reposts: 28, timestamp: "2d ago", hashtags: ["chakalaka", "southafrican", "homecooking"], videoDuration: 420,
  },
  {
    id: "p18", creator: creators[3], content: "Weekend braai essentials — everything you need for the perfect fire 🔥🥩", media: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 567, comments: 103, reposts: 45, timestamp: "5d ago", hashtags: ["braai", "weekend", "essentials"],
  },
  {
    id: "p19", creator: creators[3], content: "Quick 60-second roti tutorial — crispy every time! 🫓", media: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 289, comments: 41, reposts: 19, timestamp: "1w ago", hashtags: ["roti", "quickrecipe", "tutorial"], videoDuration: 60,
  },

  // Zara — 4 posts
  {
    id: "p4", creator: creators[4], content: "Summer collection preview! These pieces won't be available anywhere else 👗", media: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 890, comments: 156, reposts: 78, timestamp: "8h ago", hashtags: ["fashion", "exclusive", "summer"],
  },
  {
    id: "p9", creator: creators[4], content: "Exclusive runway footage from my latest fashion show. The crowd went wild! 👠✨", media: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 1456, comments: 312, reposts: 145, timestamp: "3d ago", hashtags: ["runway", "fashionshow", "exclusive"], videoDuration: 360,
  },
  {
    id: "p20", creator: creators[4], content: "How I style one blazer 5 different ways — which is your fave? 🔥", media: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 934, comments: 178, reposts: 67, timestamp: "4d ago", hashtags: ["styling", "blazer", "ootd"], videoDuration: 150,
  },
  {
    id: "p21", creator: creators[4], content: "Behind the scenes at the photoshoot 📸 New looks dropping soon!", media: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 1203, comments: 234, reposts: 98, timestamp: "1w ago", hashtags: ["bts", "photoshoot", "newcollection"],
  },

  // Jay — 4 posts
  {
    id: "p6", creator: creators[5], content: "Behind the scenes of my latest collaboration. This beat is going to be massive 🎶", media: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 678, comments: 134, reposts: 45, timestamp: "1d ago", hashtags: ["music", "collab", "bts"], videoDuration: 240,
  },
  {
    id: "p22", creator: creators[5], content: "New beat pack out now! 10 exclusive instrumentals for producers 🎹", media: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 534, comments: 89, reposts: 56, timestamp: "3d ago", hashtags: ["beats", "producer", "instrumentals"],
  },
  {
    id: "p23", creator: creators[5], content: "Live studio session — making a beat from scratch in 10 minutes 🎧", media: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 891, comments: 167, reposts: 78, timestamp: "5d ago", hashtags: ["beatmaking", "livestudio", "fromzero"], videoDuration: 600,
  },
  {
    id: "p24", creator: creators[5], content: "Quick tutorial: how to get that lo-fi tape sound on any DAW 🎛️", media: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    mediaType: "video", isLocked: false, likes: 445, comments: 72, reposts: 34, timestamp: "1w ago", hashtags: ["lofi", "tutorial", "production"], videoDuration: 300,
  },
];

export const trendingCreators = creators.slice(0, 4);
