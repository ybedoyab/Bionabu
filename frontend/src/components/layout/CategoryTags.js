import React from 'react';
import { motion } from 'motion/react';

const CategoryTags = ({ onCategorySelect }) => {
  const categories = [
    { name: 'Humans', query: 'human spaceflight biology' },
    { name: 'Plants', query: 'plant biology space' },
    { name: 'Microbiology', query: 'microorganisms space' },
    { name: 'Radiation', query: 'radiation effects space' },
    { name: 'Technology', query: 'biotechnology space research' }
  ];

  const handleCategoryClick = (query) => {
    if (onCategorySelect) {
      onCategorySelect(query);
    }
  };

  return (
    <>
      {categories.map((category, index) => (
        <motion.button
          key={category.name}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-full transition-all duration-300 font-geist border border-primary/20 hover:border-primary/40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(category.query)}
        >
          {category.name}
        </motion.button>
      ))}
    </>
  );
};

export default CategoryTags;
