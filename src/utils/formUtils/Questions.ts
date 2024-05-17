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

const progressLogQuestions: Record<string, string>[] = [
  { question: "Email", typeOfResponse: "string" },
  { question: "Participant Name", typeOfResponse: "string" },
  { question: "Staffer Engaging with Participant", typeOfResponse: "string" },
  { question: "Name of Program Requesting", typeOfResponse: "string" },
  { question: "Date of Engagement", typeOfResponse: "string" },
  {
    question: "Assisted Youth In the following Personal Development areas",
    typeOfResponse: "string",
  },
  {
    question: "Assisted Youth In the following Professional Development areas",
    typeOfResponse: "string",
  },
  {
    question: "Assisted Youth In the following Educational Assistance areas",
    typeOfResponse: "string",
  },
  {
    question: "Youth Participated In the Following Leadership Areas",
    typeOfResponse: "string",
  },
  {
    question: "Youth Participated In the Following Health & Wellness Areas",
    typeOfResponse: "string",
  },
  {
    question:
      "Assisted Youth In the Following Violence Prevention Alternative Support Areas",
    typeOfResponse: "string",
  },
  {
    question: "Youth Participated In the Following Civic Engagement Areas",
    typeOfResponse: "string",
  },
  {
    question:
      "Youth Improved or Needs to Improve in the Following Social Skill Areas",
    typeOfResponse: "string",
  },
  { question: "Other Service if not listed above", typeOfResponse: "string" },
  { question: "Type of follow up", typeOfResponse: "string" },
  { question: "Notes from Engagement", typeOfResponse: "string" },
  { question: "Next Steps or Referrals Needed", typeOfResponse: "string" },
];

const horizonBroadeningQuestions: Record<string, string>[] = [
  { question: "Staff Person Reporting", typeOfResponse: "string" },
  { question: "Email", typeOfResponse: "string" },
  { question: "Date of Report", typeOfResponse: "string" },
  { question: "Program Name", typeOfResponse: "string" },
  { question: "Type of Event", typeOfResponse: "string" },
  { question: "Number of Youth who attended", typeOfResponse: "string" },
  { question: "Notes", typeOfResponse: "string" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
];

const partnershipsResourcesQuestions: Record<string, string>[] = [
  { question: "Email", typeOfResponse: "string" },
  { question: "Organization or Business Name", typeOfResponse: "string" },
  { question: "Contact Name", typeOfResponse: "string" },
  { question: "Contact Type", typeOfResponse: "string" },
  { question: "Contact Number", typeOfResponse: "string" },
  { question: "Contact Email", typeOfResponse: "string" },
  { question: "Notes", typeOfResponse: "string" },
];

const checkRequestQuestions: Record<string, string>[] = [
  { question: "Reason for Check", typeOfResponse: "string" },
  { question: "Check Amount ($)", typeOfResponse: "string" },
  { question: "Date Check Is Needed By", typeOfResponse: "string" },
  { question: "Make Check Payable to", typeOfResponse: "string" },
  { question: "Business Address if Applicable", typeOfResponse: "string" },
  {
    question: "How would you like the check disbursed",
    typeOfResponse: "string",
  },
  { question: "Check Requester Full Name", typeOfResponse: "string" },
  { question: "Check Requester Email", typeOfResponse: "string" },
];

const incidentReportQuestions: Record<string, string>[] = [
  { question: "Email", typeOfResponse: "string" },
  { question: "Staff Writing Report", typeOfResponse: "string" },
  { question: "Program", typeOfResponse: "string" },
  { question: "Date of Report", typeOfResponse: "string" },
  { question: "Date of Incident", typeOfResponse: "string" },
  { question: "Staff Involved in Incident", typeOfResponse: "staffIDArray" },
  { question: "Youth Involved in Incident", typeOfResponse: "youthIDArray" },
  { question: "Location of Incident", typeOfResponse: "string" },
  { question: "Details of Incident", typeOfResponse: "string" },
  { question: "Handling of Incident", typeOfResponse: "string" },
  { question: "Next Steps", typeOfResponse: "string" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
  { question: "Upload Picture if needed", typeOfResponse: "image" },
];

const expenseQuestions: Record<string, string>[] = [
  { question: "Date", typeOfResponse: "string" },
  { question: "Vendor", typeOfResponse: "string" },
  { question: "Budget Category", typeOfResponse: "string" },
  { question: "Explanation of Business Purpose", typeOfResponse: "string" },
  { question: "Program", typeOfResponse: "string" },
  { question: "Cash Reimbursement or Card", typeOfResponse: "string" },
  { question: "Amount", typeOfResponse: "string" },
];

export const formIDMapper: Record<string, string> = {
  "10": "Partnerships, Resources, & Internships Form",
  "5": "Program Supply and Request Form",
  "19": "Progress Log",
  "0015": "Van Log",
  "0012": "Check Request Form",
  "00124": "Incident Report Form",
  "0002": "Expense Form",
  "0003": "Horizon Broadening Form",
};

export const questionSelector: Record<string, Record<string, string>[]> = {
  "10": partnershipsResourcesQuestions,
  "5": programSupplyRequestQuestions,
  "19": progressLogQuestions,
  "0015": vanLogQuestions,
  "0012": checkRequestQuestions,
  "00124": incidentReportQuestions,
  "0002": expenseQuestions,
  "0003": horizonBroadeningQuestions,
};
