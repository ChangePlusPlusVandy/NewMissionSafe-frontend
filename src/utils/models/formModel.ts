export interface responseType {
    responseID: string;
    creatorID: string;
    timestamp: Date;
    responses: (string | string[])[];
    associatedYouthID?: string;
  }

  export interface formType {
    formID: string;
    name: string;
    description: string;
    dateCreated: Date;
    creatorID: string;
    questions: string[];
    responses?: responseType[];
    isCounselorForm: boolean;
  }