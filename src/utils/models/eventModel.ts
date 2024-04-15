export interface eventType {
  name: string;
  description: string;
  code: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
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
  startTime: string;
  endTime: string;
  location: string;
  programs: string[];
  staff: string[];
  attended_youth?: string[];
  attached_forms?: string[];
}

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