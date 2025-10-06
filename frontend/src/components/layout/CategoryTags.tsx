import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const CategoryTags = () => {
  const navigate = useNavigate();

  // Mapeo de categorías a términos de búsqueda específicos
  const categoryMap = {
    'Humans': 'human spaceflight bone loss muscle atrophy',
    'Plants': 'plant growth microgravity Arabidopsis space biology',
    'Microbiology': 'microbes bacteria space environment ISS',
    'Radiation': 'radiation effects space cosmic rays DNA damage',
    'Technology': 'space technology biotechnology life support systems',
    'Mice': 'mice spaceflight rodent studies microgravity',
    'Space': 'space biology research NASA missions'
  };

  const categories = Object.keys(categoryMap);

  const handleCategoryClick = (category: string) => {
    const searchQuery = categoryMap[category as keyof typeof categoryMap];
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
      {categories.map((category, index) => (
        <motion.button
          key={category}
          className="btn btn-soft btn-primary btn-sm lg:btn-md font-geist"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryTags;