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

export interface PastWorkshop {
  id: string;
  title: string;
  participants: number;
  duration: string;
  location: string;
  image: string;
}
