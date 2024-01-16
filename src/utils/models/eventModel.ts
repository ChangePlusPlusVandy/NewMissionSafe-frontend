export interface eventType {
  name: string;
  description: string;
  code: string;
  date: Date;
  programs: string[];
  staff: string[];
  attended_youth?: string[];
  attached_forms?: string[];
}

export interface returnedEventType {
  name: string;
  description: string;
  code: string;
  date: string;
  programs: string[];
  staff: string[];
  attended_youth?: string[];
  attached_forms?: string[];
}
