import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { IoBriefcase } from "react-icons/io5";
import { IoMdBriefcase } from "react-icons/io";
import { FaSuitcase } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBriefcaseMedical } from "react-icons/fa";
import { MdSystemUpdateAlt } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

const page = () => {
  return (
    <div>
      {/* Top */}
      <div className='flex flex-row justify-between items-center align-middle px-5 md:px-10 pt-5 md:pt-10'>
        {/* Title */}
        <div>
          <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold'>
            Dashboard
          </h1>
        </div>

        {/* Links */}
        <div className='flex flex-row justify-between items-center align-middle'>
          {/* Messages */}
          <div className='mx-3 md:mx-10'>
            <Button asChild variant={"outline"} className='border-primary'>
              <Link href="/login" className='text-primary font-semibold text-base md:text-xl md:p-5 lg:text-2xl lg:p-6'>Messages</Link>
            </Button>
          </div>

          {/* Settings */}
          <div>
            <Button asChild variant={"outline"} className='border-primary'>
              <Link href="/login" className='text-primary font-semibold text-base md:text-xl md:p-5 lg:text-2xl lg:p-6'>Settings</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* OverView Cards */}
      <div>
        {/* Cases */}
        <div className='px-3 md:px-10 py-5 md:py-10'>
          <Card>
            <Link href='/cases'>
              <CardContent className='flex flex-row justify-around items-center align-middle py-5'>
                {/* Active */}
                <div className='px-3 flex flex-col justify-center items-center align-middle'>
                  {/* Title */}
                  <div>
                    <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                      Active Cases
                    </h1>
                  </div>

                  {/* Icon */}
                  <div className='py-5'>
                    <IoBriefcase className='text-xl md:text-2xl lg:text-3xl' />
                  </div>

                  {/* Number */}
                  <div>
                    <p className='font-semibold text-base md:text-lg lg:text-xl'>
                      24
                    </p>
                  </div>
                </div>

                {/* Closed */}
                <div className='px-3 flex flex-col justify-center items-center align-middle'>
                  {/* Title */}
                  <div>
                    <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                      Closed Cases
                    </h1>
                  </div>

                  {/* Icon */}
                  <div className='py-5'>
                    <IoMdBriefcase className='text-xl md:text-2xl lg:text-3xl' />
                  </div>

                  {/* Number */}
                  <div>
                    <p className='font-semibold text-base md:text-lg lg:text-xl'>
                      10
                    </p>
                  </div>
                </div>

                {/* Pending */}
                <div className='px-3 flex flex-col justify-center items-center align-middle'>
                  {/* Title */}
                  <div>
                    <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                      Pending Cases
                    </h1>
                  </div>

                  {/* Icon */}
                  <div className='py-5'>
                    <FaSuitcase className='text-xl md:text-2xl lg:text-3xl' />
                  </div>

                  {/* Number */}
                  <div>
                    <p className='font-semibold text-base md:text-lg lg:text-xl'>
                      5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Clients */}
        <div className='px-3 md:px-10 py-5 md:py-10'>
          <Card>
            <Link href='/clients'>
              <CardContent className='flex flex-row justify-around items-center align-middle py-5'>
                {/* Total Clients */}
                <div className='px-3 flex flex-col justify-center items-center align-middle'>
                  {/* Title */}
                  <div>
                    <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                      Total Clients
                    </h1>
                  </div>

                  {/* Icon */}
                  <div className='py-5'>
                    <FaUserFriends className='text-xl md:text-2xl lg:text-3xl' />
                  </div>

                  {/* Number */}
                  <div>
                    <p className='font-semibold text-base md:text-lg lg:text-xl'>
                      30
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className='px-3 md:px-10 py-5 md:py-10'>
          <Card>
            <CardHeader className='flex flex-col justify-center align-middle items-center'>
              <h1 className='font-bold text-base md:text-xl lg:text-2xl text-center'>
                Upcoming Events
              </h1>
              <FaCalendarAlt className='text-xl md:text-2xl lg:text-3xl' />
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-start align-middle py-5'>
              {/* Event 1 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 1
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    24/09/2024
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 2
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    30/09/2024
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 3
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    05/10/2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className='px-3 md:px-10 py-5 md:py-10'>
          <Card className='flex flex-col justify-center align-middle items-center'>
            <div className='lg:w-4/5 '>
              <CardHeader>
                <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                  Quick Actions
                </h1>
              </CardHeader>
              <CardContent className='flex flex-col justify-center items-start align-middle py-5'>
                {/* Add Client */}
                <div className='w-full pb-3 md:pb-5'>
                  <Button asChild className='w-full' variant={"default"}>
                    <Link href="/">
                      <FaUserFriends className="mr-2 h-4 w-4" />
                      Add Client
                    </Link>
                  </Button>
                </div>

                {/* Add Cases */}
                <div className='w-full pb-3 md:pb-5'>
                  <Button asChild className='w-full' variant={"default"}>
                    <Link href="/">
                      <FaBriefcaseMedical className="mr-2 h-4 w-4" />
                      Add Case
                    </Link>
                  </Button>
                </div>

                {/* Update Case */}
                <div className='w-full pb-3 md:pb-5'>
                  <Button asChild className='w-full' variant={"default"}>
                    <Link href="/">
                      <MdSystemUpdateAlt className="mr-2 h-4 w-4" />
                      Update Case
                    </Link>
                  </Button>
                </div>

                {/* Upload Document */}
                <div className='w-full pb-3 md:pb-5'>
                  <Button asChild className='w-full' variant={"default"}>
                    <Link href="/">
                      <FaCloudUploadAlt className="mr-2 h-4 w-4" />
                      Add Document
                    </Link>
                  </Button>
                </div>

                {/* Finances */}
                <div className='w-full pb-3 md:pb-5'>
                  <Button asChild className='w-full' variant={"default"}>
                    <Link href="/">
                      <MdOutlineAttachMoney className="mr-2 h-4 w-4" />
                      Finances
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <div className='px-3 md:px-10 py-5 md:py-10'>
          <Card>
            <CardHeader className='flex flex-col justify-center align-middle items-center'>
              <h1 className='font-bold text-base md:text-xl lg:text-2xl text-center'>
                Upcoming Deadlines
              </h1>
              <FaCalendarAlt className='text-xl md:text-2xl lg:text-3xl' />
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-start align-middle py-5'>
              {/* Event 1 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 1
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    24/09/2024
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 2
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    30/09/2024
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className='w-full px-3 pb-5 flex flex-row justify-between items-center align-middle'>
                {/* Title */}
                <div>
                  <h1 className='font-bold text-base md:text-xl lg:text-2xl'>
                    Event 3
                  </h1>
                </div>

                {/* Date */}
                <div>
                  <p className='font-semibold text-base md:text-lg lg:text-xl'>
                    05/10/2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default page
