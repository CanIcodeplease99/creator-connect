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
}

const avatarBase = "https://api.dicebear.com/7.x/avataaars/svg?seed=";

export const creators: Creator[] = [
  {
    id: "1", name: "Amara Okafor", handle: "@amara_creates", avatar: `${avatarBase}amara`, cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    verified: true, category: "Music", tagline: "Daily BTS drops & custom DMs", price: "R99/mo", subscribers: 12400, totalPosts: 342, totalLikes: 89200, isOnline: true,
  },
  {
    id: "2", name: "Liam Chen", handle: "@liamfit", avatar: `${avatarBase}liam`, cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    verified: true, category: "Fitness", tagline: "Workout plans & nutrition tips", price: "R149/mo", subscribers: 8700, totalPosts: 215, totalLikes: 45300, promoDiscount: "20% off",
  },
  {
    id: "3", name: "Sofia Reyes", handle: "@sofiaart", avatar: `${avatarBase}sofia`, cover: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    verified: true, category: "Art", tagline: "Timelapse paintings & commissions", price: "R79/mo", subscribers: 5200, totalPosts: 178, totalLikes: 32100, isLive: true,
  },
  {
    id: "4", name: "Thabo Ndlovu", handle: "@thabocooks", avatar: `${avatarBase}thabo`, cover: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    verified: false, category: "Cooking", tagline: "Traditional recipes made modern", price: "R59/mo", subscribers: 3100, totalPosts: 96, totalLikes: 15400,
  },
  {
    id: "5", name: "Zara Kim", handle: "@zarastyle", avatar: `${avatarBase}zara`, cover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    verified: true, category: "Fashion", tagline: "Exclusive lookbooks & styling tips", price: "R129/mo", subscribers: 19800, totalPosts: 410, totalLikes: 120500, isOnline: true,
  },
  {
    id: "6", name: "Jay Moodley", handle: "@jaymood", avatar: `${avatarBase}jay`, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    verified: true, category: "Music", tagline: "Beats, collabs & studio sessions", price: "R89/mo", subscribers: 7600, totalPosts: 201, totalLikes: 56700,
  },
];

export const posts: Post[] = [
  {
    id: "p1", creator: creators[0], content: "New track dropping this Friday! Here's a sneak peek of the studio session 🎵🔥", media: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 234, comments: 45, reposts: 12, timestamp: "2h ago", hashtags: ["newmusic", "studiolife"],
  },
  {
    id: "p2", creator: creators[1], content: "Full 6-week shred program now available for subscribers only. Transform your physique with science-backed training 💪", media: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    mediaType: "image", isLocked: true, lockType: "sub", likes: 567, comments: 89, reposts: 34, timestamp: "4h ago", hashtags: ["fitness", "shredprogram"],
  },
  {
    id: "p3", creator: creators[2], content: "Watch me paint this sunset landscape in real-time. 4 hours condensed into 10 minutes ✨🎨", media: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    mediaType: "image", isLocked: true, lockType: "ppv", ppvPrice: "R150", likes: 312, comments: 67, reposts: 23, timestamp: "6h ago", hashtags: ["art", "timelapse", "painting"],
  },
  {
    id: "p4", creator: creators[4], content: "Summer collection preview! These pieces won't be available anywhere else. Exclusive to my subscribers 👗", media: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    mediaType: "image", isLocked: true, lockType: "sub", likes: 890, comments: 156, reposts: 78, timestamp: "8h ago", hashtags: ["fashion", "exclusive", "summer"],
  },
  {
    id: "p5", creator: creators[3], content: "My grandmother's secret bunny chow recipe, passed down 3 generations. Made with love ❤️", media: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    mediaType: "image", isLocked: false, likes: 445, comments: 92, reposts: 56, timestamp: "12h ago", hashtags: ["cooking", "traditional", "familyrecipe"],
  },
  {
    id: "p6", creator: creators[5], content: "Behind the scenes of my latest collaboration. This beat is going to be massive 🎶", media: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    mediaType: "image", isLocked: true, lockType: "ppv", ppvPrice: "R120", likes: 678, comments: 134, reposts: 45, timestamp: "1d ago", hashtags: ["music", "collab", "bts"],
  },
];

export const trendingCreators = creators.slice(0, 4);
