import { UseFormReturn } from "react-hook-form";

export interface Client {
    id: string;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
    createdAt: Date;
    imageUrl: string;
}

export interface ClientFinances {
    id: string;
    fullname: string;
    email: string;
    phonenumber: string;
    address: string;
    amountPaid: number;
    pending: number;
    createdAt: Date;
    paymentHistory: Array<{
        amountPaid: number;
        createdAt: Date;
    }>;
}

export interface ClientPaymentDialogProps {
    clients: Client[];
    form: UseFormReturn<FormValues>;
}

export interface FormValues {
    fullname: string;
    address: string;
    email: string;
    phonenumber: string;
    amountPaid: number;
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

    expectedExpense?: string;

    expenses?: {
        id: string;
        amount: string;
        name: string;
        date: string;
    }[];

    documents?: {
        file?: any;
        desc: string;
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

type PaymentMethod = 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Cheque';

export interface ReceiptType {
    id: number;
    client: string;
    amount: number;
    method: PaymentMethod;
}