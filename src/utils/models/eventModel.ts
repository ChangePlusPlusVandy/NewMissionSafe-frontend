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