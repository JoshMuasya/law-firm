"use client"

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
import { motion } from "framer-motion";

const page = () => {
    return (
        <div className='dash-back flex flex-col justify-center align-middle items-center'>
            <motion.div
                className="grid grid-rows-2 grid-flow-col place-items-center gap-6 py-10 px-20 my-[10%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <CardHeader className='text-black'>
                    <CardTitle className='text-center text-2xl md:text-3xl lg:text-4xl pb-3 font-bold'>Add or View Cases</CardTitle>
                    <CardDescription className='text-center text-base md:text-lg lg:text-xl pb-3 text-black'>Total Cases: <strong>30</strong></CardDescription>
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
            </motion.div>
        </div>
    )
}

export default page
