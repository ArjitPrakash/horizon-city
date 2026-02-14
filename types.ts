
export enum SessionType {
  THEORY = 'THEORY',
  APPLICATION = 'APPLICATION'
}

export interface Session {
  id: string;
  title: string;
  type: SessionType;
  content: string;
}

export interface DayPlan {
  day: number;
  topic: string;
  cityMilestone: string;
  subject: string;
  sessions: Session[];
}

export interface CityPhase {
  name: string;
  startDay: number;
  endDay: number;
  description: string;
  subjects: string[];
}
