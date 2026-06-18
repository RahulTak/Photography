import { TimelineEvent, Award, TeamMember } from "@/types";

export const ABOUT_CONTENT = {
  hero: {
    title: "Documenting Life's Electric Fleeting Moments",
    subtitle: "Behind the Lens",
    description: "JP Photography is a premier boutique photography and cinematography studio founded on the belief that raw human connection is the highest form of art.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200",
  },
  founders: {
    title: "Jay Prakash",
    subtitle: "Founder & Lead Luxury Storyteller",
    storyParagraphs: [
      "JP Photography is the creative vision of Jay Prakash. His journey is driven by an obsession with capturing raw human emotions and freezing fleeting moments of love in timeless editorial frames.",
      "With over a decade of experience shooting high-profile destination weddings across India and globally, Jay Prakash combines the precise control of editorial studio lighting with the pristine elegance of candid fine-art storytelling.",
      "Today, he guides a highly specialized team of cinematographers and color editors, infusing wedding storytelling with the velocity of composition and the pristine elegance of runway high fashion."
    ],
    images: {
      sujay: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
      shreyanka: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    },
  },
  missionVision: {
    mission: {
      title: "Our Mission",
      description: "To capture the fleeting sparks of authentic human connection and elevate them into editorial, cinematic masterpieces that future generations will cherish.",
    },
    vision: {
      title: "Our Vision",
      description: "To set the global standard for luxury wedding visual art, proving that wedding documentation can exist as true fine art.",
    },
  },
  timeline: [
    {
      year: "2011",
      title: "The Genesis",
      description: "Jay Prakash establishes JP Photography, focusing on raw candid wedding films in Rajasthan and New Delhi.",
    },
    {
      year: "2014",
      title: "Going International",
      description: "The studio shoots its first destination wedding in Florence, Italy, setting off an era of global luxury wedding assignments.",
    },
    {
      year: "2018",
      title: "Decadal Benchmarks",
      description: "Named 'Top 10 Wedding Photographers in India' by Better Photography. JP Photography opens its flagship private consultation lounge.",
    },
    {
      year: "2022",
      title: "The Cinematic Pivot",
      description: "Transitioned all cinematography workflows to Hollywood-grade RED Digital Cinema systems and established an in-house grading suite.",
    },
    {
      year: "2026",
      title: "JP Masterclasses",
      description: "Launched our national workshops program to share technical lighting and client strategies with the next wave of South Asian artists.",
    },
  ] as TimelineEvent[],
  awards: [
    {
      title: "Wedding Photographer of the Year",
      category: "Candid Emotion",
      year: "2024",
      organization: "Better Photography Magazine",
    },
    {
      title: "Fearless Award Winner",
      category: "Outstanding Composition",
      year: "2023",
      organization: "Fearless Photographers Association",
    },
    {
      title: "Influencer Award: Gold",
      category: "Cinematography & Film",
      year: "2025",
      organization: "WeddingSutra Awards",
    },
    {
      title: "Top 50 Global Wedding Storytellers",
      category: "Visual Editorial",
      year: "2024",
      organization: "Wanderlust Photo Awards",
    },
  ] as Award[],
  team: [
    {
      name: "Jay Prakash",
      role: "Founder & Lead Cinematographer",
      bio: "Focuses on direct cinematography, gimbal sequences, and final DaVinci color grading.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    },
    {
      name: "Karan Singh",
      role: "Lead Art Director & Lighting",
      bio: "Oversees editorial styling, lighting setup, and design grids.",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
    },
    {
      name: "Aditya Hegde",
      role: "Senior Editing Director",
      bio: "Over 8 years editing high-end narrative films, aligning music and emotional timing.",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
    },
    {
      name: "Ragini Nair",
      role: "Client Experience Manager",
      bio: "Handles consultations, scheduling, planning, and bespoke album delivery logistics.",
      imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
    },
  ] as TeamMember[],
  process: [
    {
      step: "01",
      title: "The Creative Alignment",
      description: "A coffee session (physical or video) to align on your visual tastes, wardrobe details, and mood boards.",
    },
    {
      step: "02",
      title: "Pre-wedding Cinematic",
      description: "A relaxed 1-day shoot focused on capturing your unique daily interactions in an editorial format.",
    },
    {
      step: "03",
      title: "The Documentation",
      description: "Our team blends into the wedding crowd, filming candid expressions without interrupting the flow of events.",
    },
    {
      step: "04",
      title: "The Editorial Grade",
      description: "Every selected frame is meticulously graded and each cinematic film is custom-sound-designed.",
    },
    {
      step: "05",
      title: "The Heirloom Handover",
      description: "Receive your fine-art digital vaults and a beautiful Italian leather-bound printed album.",
    },
  ],
} as const;
