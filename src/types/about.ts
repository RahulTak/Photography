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

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface AboutData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  founders: {
    title: string;
    subtitle: string;
    storyParagraphs: string[];
    images: {
      sujay: string;
      shreyanka: string;
    };
  };
  missionVision: {
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  timeline: TimelineEvent[];
  awards: Award[];
  team: TeamMember[];
  process: ProcessStep[];
}
