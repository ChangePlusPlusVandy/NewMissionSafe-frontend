export interface youthType {
  firstName: string;
  lastName: string;
  birthDate: Date;
  ssn: string;
  email: string;
  firebaseUID: string;
  program: string;
  active: boolean;
  attached_forms?: string[];
  attended_events?: string[];
}
