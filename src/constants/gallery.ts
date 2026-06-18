export interface GalleryItem {
  id: string;
  title: string;
  category: "Wedding" | "Pre-wedding" | "Cinematic" | "Traditional" | "Destination";
  imageUrl: string;
  location: string;
  couple: string;
  year: string;
}

export const GALLERY_CATEGORIES = [
  "All",
  "Wedding",
  "Pre-wedding",
  "Cinematic",
  "Traditional",
  "Destination",
] as const;

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "The Palace Grandeur",
    category: "Wedding",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    location: "Leela Palace, Bangalore",
    couple: "Rhea & Armaan",
    year: "2025",
  },
  {
    id: "g2",
    title: "Golden Hour Symphony",
    category: "Pre-wedding",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    location: "Nandi Hills, Karnataka",
    couple: "Ananya & Rohan",
    year: "2025",
  },
  {
    id: "g3",
    title: "The Sacred Vows",
    category: "Traditional",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    location: "Chancery Pavilion, Bangalore",
    couple: "Deepika & Sandeep",
    year: "2024",
  },
  {
    id: "g4",
    title: "Cliffs of Amalfi",
    category: "Destination",
    imageUrl: "https://images.unsplash.com/photo-1507504038482-76214372a54a?q=80&w=1200&auto=format&fit=crop",
    location: "Amalfi Coast, Italy",
    couple: "Sarah & Kunal",
    year: "2024",
  },
  {
    id: "g5",
    title: "Whispers of the Forest",
    category: "Pre-wedding",
    imageUrl: "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=1200&auto=format&fit=crop",
    location: "Kabini Forest Reserve",
    couple: "Pooja & Abhi",
    year: "2025",
  },
  {
    id: "g6",
    title: "Unspoken Gaze",
    category: "Cinematic",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop",
    location: "ITC Gardenia, Bangalore",
    couple: "Tanya & Kabir",
    year: "2024",
  },
  {
    id: "g7",
    title: "The Regal Haldi",
    category: "Traditional",
    imageUrl: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200&auto=format&fit=crop",
    location: "Giri Farms, Bangalore",
    couple: "Kriti & Mayur",
    year: "2025",
  },
  {
    id: "g8",
    title: "Under a Thousand Bulbs",
    category: "Cinematic",
    imageUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop",
    location: "Taj West End, Bangalore",
    couple: "Shruti & Siddharth",
    year: "2024",
  },
  {
    id: "g9",
    title: "Mist over Nandi",
    category: "Pre-wedding",
    imageUrl: "https://images.unsplash.com/photo-1529636798458-92182e65f133?q=80&w=1200&auto=format&fit=crop",
    location: "Nandi Hills, Bangalore",
    couple: "Neha & Gaurav",
    year: "2025",
  },
  {
    id: "g10",
    title: "The Ocean Altar",
    category: "Destination",
    imageUrl: "https://images.unsplash.com/photo-1546193430-c2d20e1cd9de?q=80&w=1200&auto=format&fit=crop",
    location: "W Hotel, Goa",
    couple: "Karan & Tanya",
    year: "2024",
  },
  {
    id: "g11",
    title: "Bridal Editorial Elegance",
    category: "Wedding",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    location: "Sheraton Grand, Bangalore",
    couple: "Nisha & Rahul",
    year: "2025",
  },
  {
    id: "g12",
    title: "Vows in the Desert",
    category: "Destination",
    imageUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200&auto=format&fit=crop",
    location: "Suryagarh Palace, Jaisalmer",
    couple: "Radhika & Varun",
    year: "2025",
  },
];
