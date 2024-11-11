'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, DocumentSnapshot, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Cases } from '@/lib'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast, { Toaster } from 'react-hot-toast'

const page = ({ params }: { params: { editCase: string } }) => {
    const [innerCase, setInnerCase] = useState<Cases | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchCase = async () => {
            console.log("Params:", params)
            if (!params.editCase) {
                setLoading(false)
                return
            }

            try {
                const caseDoc = doc(db, 'Cases', params.editCase);
                const caseSnapshot: DocumentSnapshot = await getDoc(caseDoc);

                if (caseSnapshot.exists()) {
                    const innerCase = caseSnapshot.data() as Cases;
                    innerCase.id = caseSnapshot.id;
                    setInnerCase(innerCase);
                } else {
                    // router.push('/cases'); // Redirect to cases list if case not found
                }
            } catch (error) {
                console.error("Error fetching Case: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCase()
    }, [params.editCase, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!innerCase) {
        return <div>Case not found</div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!innerCase) return

        try {
            await updateDoc(doc(db, 'Cases', innerCase.id), {
                caseNumber: innerCase.caseNumber,
                caseName: innerCase.caseName,
                courtName: innerCase.courtName,
                caseDescription: innerCase.caseDescription,
                caseSummary: innerCase.caseSummary,
                expectedExpense: innerCase.expectedExpense,
            })
            toast.success('Case updated successfully')
            router.push('/cases/view')
        } catch (error) {
            console.error("Error updating case: ", error)
            toast.error('Failed to update case')
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!innerCase) {
        return <div>Case not found</div>
    }

    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-11/12 md:w-5/6'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Edit case</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Case Number */}
                        <div>
                            <Label htmlFor="caseNumber">Case Number</Label>
                            <Input
                                id="caseNumber"
                                value={innerCase.caseNumber}
                                onChange={(e) => setInnerCase({ ...innerCase, caseNumber: e.target.value })}
                                required
                            />
                        </div>

                        {/* Case Name */}
                        <div>
                            <Label htmlFor="caseName">Case Name</Label>
                            <Input
                                id="caseName"
                                value={innerCase.caseName}
                                onChange={(e) => setInnerCase({ ...innerCase, caseName: e.target.value })}
                                required
                            />
                        </div>

                        {/* Court Name */}
                        <div>
                            <Label htmlFor="courtName">Court Name</Label>
                            <Input
                                id="courtName"
                                value={innerCase.courtName}
                                onChange={(e) => setInnerCase({ ...innerCase, courtName: e.target.value })}
                                required
                            />
                        </div>

                        {/* Case Description */}
                        <div>
                            <Label htmlFor="caseDescription">Case Description</Label>
                            <Input
                                id="caseDescription"
                                value={innerCase.caseDescription}
                                onChange={(e) => setInnerCase({ ...innerCase, caseDescription: e.target.value })}
                                required
                            />
                        </div>

                        {/* Case Summary */}
                        <div>
                            <Label htmlFor="caseSummary">Case Summary</Label>
                            <Input
                                id="caseSummary"
                                value={innerCase.caseSummary}
                                onChange={(e) => setInnerCase({ ...innerCase, caseSummary: e.target.value })}
                                required
                            />
                        </div>

                        {/* Expected Expense */}
                        <div>
                            <Label htmlFor="expectedExpense">Expected Expense</Label>
                            <Input
                                id="expectedExpense"
                                type="number"
                                value={innerCase.expectedExpense}
                                onChange={(e) => setInnerCase({ ...innerCase, expectedExpense: e.target.value })}
                                required
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" variant="outline" onClick={() => router.push('/cases')}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    )
}

export default page
