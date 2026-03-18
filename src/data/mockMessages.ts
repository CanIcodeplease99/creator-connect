import { creators, type Creator } from "./mockData";

export interface Message {
  id: string;
  senderId: string; // "user" or creator id
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  creator: Creator;
  messages: Message[];
  lastActive: string;
  unreadCount: number;
}

export const conversations: Conversation[] = [
  {
    id: "conv1",
    creator: creators[0], // Amara
    lastActive: "2m ago",
    unreadCount: 2,
    messages: [
      { id: "m1", senderId: "user", text: "Loved your latest track! When's the full version dropping?", timestamp: "10:30 AM", read: true },
      { id: "m2", senderId: "1", text: "Thank you so much! 🎵 Full version drops this Friday at midnight. Stay tuned!", timestamp: "10:32 AM", read: true },
      { id: "m3", senderId: "user", text: "Can't wait! Will there be a music video too?", timestamp: "10:35 AM", read: true },
      { id: "m4", senderId: "1", text: "Yes! We shot the MV last week in Cape Town. It's going to be 🔥", timestamp: "10:38 AM", read: false },
      { id: "m5", senderId: "1", text: "I'll share an exclusive behind-the-scenes clip with subscribers tomorrow!", timestamp: "10:39 AM", read: false },
    ],
  },
  {
    id: "conv2",
    creator: creators[1], // Liam
    lastActive: "1h ago",
    unreadCount: 1,
    messages: [
      { id: "m6", senderId: "user", text: "Hey Liam! I've been following your shred program for 3 weeks now", timestamp: "9:00 AM", read: true },
      { id: "m7", senderId: "2", text: "That's amazing! How are you finding the intensity?", timestamp: "9:15 AM", read: true },
      { id: "m8", senderId: "user", text: "It's tough but I'm seeing results already. Down 4kg!", timestamp: "9:20 AM", read: true },
      { id: "m9", senderId: "2", text: "Incredible progress! Keep pushing 💪 Send me a form check video if you want feedback on your deadlifts", timestamp: "9:22 AM", read: false },
    ],
  },
  {
    id: "conv3",
    creator: creators[4], // Zara
    lastActive: "3h ago",
    unreadCount: 0,
    messages: [
      { id: "m10", senderId: "user", text: "Hi Zara! Love the summer collection preview 😍", timestamp: "Yesterday", read: true },
      { id: "m11", senderId: "5", text: "Thank you! Which piece caught your eye? 👗", timestamp: "Yesterday", read: true },
      { id: "m12", senderId: "user", text: "The emerald blazer is stunning. Will it come in other colours?", timestamp: "Yesterday", read: true },
      { id: "m13", senderId: "5", text: "We're doing a limited run in navy and burgundy too! I'll post sizing details this week ✨", timestamp: "Yesterday", read: true },
    ],
  },
  {
    id: "conv4",
    creator: creators[5], // Jay
    lastActive: "1d ago",
    unreadCount: 0,
    messages: [
      { id: "m14", senderId: "user", text: "Your lo-fi tutorial was exactly what I needed! 🎧", timestamp: "2d ago", read: true },
      { id: "m15", senderId: "6", text: "Glad it helped! What DAW are you using?", timestamp: "2d ago", read: true },
      { id: "m16", senderId: "user", text: "Ableton. Any tips for getting warmer pads?", timestamp: "2d ago", read: true },
      { id: "m17", senderId: "6", text: "Try layering a subtle tape saturation plugin on the pad bus. I'll do a tutorial on that soon! 🎹", timestamp: "1d ago", read: true },
    ],
  },
];
