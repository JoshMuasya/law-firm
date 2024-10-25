"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Check, ChevronsUpDown, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import toast, { Toaster } from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { DocumentInterface, FormDataInterface } from '@/lib'
import { db } from '@/lib/firebase'

const errorCase = () => toast('Failed to Add Case!!! Try Again!!!');
const added = () => toast('Case Added Successfully!!!');

const practiceAreas = [
    { value: "criminal", label: "Criminal" },
    { value: "civil", label: "Civil" },
    { value: "family", label: "Family Law" },
    { value: "corporate", label: "Corporate Law" },
];

const caseStatuses = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
];

const formSchema = z.object({
    caseNumber: z.string().min(1, { message: 'Case number is required' }),
    caseName: z.string().min(1, { message: 'Case name is required' }),
    clientName: z.string().min(1, { message: 'Client name is required' }),
    attorneyName: z.string().min(1, { message: 'Attorney name is required' }),
    courtName: z.string().min(1, { message: 'Court name is required' }),

    practiceArea: z.enum(['civil', 'criminal', 'corporate', 'family', 'property'], {
        required_error: 'Practice area is required'
    }),

    caseStatus: z.enum(['active', 'pending', 'closed', 'appeal'], {
        required_error: 'Case status is required'
    }),

    instructionsDate: z.string().min(1, { message: 'Instructions date is required' }),

    caseDescription: z.string().max(500, { message: 'Description is too long' }).optional(),
    caseSummary: z.string().max(500, { message: 'Summary is too long' }).optional(),

    expenses: z.array(
        z.object({
            description: z.string().min(1, { message: 'Expense description is required' }),
            amount: z.number().positive({ message: 'Amount must be a positive number' })
        })
    ).optional(),

    documents: z.array(
        z.object({
            file: z.any().optional(),
            description: z.string().min(1, { message: 'Document description is required' }),
        })
    ).optional(),
});

const page = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [openPracticeArea, setOpenPracticeArea] = useState(false)
    const [openCaseStatus, setOpenCaseStatus] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState("")
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedPracticeArea, setSelectedPracticeArea] = useState<string | null>(null);
    const [selectedCaseStatus, setSelectedCaseStatus] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caseNumber: '',
            caseName: '',
            clientName: '',
            attorneyName: '',
            courtName: '',
            practiceArea: 'civil',
            caseStatus: 'active',
            caseDescription: '',
            caseSummary: '',
            instructionsDate: '',
        },
    })

    const { fields: expenseFields, append: appendExpense, remove: removeExpense } =
        useFieldArray({
            control: form.control,
            name: "expenses"
        });

    const { fields: documentFields, append: appendDocument, remove: removeDocument } =
        useFieldArray({
            control: form.control,
            name: "documents"
        });

        const uploadDocuments = async (documents: any[]) => {
            if (!documents || documents.length === 0) return [];
            
            const storage = getStorage();
            const uploadPromises = documents.map(async (doc) => {
                if (!doc.file) return null;
    
                const fileRef = ref(storage, `cases/${form.getValues().caseNumber}/documents/${doc.file.name}`);
                await uploadBytes(fileRef, doc.file);
                const downloadURL = await getDownloadURL(fileRef);
    
                return {
                    fileName: doc.file.name,
                    fileUrl: downloadURL,
                    description: doc.description,
                };
            });
    
            const results = await Promise.all(uploadPromises);
            return results.filter(result => result !== null);
        };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            const uploadedDocs = await uploadDocuments(values.documents || []);

            const caseData = {
                ...values,
                expenses: values.expenses || [],
                documents: uploadedDocs,
            };

            const casesRef = collection(db, "Cases");
            await addDoc(casesRef, caseData);

            added();
            form.reset();
            router.push('/cases/view');
            
        } catch (error) {
            errorCase();
            console.error("Error adding case:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-full py-5'>
            <Card className='w-11/12 md:w-3/4 lg:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add Cases</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Fill in the Form to Add a Case</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="caseNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Case Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="caseName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Case Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="clientName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Client Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="attorneyName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Attorney Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="courtName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Court Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="practiceArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Practice Area</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select practice area" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="civil">Civil</SelectItem>
                                                    <SelectItem value="criminal">Criminal</SelectItem>
                                                    <SelectItem value="corporate">Corporate</SelectItem>
                                                    <SelectItem value="family">Family</SelectItem>
                                                    <SelectItem value="property">Property</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="caseStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Case Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select case status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="closed">Closed</SelectItem>
                                                    <SelectItem value="appeal">Appeal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="instructionsDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instructions Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="caseDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Case Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="caseSummary"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Case Summary</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Expenses</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendExpense({ description: '', amount: 0 })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Expense
                                    </Button>
                                </div>

                                {expenseFields.map((field, index) => (
                                    <Card key={field.id} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`expenses.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`expenses.${index}.amount`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Amount</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => removeExpense(index)}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </Card>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Documents</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendDocument({ file: null, description: '' })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Document
                                    </Button>
                                </div>

                                {documentFields.map((field, index) => (
                                    <Card key={field.id} className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`documents.${index}.file`}
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <FormItem>
                                                        <FormLabel>File</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="file"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        onChange(e.target.files[0]);
                                                                    }
                                                                }}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`documents.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2"
                                            onClick={() => removeDocument(index)}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Remove
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}

export default page
