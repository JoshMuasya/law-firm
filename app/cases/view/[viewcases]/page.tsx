"use client"

import React, { useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import { Cases } from '@/lib'
import { addDoc, arrayUnion, collection, doc, DocumentSnapshot, getDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '@/lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { motion } from "framer-motion";

const errorMsg = () => toast('Failed to Add!!! Try Again!!!');
const added = () => toast('Added Successfully!!!');

const eventSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters" }),
    date: z.string(),
    description: z.string().optional()
});

const documentSchema = z.object({
    desc: z.string(),
    file: z.instanceof(File),
});

const expenseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    date: z.string(),
    amount: z.string()
});

const communicationSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters" }),
    date: z.string(),
    type: z.string(),
    summary: z.string(),
    details: z.string()
});

const milestoneSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters" }),
    date: z.string(),
    description: z.string().optional()
});

const page = ({ params }: { params: { viewcases: string } }) => {
    const [caseData, setCaseData] = useState<Cases | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    type Expense = NonNullable<Cases['expenses']>[number];

    const eventForm = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: "",
            date: "",
            description: ""
        },
    });

    const documentForm = useForm<z.infer<typeof documentSchema>>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            desc: ""
        },
    });

    const expenseForm = useForm<z.infer<typeof expenseSchema>>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            name: "",
            date: "",
            amount: ""
        },
    });

    const communicationForm = useForm<z.infer<typeof communicationSchema>>({
        resolver: zodResolver(communicationSchema),
        defaultValues: {
            title: "",
            date: "",
            type: "",
            summary: "",
            details: ""
        },
    });

    const milestoneForm = useForm<z.infer<typeof milestoneSchema>>({
        resolver: zodResolver(milestoneSchema),
        defaultValues: {
            title: "",
            date: "",
            description: ""
        },
    });

    const formatDate = (timestamp: Timestamp | string) => {
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate();
            const year = date.getFullYear();
            const month = (`0${date.getMonth() + 1}`).slice(-2);
            const day = (`0${date.getDate()}`).slice(-2);

            return `${year}-${month}-${day}`;
        }

        // Handle string dates
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchCase = async () => {
            if (!params.viewcases) {
                setLoading(false)
                return
            }

            try {
                const casesDoc = doc(db, 'Cases', params.viewcases);
                const casesSnapshot: DocumentSnapshot = await getDoc(casesDoc);

                if (casesSnapshot.exists()) {
                    const casesData = casesSnapshot.data() as Cases;
                    casesData.id = casesSnapshot.id;

                    console.log(casesData.id)
                    setCaseData(casesData);
                } else {
                    // router.push('/cases/view'); // Redirect to clients list if client not found
                }
            } catch (error) {
                console.error("Error fetching Case: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCase()
    }, [params.viewcases, router])

    async function onEventSubmit(values: z.infer<typeof eventSchema>) {
        try {
            setIsSubmitting(true)

            const docRef = doc(db, 'Cases', params.viewcases);

            const newEvent = {
                ...values,
                createdAt: new Date().toISOString()
            };

            await updateDoc(docRef, {
                events: arrayUnion(newEvent)
            });

            if (caseData) {
                setCaseData({
                    ...caseData,
                    events: [...(caseData.events || []), newEvent]
                });
            }

            added()

        } catch (error) {
            console.error("Failed to submit event", error);

            errorMsg()
        } finally {
            setIsSubmitting(false);
            eventForm.reset();
        }
    }

    async function onDocumentSubmit(values: z.infer<typeof documentSchema>) {
        const { desc, file } = values;

        try {
            setIsSubmitting(true)

            const storageRef = ref(storage, `documents/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const docRef = doc(db, 'Cases', params.viewcases);

            const newDocument = {
                desc,
                file: downloadURL
            };

            await updateDoc(docRef, {
                documents: arrayUnion(newDocument)
            });

            if (caseData) {
                setCaseData({
                    ...caseData,
                    documents: [...(caseData.documents || []), newDocument]
                });
            }

            added()

        } catch (error) {
            console.error("Failed to submit Document", error);

            errorMsg()
        } finally {
            setIsSubmitting(false);
            documentForm.reset();
        }
    }

    async function onExpenseSubmit(values: z.infer<typeof expenseSchema>) {
        try {
            setIsSubmitting(true);

            const docRef = doc(db, 'Cases', params.viewcases);

            const newExpense: Expense = {
                name: values.name,
                date: values.date,
                amount: values.amount,
                id: ''
            };

            await updateDoc(docRef, {
                expenses: arrayUnion(newExpense)
            });

            // Update local state if needed
            if (caseData) {
                setCaseData({
                    ...caseData,
                    expenses: [...(caseData.expenses || []), newExpense]
                });
            }

            added();
            expenseForm.reset();

        } catch (error) {
            console.error("Failed to submit Expense", error);
            errorMsg();
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onCommunicationSubmit(values: z.infer<typeof communicationSchema>) {
        try {
            setIsSubmitting(true);

            const docRef = doc(db, 'Cases', params.viewcases);

            const newCommunication = {
                ...values
            };

            await updateDoc(docRef, {
                communications: arrayUnion(newCommunication)
            });

            // Update local state if needed
            if (caseData) {
                setCaseData({
                    ...caseData,
                    communications: [...(caseData.communications || []), newCommunication]
                });
            }

            added();
            communicationForm.reset();

        } catch (error) {
            console.error("Failed to submit Communication", error);
            errorMsg();
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onMilestoneSubmit(values: z.infer<typeof milestoneSchema>) {
        try {
            setIsSubmitting(true);

            const docRef = doc(db, 'Cases', params.viewcases);

            const newMilestone = {
                ...values
            };

            await updateDoc(docRef, {
                milestones: arrayUnion(newMilestone)
            });

            // Update local state if needed
            if (caseData) {
                setCaseData({
                    ...caseData,
                    milestones: [...(caseData.milestones || []), newMilestone]
                });
            }

            added();
            milestoneForm.reset();

        } catch (error) {
            console.error("Failed to submit Milestone", error);
            errorMsg();
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='dash-back flex flex-col justify-center align-middle items-center'>
            <motion.div
                className="flex flex-col place-items-center gap-6 py-10 px-10 my-[4%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px] w-[80%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <CardHeader className='w-full'>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold flex flex-row justify-between align-middle items-center w-full'>
                        <h1>Case Management</h1>
                        <Button asChild>
                            <Link href="/">{caseData?.caseStatus || 'Active'}</Link>
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 w-[70%]">
                    <Card className='w-full flex flex-col justify-center items-start py-5'>
                        <CardContent>
                            <div className='flex flex-col justify-center items-start align-middle'>
                                <h1 className='font-bold text-base md:text-lg lg:text-xl py-2'>
                                    {caseData?.caseName || 'Untitled Case'}
                                </h1>
                                <h3 className='font-medium text-base md:text-lg lg:text-xl pb-3'>
                                    Case #{caseData?.caseNumber || 'N/A'} - {caseData?.practiceArea || 'N/A'}
                                </h3>
                            </div>

                            <div className='flex flex-col justify-center items-start align-middle'>
                                <h3 className='text-base md:text-lg lg:text-xl py-2'>
                                    <strong>Assigned Attorney:</strong> {caseData?.attorneyName || 'N/A'}
                                </h3>
                                <h3 className='text-base md:text-lg lg:text-xl pb-2'>
                                    <strong>Client:</strong> {caseData?.clientName || 'N/A'}
                                </h3>
                                <h3 className='text-base md:text-lg lg:text-xl pb-3'>
                                    <strong>Filed Date:</strong> {caseData?.instructionsDate ? formatDate(caseData?.instructionsDate) : 'N/A'}
                                </h3>
                            </div>

                            <div className='flex flex-col justify-center items-start align-middle pt-3'>
                                <p className='text-justify'>
                                    {caseData?.caseDescription || 'No description available'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>

                <CardContent className="grid gap-4 w-[70%]">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="communication">Communication</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>
                                        Case Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className='flex flex-col justify-center align-middle items-start w-full'>
                                        <div className='w-full'>
                                            <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                                Upcoming Events
                                            </h1>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Event Title</TableHead>
                                                        <TableHead>Event Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {caseData?.events?.map((event, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{event.title}</TableCell>
                                                            <TableCell>{formatDate(event.date)}</TableCell>
                                                        </TableRow>
                                                    )) || (
                                                            <TableRow>
                                                                <TableCell colSpan={2}>No upcoming events</TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>

                                            {/* Add Events */}
                                            <div className='py-5'>
                                                <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                                    Add Events
                                                </h1>
                                                <Form {...eventForm}>
                                                    <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-8">
                                                        {/* Title */}
                                                        <FormField
                                                            control={eventForm.control}
                                                            name="title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Event Title" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Date */}
                                                        <FormField
                                                            control={eventForm.control}
                                                            name="date"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="date" placeholder="Event Date" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Description */}
                                                        <FormField
                                                            control={eventForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Event Description" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <Button type="submit">Submit</Button>
                                                    </form>
                                                </Form>

                                            </div>
                                        </div>

                                        <div className='w-full'>
                                            <h1 className='text-lg md:text-xl lg:text-2xl py-3 font-bold'>
                                                Upcoming Milestones
                                            </h1>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Milestone Title</TableHead>
                                                        <TableHead>Milestone Date</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {caseData?.milestones?.map((milestone, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{milestone.title}</TableCell>
                                                            <TableCell>{formatDate(milestone.date)}</TableCell>
                                                        </TableRow>
                                                    )) || (
                                                            <TableRow>
                                                                <TableCell colSpan={2}>No upcoming milestones</TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>

                                            {/* Add Milstones */}
                                            <div className='py-5'>
                                                <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                                    Add Milstones
                                                </h1>
                                                <Form {...milestoneForm}>
                                                    <form onSubmit={milestoneForm.handleSubmit(onMilestoneSubmit)} className="space-y-8">
                                                        {/* Title */}
                                                        <FormField
                                                            control={milestoneForm.control}
                                                            name="title"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Milestone Title" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Date */}
                                                        <FormField
                                                            control={milestoneForm.control}
                                                            name="date"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input type="date" placeholder="Milestone Date" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        {/* Description */}
                                                        <FormField
                                                            control={milestoneForm.control}
                                                            name="description"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input placeholder="Milestone Description" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <Button type="submit">Submit</Button>
                                                    </form>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>
                                        Case Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Document Description</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {caseData?.documents?.map((doc, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{doc.desc}</TableCell>
                                                    <TableCell>
                                                        <Button asChild>
                                                            <Link href={doc.file} target="_blank" rel="noopener noreferrer">View</Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) || (
                                                    <TableRow>
                                                        <TableCell colSpan={2}>No documents available</TableCell>
                                                    </TableRow>
                                                )}
                                        </TableBody>
                                    </Table>

                                    {/* Add Docs */}
                                    <div className='py-5'>
                                        <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                            Add Documents
                                        </h1>
                                        <Form {...documentForm}>
                                            <form onSubmit={documentForm.handleSubmit(onDocumentSubmit)} className="space-y-8">

                                                {/* Description */}
                                                <FormField
                                                    control={documentForm.control}
                                                    name="desc"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Document Description" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* File Upload */}
                                                <FormField
                                                    control={documentForm.control}
                                                    name="file"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button type="submit">Submit</Button>
                                            </form>
                                        </Form>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="communication">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>
                                        Communication Logs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Communication Title</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Summary</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {caseData?.communications?.map((comm, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{comm.title}</TableCell>
                                                    <TableCell>{formatDate(comm.date)}</TableCell>
                                                    <TableCell>{comm.type}</TableCell>
                                                    <TableCell>{comm.summary}</TableCell>
                                                    <TableCell>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline">See More</Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full">
                                                                <div>{comm.details}</div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </TableCell>
                                                </TableRow>
                                            )) || (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>No communication logs available</TableCell>
                                                    </TableRow>
                                                )}
                                        </TableBody>
                                    </Table>

                                    {/* Add Comm */}
                                    <div className='py-5'>
                                        <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                            Add Communication Logs
                                        </h1>
                                        <Form {...communicationForm}>
                                            <form onSubmit={communicationForm.handleSubmit(onCommunicationSubmit)} className="space-y-8">
                                                {/* Title */}
                                                <FormField
                                                    control={communicationForm.control}
                                                    name="title"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Communication Title" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Date */}
                                                <FormField
                                                    control={communicationForm.control}
                                                    name="date"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="date" placeholder="Communication Date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Type */}
                                                <FormField
                                                    control={communicationForm.control}
                                                    name="type"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Communication Type" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Summary */}
                                                <FormField
                                                    control={communicationForm.control}
                                                    name="summary"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Summary" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Details */}
                                                <FormField
                                                    control={communicationForm.control}
                                                    name="details"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Details" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button type="submit">Submit</Button>
                                            </form>
                                        </Form>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="expenses">
                            <Card className='py-10'>
                                <CardHeader>
                                    <CardTitle className='text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>
                                        Case Expenses
                                    </CardTitle>
                                    <CardDescription className='text-base md:text-lg lg:text-xl pb-3'>
                                        Case Expense History
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Expense Name</TableHead>
                                                <TableHead>Payment Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Balance</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {caseData?.expenses && caseData.expenses.length > 0 ? (
                                                (() => {
                                                    // Initialize the running balance with the expected expense
                                                    let runningBalance = parseFloat(caseData.expectedExpense ?? "0");

                                                    return caseData.expenses.map((expense, index) => {
                                                        // Calculate the balance after each expense deduction
                                                        runningBalance -= parseFloat(expense.amount);

                                                        return (
                                                            <TableRow key={index}>
                                                                <TableCell>{expense.name}</TableCell>
                                                                <TableCell>{formatDate(expense.date)}</TableCell>
                                                                <TableCell>{expense.amount}</TableCell>
                                                                <TableCell>{runningBalance}</TableCell>
                                                            </TableRow>
                                                        );
                                                    });
                                                })()
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4}>No expenses recorded</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Add Expenses */}
                                    <div className='py-5'>
                                        <h1 className='text-lg md:text-xl lg:text-2xl pb-3 font-bold'>
                                            Add Expenses
                                        </h1>
                                        <Form {...expenseForm}>
                                            <form onSubmit={expenseForm.handleSubmit(onExpenseSubmit)} className="space-y-8">
                                                {/* Name */}
                                                <FormField
                                                    control={expenseForm.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Expense Name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Date */}
                                                <FormField
                                                    control={expenseForm.control}
                                                    name="date"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="date" placeholder="Expense Date" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Amount */}
                                                <FormField
                                                    control={expenseForm.control}
                                                    name="amount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input placeholder="Expense Amount" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button type="submit">Submit</Button>
                                            </form>
                                        </Form>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </motion.div>

            <Toaster />
        </div>
    )
}

export default page
