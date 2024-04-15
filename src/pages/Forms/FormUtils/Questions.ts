export const vanLogQuestions: Record<string, string>[] = [
  { question: "Email", typeOfResponse: "string" },
  { question: "Staff Driving", typeOfResponse: "string" },
  { question: "Program", typeOfResponse: "string" },
  { question: "Reason for using the van", typeOfResponse: "string" },
  { question: "Starting Mileage Image", typeOfResponse: "image" },
  { question: "Ending Mileage Image", typeOfResponse: "image" },
  { question: "Starting Gas Tank Image", typeOfResponse: "image" },
  { question: "Ending Gas Tank Image", typeOfResponse: "image" },
  {
    question: "Was The van clean when you got in it?",
    typeOfResponse: "string",
  },
  {
    question: "Initial Image of Van before trip (optional)",
    typeOfResponse: "image",
  },
  { question: "If not clean, please explain", typeOfResponse: "string" },
  {
    question: "Was The van clean when you returned it?",
    typeOfResponse: "string",
  },
  {
    question: "Image of Van after trip and cleaning",
    typeOfResponse: "image",
  },
  { question: "Upload Pictures as needed", typeOfResponse: "image" },
  { question: "Upload Pictures as needed", typeOfResponse: "image" },
  { question: "Upload Pictures as needed", typeOfResponse: "image" },
];

const programSupplyRequestQuestions: Record<string, string>[] = [
  { question: "Employee Requesting", typeOfResponse: "string" },
  { question: "Name of Program Requesting", typeOfResponse: "string" },
  { question: "Date Needed By", typeOfResponse: "string" },
  { question: "Item #1 Description", typeOfResponse: "string" },
  { question: "Item #1 Quantity", typeOfResponse: "string" },
  { question: "Item #1 Cost ($)", typeOfResponse: "string" },
  { question: "Item #2 Description", typeOfResponse: "string" },
  { question: "Item #2 Quantity", typeOfResponse: "string" },
  { question: "Item #2 Cost ($)", typeOfResponse: "string" },
  { question: "Item #3 Description", typeOfResponse: "string" },
  { question: "Item #3 Quantity", typeOfResponse: "string" },
  { question: "Item #3 Cost ($)", typeOfResponse: "string" },
  { question: "Item #4 Description", typeOfResponse: "string" },
  { question: "Item #4 Quantity", typeOfResponse: "string" },
  { question: "Item #4 Cost ($)", typeOfResponse: "string" },
  { question: "Item #5 Description", typeOfResponse: "string" },
  { question: "Item #5 Quantity", typeOfResponse: "string" },
  { question: "Item #5 Cost ($)", typeOfResponse: "string" },
  { question: "Total Cost ($)", typeOfResponse: "string" },
];

export const formIDMapper: Record<string, string> = {
  "10": "Partnerships, Resources & Internships List",
  "5": "Program Supply and Request",
  "19": "Progress Log",
  "0015": "Van Log",
  "0012": "Check Request Form",
  "00124": "Incident Report Form",
};
export const questionSelector: Record<string, Record<string, string>[]> = {
  // "10": "Partnerships, Resources & Internships List",
  "5": programSupplyRequestQuestions,
  // "19": "Progress Log",
  "0015": vanLogQuestions,
  // "0012": "Check Request Form",
  // "00124": "Incident Report Form",
};
