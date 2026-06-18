import { Workshop } from "@/types";

export const WORKSHOPS_CONTENT = {
  hero: {
    title: "Master the Art of Light & Motion",
    subtitle: "JP Photography Masterclasses",
    description: "Go behind the scenes of luxury wedding cinematography and editorial photography. Learn composition, cinematic color grading, client storytelling, and business strategy directly from Jay Prakash.",
  },
  benefits: [
    {
      title: "Cinematic Lighting",
      description: "Learn how to use natural ambient light and subtle strobe techniques to create high-contrast, moody, editorial visual narratives.",
    },
    {
      title: "Storytelling Frameworks",
      description: "Discover our proprietary 'Sparks Method' of capturing candid moments without making the couple feel self-conscious or posed.",
    },
    {
      title: "Luxury Business Playbook",
      description: "Understand our pricing tier strategy, high-net-worth client acquisition methods, and high-end client onboarding workflow.",
    },
    {
      title: "Advanced Color Grading",
      description: "Hands-on Davinci Resolve tutorials to create cohesive LUTs, warm luxury skin tones, and rich contrast profiles.",
    },
  ],
  pricing: [
    {
      name: "Light Masterclass",
      price: 14999,
      period: "1-Day Intensity",
      description: "Perfect for intermediate photographers seeking to elevate their lighting and composition.",
      features: [
        "6-hour intensive live studio shoot",
        "Natural & artificial light masterclass",
        "Composition & framing playbook",
        "Q&A session with Jay Prakash",
        "Digital Certificate of Completion",
      ],
      isPopular: false,
    },
    {
      name: "The Full Production",
      price: 29999,
      period: "3-Day Residency",
      description: "Our comprehensive blueprint covering lighting, grading, cinematography, and the business of photography.",
      features: [
        "All Light Masterclass inclusions",
        "Day 2: Full Cinematic Film editing & grading",
        "Day 3: Luxury Client acquisition business blueprint",
        "Lifetime access to JP LUT Pack & Presets",
        "1-on-1 portfolio review session (1 hour)",
      ],
      isPopular: true,
    },
  ],
  faqs: [
    {
      question: "Who are these workshops designed for?",
      answer: "These sessions are tailored for intermediate-level photographers, cinematographers, and aspiring wedding filmmakers looking to transition into the premium luxury segment.",
    },
    {
      question: "Do I need high-end gear to attend?",
      answer: "No. A basic mirrorless or DSLR camera with manual controls is sufficient. We focus heavily on lighting principles, storytelling, and editing, which apply to all equipment.",
    },
    {
      question: "Are seats restricted?",
      answer: "Yes, to ensure personalized feedback and 1-on-1 focus during live shooting exercises, we limit our cohorts to a maximum of 15 attendees per session.",
    },
    {
      question: "Is there a certificate provided?",
      answer: "Yes, a physical signed certificate from JP Photography is awarded to attendees at the completion of either residency class.",
    },
  ],
  upcoming: [
    {
      id: "w1",
      title: "The Editorial Wedding Masterclass",
      description: "A comprehensive workshop on recreating fashion-editorial lighting structures in real-world, fast-paced luxury wedding environments.",
      longDescription: "Step into a fully mock-up luxury wedding set. Under the mentorship of Jay Prakash, you'll learn how to pose high-fashion subjects, modify harsh afternoon sun, work with wireless off-camera flash units, and establish client trust. The second half covers color grading in Lightroom and Lightroom Mobile for quick-turnaround deliverables.",
      date: "July 18, 2026",
      time: "10:00 AM - 6:00 PM IST",
      price: 14999,
      currency: "INR",
      seatsTotal: 15,
      seatsAvailable: 3,
      instructor: "Jay Prakash",
      location: "JP Photography Studio, Near Sharda Bal School, Nagaur, Rajasthan",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800",
      syllabus: [
        "Understanding lighting angles and light qualities",
        "Directing couples using natural triggers, not stiff poses",
        "Setting up flash systems inside luxury ballroom venues",
        "Advanced post-production grading filters",
      ],
    },
    {
      id: "w2",
      title: "Cinematic Film & Color Grading Residency",
      description: "Learn how to script, direct, capture, and grade stunning luxury wedding films that evoke intense emotional responses.",
      longDescription: "This three-day residency breaks down the cinematic wedding film workflow. We will cover pre-production storyboarding, camera movement using gimbals and monopolets, sound design using ambient lapels, and a full deep-dive in Davinci Resolve. You will edit a project using real footage captured from a premium heritage wedding.",
      date: "August 12-14, 2026",
      time: "9:30 AM - 5:30 PM IST (Daily)",
      price: 29999,
      currency: "INR",
      seatsTotal: 12,
      seatsAvailable: 4,
      instructor: "Jay Prakash",
      location: "Grand Sheraton Ballroom & JP Suite, Jaipur, Rajasthan",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800",
      syllabus: [
        "Pre-production storytelling theory and interviewing",
        "Audio engineering, choosing music licensing, and room tones",
        "Color spaces, Log footage conversion, skin tone balancing",
        "Sound effects, foley integration, and exporting presets",
      ],
    },
  ] as Workshop[],
  past: [
    {
      id: "past-1",
      title: "Spring Cohort 2025: Palace Residency",
      participants: 15,
      duration: "3 Days",
      location: "Udaipur, Rajasthan",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    },
    {
      id: "past-2",
      title: "Winter Cohort 2024: Editorial & Fashion Lighting",
      participants: 18,
      duration: "1 Day",
      location: "Studio 11, Jaipur, Rajasthan",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    },
  ],
} as const;
