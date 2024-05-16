export interface youthType {
  firstName: string;
  lastName: string;
  middleInitial: string;

  birthDate: Date;
  ageJoined: number;
  gender: string;
  pronouns: string;
  race: string;
  ethnicity: string;

  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;

  ssn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  schoolName: string;
  grade: string;
  schoolId: string;
  educationalStatus: string;
  schoolDepartureTime: string;
  programArrivalTime: string;

  program: string;
  attached_forms: object[];
  attended_events: string[];
  active: boolean;
  uuid: string;

  medicalConditions: string;
  allergies: string;
  specialInstructions: string;
  healthInsurance: string;
  nameOfDoctor: string;
  doctorPhoneNumber: string;
  hospitalName: string;
}
