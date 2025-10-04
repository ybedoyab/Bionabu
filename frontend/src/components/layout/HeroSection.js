import React from 'react';
import { motion } from 'motion/react';
import SearchBar from './SearchBar';
import CategoryTags from './CategoryTags';

const HeroSection = ({ onSearch, onCategorySelect }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8 py-8 lg:py-16 relative">
      {/* Background Image with Blur */}
      <div className="absolute inset-0 knowledge-hub-bg" />
      <div className="absolute inset-0 knowledge-hub-overlay" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Main Title */}
        <motion.h1 
          className="text-4xl lg:text-6xl font-bold text-primary font-geist mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Knowledge Hub
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-lg lg:text-xl text-neutral-600 font-geist mb-8 lg:mb-12 max-w-2xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explore decades of NASA bioscience research for future Moon and Mars missions.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          className="w-full max-w-2xl flex justify-center mb-8 lg:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SearchBar 
            onSearch={onSearch} 
            placeholder="Search NASA bioscience experiments..."
          />
        </motion.div>

        {/* Category Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CategoryTags onCategorySelect={onCategorySelect} />
        </motion.div>

        {/* Footer Text */}
        <motion.p 
          className="text-sm text-neutral-500 font-geist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          by NASA Bioscience Research Archive
        </motion.p>
      </div>
    </main>
  );
};

export default HeroSection;
