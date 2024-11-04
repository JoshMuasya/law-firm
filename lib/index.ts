export interface Client {
    id: string;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
    createdAt: string;
    imageUrl: string;
}

export interface Cases {
    id: string;
    caseNumber: string;
    caseName: string;
    clientName: string;
    attorneyName: string;
    courtName: string;

    practiceArea: 'civil' | 'criminal' | 'corporate' | 'family' | 'property';
    caseStatus: 'active' | 'pending' | 'closed' | 'appeal';

    instructionsDate: string;
    caseDescription?: string;
    caseSummary?: string;

    expenses?: {
        description: string;
        amount: number;
        name: string;
        date: string;
        balance: string;
    }[];

    documents?: {
        file?: any;
        description: string;
        title: string;
        url: string;
    }[];

    events?: {
        title?: any;
        date: string;
    }[];

    milestones?: {
        title?: any;
        date: string;
    }[];

    communications?: {
        title?: any;
        date: string;
        type: string;
        summary: string;
        details: string;
    }[];
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