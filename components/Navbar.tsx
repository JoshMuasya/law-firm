"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const menuItems = [
    { name: "Cases", path: "/cases" },
    { name: "Clients", path: "/clients" },
    { name: "Finances", path: "/finances" },
    { name: "Events", path: "/events" },
];

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* Top Menu Bar */}
      <motion.nav
        className="flex justify-center bg-gray-800 dark:bg-gray-200 py-3 shadow-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {menuItems.map((item, index) => (
          <Link key={index} href={item.path}>
            <motion.div
              onClick={() => setActiveIndex(index)}
              className={`mx-4 px-4 py-2 cursor-pointer transition ${
                activeIndex === index ? "text-blue-400" : "text-gray-300 dark:text-gray-700"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {item.name}
            </motion.div>
          </Link>
        ))}
      </motion.nav>
    </div>
  );
};

export default Navbar;
