import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// NASA-themed Loading Animation Component
const SearchLoadingAnimation = ({ onCancel }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center justify-center p-8">
        {/* Orbital System */}
        <div className="relative w-40 h-40 mb-6">
          {/* Center Core (represents Earth/research hub) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-8 h-8 -mt-4 -ml-4 bg-primary rounded-full shadow-lg"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
          </motion.div>

          {/* Orbit Ring 1 */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute top-0 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-secondary rounded-full shadow-md"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Orbit Ring 2 */}
          <motion.div
            className="absolute inset-4 border-2 border-accent/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute bottom-0 left-1/2 w-3 h-3 -ml-1.5 -mb-1.5 bg-accent rounded-full shadow-md"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </motion.div>

          {/* Orbit Ring 3 */}
          <motion.div
            className="absolute inset-8 border-2 border-info/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="absolute top-1/2 right-0 w-3 h-3 -mr-1.5 -mt-1.5 bg-info rounded-full shadow-md"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-primary mb-2">
            Analyzing Research...
          </h3>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Cancel Button */}
        <motion.button
          onClick={onCancel}
          className="btn btn-sm btn-ghost mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SearchBar = ({ onSearch, defaultValue = '', placeholder = "Search NASA bioscience experiments..." }) => {
  const [query, setQuery] = useState(defaultValue);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      setIsSearching(true);
      
      try {
        await onSearch(query);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleCancel = () => {
    setIsSearching(false);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="w-full max-w-2xl">
        <motion.div 
          className="relative flex items-center w-full search-bar-glass rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          whileFocus={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
        >
          <motion.input
            type="text"
            placeholder={placeholder}
            className="flex-1 px-6 py-4 text-base lg:text-lg bg-transparent border-0 outline-none placeholder:text-base-content/60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
          />
          
          {query && !isSearching && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-base-300 rounded-full transition-colors duration-300 mr-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Clear search"
            >
              <X className="w-5 h-5 text-base-content/60 hover:text-base-content transition-colors duration-300" />
            </motion.button>
          )}
          
          <motion.button 
            type="submit"
            className="p-3 hover:bg-base-300 rounded-full transition-colors duration-300 mr-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            aria-label="Search"
            disabled={isSearching}
          >
            <Search className={`w-5 h-5 transition-colors duration-300 ${
              isSearching ? 'text-primary animate-pulse' : 'text-base-content/60 hover:text-primary'
            }`} />
          </motion.button>
        </motion.div>
      </form>

      {/* Loading Animation Overlay */}
      <AnimatePresence>
        {isSearching && <SearchLoadingAnimation onCancel={handleCancel} />}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
