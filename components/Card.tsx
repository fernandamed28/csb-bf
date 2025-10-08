"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CardProps {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  idx?: number;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, subtitle, icon, link, idx = 0, onClick }) => {
  return (
    <Link href={link}>
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0.7, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: idx * 0.1 }}
        className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition-all duration-300 text-center"
      >
        <Image src={icon} width={48} height={48} alt={title} />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-500 text-sm">{subtitle}</p>
      </motion.div>
    </Link>
  );
};

export default Card;
