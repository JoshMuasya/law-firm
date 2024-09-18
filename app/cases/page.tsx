import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ImBriefcase } from "react-icons/im";
import { RiBriefcase4Fill } from "react-icons/ri";

const page = () => {
    return (
        <div className='bg-muted flex flex-col justify-center items-center align-middle w-full h-screen'>
            <Card className='w-3/4 md:w-3/4 lg:w-1/2'>
                <CardHeader>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add or View Cases</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3'>Total Cases: <strong>30</strong></CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {/* Add Case */}
                    <div className='w-full pb-3 md:pb-5'>
                        <Button asChild className='w-full' variant={"default"}>
                            <Link href="/cases/add">
                                <RiBriefcase4Fill className="mr-2 h-4 w-4" />
                                Add Case
                            </Link>
                        </Button>
                    </div>

                    {/* View Cases */}
                    <div className='w-full pb-3 md:pb-5'>
                        <Button asChild className='w-full' variant={"default"}>
                            <Link href="/cases/view">
                                <ImBriefcase className="mr-2 h-4 w-4" />
                                View Cases
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page
