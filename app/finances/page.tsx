"use client"

import React, { useEffect, useMemo, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    DollarSign,
    Receipt,
    FileText,
    ClipboardList,
    PlusCircle,
    X,
    Printer
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { format } from 'date-fns';

import toast, { Toaster } from 'react-hot-toast';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Search, Plus, Filter } from 'lucide-react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Cases, Client, ClientFinances, FormValues, ReceiptType } from '@/lib';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
    fullname: z.string().min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    phonenumber: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .regex(/^\d+$/, { message: "Phone number should contain only digits" }),
    address: z.string().min(5, { message: "Address must be at least 5 characters long" }),
    amountPaid: z
        .string()
        .regex(/^\d+$/, { message: "Amount paid must be a valid number" })
        .transform((value) => parseFloat(value)),
});

const errorMsg = () => toast('Failed to Add Payment!!! Try Again!!!');
const added = () => toast('Payment Added Successfully!!!');

const page = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState<Client[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredClients, setFilteredClients] = useState<Client[]>([])
    const [showDropdown, setShowDropdown] = useState(false);
    const [cases, setCases] = useState<Cases[]>([])
    const [clientPayments, setClientPayments] = useState<ClientFinances[]>([])
    const [selectedClientForHistory, setSelectedClientForHistory] = useState<ClientFinances | null>(null);
    const [searchExpensesTerm, setSearchExpensesTerm] = useState('');
    const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Cases | null>(null);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phonenumber: "",
            address: "",
            amountPaid: 0,
        },
    });

    const PaymentMethodIcon = ({ method }: { method: string }) => {
        switch (method) {
            case 'Cash':
                return <span className="mr-1">💵</span>;
            case 'Mobile Money':
                return <span className="mr-1">📱</span>;
            case 'Bank Transfer':
                return <span className="mr-1">🏦</span>;
            case 'Cheque':
                return <span className="mr-1">📝</span>;
            default:
                return null;
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const selectedClient = processedClients.find(
            client => client.fullname === values.fullname
        );

        if (!selectedClient || selectedClient.pending <= 0) {
            toast.error("Cannot record payment for a client with zero balance");
            return;
        }

        if (values.amountPaid > selectedClient.pending) {
            toast.error(`Payment amount cannot exceed pending balance of ${formatCurrency(selectedClient.pending)}`);
            return;
        }

        try {
            setIsSubmitting(true)

            const docRef = await addDoc(collection(db, "ClientPayments"), {
                fullname: values.fullname,
                email: values.email,
                phonenumber: values.phonenumber,
                address: values.address,
                amountPaid: values.amountPaid,
                createdAt: new Date().toISOString()
            });

            added();
        } catch (error) {
            console.log("Error: ", error)
            errorMsg()
        } finally {
            setIsSubmitting(false);
            form.reset()
        }
    }

    const generateReceipt = (payment: { id: any; client: any; amount: any; method: any; }) => {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">RECEIPT</h2>
                    <p className="text-gray-600">Law Firm Name</p>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Receipt No:</p>
                            <p>{payment.id}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Date:</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="font-semibold">Received From:</p>
                    <p>{payment.client}</p>
                    <p className="font-semibold mt-4">Amount:</p>
                    <p>${payment.amount.toLocaleString()}</p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">Thank you for your payment</p>
                </div>
            </div>
        );
    };

    const generateInvoice = (caseData: { totalPaid?: number; pending: any; lastPaymentDate?: Date; paymentHistory?: ClientFinances[]; id: any; fullname?: string; email?: string; phonenumber?: string; address?: string; createdAt?: Date; imageUrl?: string; client?: any; }) => {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-gray-600">Law Firm Name</p>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">Invoice To:</p>
                            <p>{caseData.client}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Invoice No:</p>
                            <p>INV-{caseData?.fullname?.slice(0, 4)}-{new Date().getFullYear().toString().slice(-2)}</p>
                            <p className="font-semibold mt-2">Date:</p>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* <div className="mb-6">
                    <div className="bg-gray-100 p-4 grid grid-cols-4 gap-4 font-medium">
                        <div>Description</div>
                        <div>Rate</div>
                        <div>Hours</div>
                        <div>Amount</div>
                    </div>
                    <div className="divide-y">
                        <div className="p-4 grid grid-cols-4 gap-4">
                            <div>Legal Services</div>
                            <div>$250/hr</div>
                            <div>40</div>
                            <div>$10,000</div>
                        </div>
                        <div className="p-4 grid grid-cols-4 gap-4">
                            <div>Filing Fees</div>
                            <div>-</div>
                            <div>-</div>
                            <div>$500</div>
                        </div>
                    </div>
                </div> */}

                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                        <span className="font-bold">Total Amount Due:</span>
                        <span className="font-bold">${caseData.pending.toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-8 text-sm text-gray-600">
                    <p>Payment Terms: Net 30</p>
                    <p>Please include invoice number with your payment</p>
                </div>
            </div>
        );
    };

    const fetchClients = async () => {
        try {
            const clientsCollection = collection(db, 'Clients')
            const clientSnapshot = await getDocs(clientsCollection)
            const clientList = clientSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Client, 'id'>
            }))
            setClients(clientList)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching clients: ", error)
            toast.error("Failed to load clients")
            setLoading(false)
        }
    }

    const fetchCases = async () => {
        try {
            const casesCollection = collection(db, 'Cases')
            const caseSnapshot = await getDocs(casesCollection)
            const caseList = caseSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Cases, 'id'>
            }))
            setCases(caseList)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching Cases: ", error)
            toast.error("Failed to load Cases")
            setLoading(false)
        }
    }

    const fetchClientPayments = async () => {
        try {
            const paymentsCollection = collection(db, 'ClientPayments')
            const paymentSnapshot = await getDocs(paymentsCollection)
            const paymentList = paymentSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<ClientFinances, 'id'>
            }))
            setClientPayments(paymentList)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching Payments: ", error)
            toast.error("Failed to load Payments")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
        fetchCases()
        fetchClientPayments()
    }, [])

    // Helper function to get total payments for a client
    const getClientTotalPayments = (clientName: string) => {
        return clientPayments
            .filter(payment => payment.fullname === clientName)
            .reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
    };

    // Helper function to get total expected expenses for a client's cases
    const getClientTotalExpenses = (clientName: string) => {
        const totalExpenses = cases
            .filter(caseItem => caseItem.clientName === clientName)
            .reduce((sum, caseItem) => sum + (parseInt(caseItem.expectedExpense ?? "0") || 0), 0);
        return totalExpenses
    };

    // Helper function to get the last payment date for a client
    const getLastPaymentDate = (clientName: string) => {
        const clientPaymentsSorted = clientPayments
            .filter(payment => payment.fullname === clientName)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return clientPaymentsSorted[0]?.createdAt || null;
    };

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KSH'
        }).format(amount);
    };

    // Process data for each client
    const processedClients = clients.map(client => {
        const amountPaid = getClientTotalPayments(client.fullname);
        const totalExpenses = getClientTotalExpenses(client.fullname);
        const pending = (totalExpenses * 1.5) - amountPaid;
        const lastPaymentDate = getLastPaymentDate(client.fullname);
        const clientPaymentHistory = clientPayments
            .filter(payment => payment.fullname === client.fullname)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


        return {
            ...client,
            amountPaid,
            pending,
            lastPaymentDate,
            paymentHistory: clientPaymentHistory
        };
    });

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = clients.filter(client =>
                client.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClients(filtered);
            setShowDropdown(true);
        } else {
            setFilteredClients([]);
            setShowDropdown(false);
        }
    }, [searchTerm, clients]);

    const handleClientSelect = (client: Client) => {
        form.setValue('fullname', client.fullname);
        form.setValue('address', client.address);
        form.setValue('email', client.email);
        form.setValue('phonenumber', client.phonenumber);

        setSearchTerm('');
        setShowDropdown(false);
    };

    // Search Cases in Expenses Tracker
    const filteredCases = useMemo(() =>
        cases.filter(c =>
            c.caseName.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [cases, searchTerm]
    );

    // Calculate Total Expenses 
    const calculateTotalExpenses = (caseExpenses: any[]) => {
        return caseExpenses.reduce((total: number, expense: { amount: string; }) => total + parseFloat(expense.amount), 0);
    };

    return (
        <div className="p-6">
            <div className='py-5 font-bold flex flex-col justify-center align-middle items-center text-4xl'>
                An overview of your Firm's Finances
            </div>
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">10000000</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">50000</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Total Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">20000</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-yellow-600">15000</p>
                    </CardContent>
                </Card>
            </div>

            {/* Case Expenses Tracking */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl flex justify-between items-center">
                        Case Expenses Tracker
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    placeholder="Search cases..."
                                    className="pl-8 w-[200px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <div className="bg-gray-100 p-4 grid grid-cols-5 gap-4 font-medium">
                            <div>Case</div>
                            <div>Expenses</div>
                            <div>Expense Cap</div>
                            <div>Balance</div>
                            <div>Actions</div>
                        </div>
                        <div className="divide-y">
                            {filteredCases.map(currentCase => (
                                <div key={currentCase.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                                    <div>{currentCase.caseName}</div>
                                    <div>
                                        {currentCase?.expenses?.map(expense => (
                                            <div
                                                key={expense.id}
                                                className="border rounded-lg shadow-md p-4 my-3 bg-white"
                                            >
                                                <h3 className="font-semibold text-lg text-gray-800">{expense.name}</h3>
                                                <p className="text-gray-600 mt-2">Ksh. {expense.amount}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div>Ksh. {currentCase.expectedExpense}</div>
                                    <div className={`font-bold ${calculateTotalExpenses(currentCase?.expenses || []) > (currentCase?.expectedExpense || 0)
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                        }`}>
                                        Ksh. {(Number(currentCase?.expectedExpense || 0) - Number(calculateTotalExpenses(currentCase?.expenses || []))).toFixed(2)}
                                    </div>
                                    <div>
                                        <Dialog
                                            open={isAddExpenseDialogOpen && selectedCase?.id === currentCase.id}
                                            onOpenChange={setIsAddExpenseDialogOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    onClick={() => setSelectedCase(currentCase)}
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Add Expense
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Expense for {currentCase.caseName}</DialogTitle>
                                                </DialogHeader>
                                                {/* Form to Add Expenses */}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Client Payments */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-xl">Client Payments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Record Payment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Record New Payment</DialogTitle>

                                    {/* Search Input with Dropdown */}
                                    <div className="relative">
                                        <div className="flex space-x-2 mb-4">
                                            <div className="relative flex-grow">
                                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="Search clients..."
                                                    className="pl-8"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Search Results Dropdown */}
                                        {showDropdown && filteredClients.length > 0 && (
                                            <div className="absolute w-full bg-white rounded-md border border-gray-200 shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                                                {filteredClients.map((client) => (
                                                    <div
                                                        key={client.id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleClientSelect(client)}
                                                    >
                                                        <div className="font-medium">{client.fullname}</div>
                                                        <div className="text-sm text-gray-500">{client.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </DialogHeader>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        {/* Client Name */}
                                        <FormField
                                            control={form.control}
                                            name="fullname"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Full Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Address */}
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Address" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Email */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Phone Number */}
                                        <FormField
                                            control={form.control}
                                            name="phonenumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Phone Number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Amount Paid */}
                                        <FormField
                                            control={form.control}
                                            name="amountPaid"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Amount Paid</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Amount Paid" type="number" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="w-full">
                        <div className="bg-gray-100 p-4 grid grid-cols-6 gap-4 font-medium">
                            <div>Client Name</div>
                            <div>Amount Paid</div>
                            <div>Pending</div>
                            <div>Last Payment</div>
                            <div>Payment History</div>
                            <div>Actions</div>
                        </div>
                        <div className="divide-y">
                            {processedClients.map(client => (
                                <div key={client.id} className="grid grid-cols-6 gap-4 p-4 items-center">
                                    <div className="font-medium">{client.fullname}</div>
                                    <div className="text-green-600">
                                        {formatCurrency(client.amountPaid)}
                                    </div>
                                    <div className="text-red-600">
                                        {formatCurrency(client.pending)}
                                    </div>
                                    <div>
                                        {client.lastPaymentDate
                                            ? format(new Date(client.lastPaymentDate), 'MMM dd, yyyy')
                                            : 'No payments'}
                                    </div>
                                    <div>
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => setSelectedClientForHistory(client)}
                                        >
                                            View History ({client.paymentHistory.length})
                                        </button>

                                        {/* Payment History Dialog */}
                                        <Dialog open={selectedClientForHistory !== null} onOpenChange={() => setSelectedClientForHistory(null)}>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Payment History for {selectedClientForHistory?.fullname}</DialogTitle>
                                                </DialogHeader>

                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedClientForHistory?.paymentHistory.map((payment, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                                                                </TableCell>
                                                                <TableCell className="text-green-600">
                                                                    {formatCurrency(payment.amountPaid)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className='flex flex-row justify-around align-middle items-center'>
                                        <Dialog>
                                            <DialogTrigger asChild className='px-2'>
                                                <Button variant="outline" size="sm">
                                                    <Receipt className="h-4 w-4 mr-2" />
                                                    Receipt
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <div>
                                                        <img src="/logo.png" alt="Logo" className="w-12 h-12" />
                                                    </div>
                                                    <DialogTitle>Receipt</DialogTitle>
                                                    <DialogDescription id="receipt-description" className="text-gray-600 text-center">
                                                        Law Firm Name - Payment Receipt Details
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {generateReceipt({
                                                    id: 1,
                                                    client: client.fullname,
                                                    amount: client.amountPaid,
                                                    method: "Cash"
                                                })}
                                                <div className="flex justify-end gap-4">
                                                    <Button>
                                                        <Printer className="h-4 w-4 mr-2" />
                                                        Print Receipt
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Invoice
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Invoice</DialogTitle>
                                                </DialogHeader>
                                                {generateInvoice(client)}
                                                <div className="flex justify-end gap-4">
                                                    <Button>
                                                        <Printer className="h-4 w-4 mr-2" />
                                                        Print Invoice
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Statements */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Financial Statements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="quarter">This Quarter</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                        // onClick={() => generateStatement(selectedPeriod)}
                        >
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Generate Statement
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Profit & Loss</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Total Revenue</span>
                                        <span>10000000</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Expenses</span>
                                        <span>20000</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Net Profit</span>
                                        <span>20000</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">

                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    );

}

export default page
