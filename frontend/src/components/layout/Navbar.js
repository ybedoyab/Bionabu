import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ThemeToggle from './ThemeToggle';
import { Brain, Home } from 'lucide-react';

// Logo components using actual assets
const LogoClaro = () => (
  <div className="flex items-center space-x-2">
    <img 
      src="/src/assets/logo_claro.png" 
      alt="BioNabu Logo" 
      className="w-8 h-8"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div className="flex items-center space-x-2" style={{ display: 'none' }}>
      <Brain className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold font-geist">BioNabu</span>
    </div>
  </div>
);

const LogoOscuro = () => (
  <div className="flex items-center space-x-2">
    <img 
      src="/src/assets/logo_oscuro.png" 
      alt="BioNabu Logo" 
      className="w-8 h-8"
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
    <div className="flex items-center space-x-2" style={{ display: 'none' }}>
      <Brain className="w-8 h-8 text-primary" />
      <span className="text-xl font-bold font-geist">BioNabu</span>
    </div>
  </div>
);

const Navbar = ({ showHomeButton = false, onHomeClick }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(theme);
    };

    // Initial theme check
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  const logoSrc = currentTheme === 'dark' ? LogoOscuro : LogoClaro;

  return (
    <motion.header 
      className="navbar px-4 lg:px-8 py-4 relative"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient background - transparent at bottom, semi-opaque at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-100/60 via-base-100/30 to-transparent backdrop-blur-sm" />
      
      <div className="navbar-start relative z-10">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {logoSrc === LogoOscuro ? <LogoOscuro /> : <LogoClaro />}
        </motion.div>
      </div>

      <div className="navbar-end relative z-10">
        <div className="flex items-center space-x-2">
          {showHomeButton && (
            <motion.button
              onClick={onHomeClick}
              className="btn btn-ghost btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </motion.button>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
