"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
    { name: "Cases", path: "/cases" },
    { name: "Clients", path: "/clients" },
    { name: "Finances", path: "/finances" },
    { name: "Events", path: "/events" },
];

export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="flex flex-col h-screen">
            {/* Main Content */}
            <motion.div
                className="grid grid-rows-2 grid-flow-col place-items-center gap-6 py-10 px-20 my-[10%] bg-gradient-to-br from-cyan-400 via-white/30 to-blue-800 backdrop-blur-lg bg-opacity-20 shadow-xl border border-white/20 h-full rounded-tr-[48px] rounded-bl-[48px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {menuItems.map((item, index) => (
                    <Link key={index} href={item.path} className="">
                        <motion.div
                            className="w-64 h-40 flex items-center justify-center bg-gray-700 rounded-lg shadow-lg cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            {item.name}
                        </motion.div>
                    </Link>
                ))}
            </motion.div>
        </div>

    );
}
