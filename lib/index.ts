export interface Client {
    id: string;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
    createdAt: string;
    imageUrl: string;
}

export interface FormDataInterface {
    caseNumber: string;
    caseName: string;
    clientName: string;
    attorneyName: string;
    courtName: string;
    practiceArea: string;
    caseStatus: string;
    instructionsDate: string;
    caseDescription: string;
    caseSummary: string;
    expenses: Expense[];
    documents: DocumentInterface[];
}

export interface Expense {
    description: string;
    amount: string | number;
}

export interface DocumentInterface {
    file: File | undefined;
    description: string;
}