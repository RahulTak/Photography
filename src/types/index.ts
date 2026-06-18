export interface GalleryItem {
  id: string;
  title: string;
  category: "Wedding" | "Pre-wedding" | "Cinematic" | "Traditional" | "Destination";
  imageUrl: string;
  location: string;
  couple: string;
  year: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  seatsTotal: number;
  seatsAvailable: number;
  instructor: string;
  location: string;
  image: string;
  syllabus: string[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Award {
  title: string;
  category: string;
  year: string;
  organization: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}
