import { motion } from 'motion/react';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '../layout/SearchBar';
import ThemeToggle from '../layout/ThemeToggle';
import logoClaro from '../../assets/logo_claro.png';
import logoOscuro from '../../assets/logo_oscuro.png';

const SearchNavbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentTheme, setCurrentTheme] = useState('default');
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'default';
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

  const logoSrc = currentTheme === 'dark' ? logoClaro : logoOscuro;

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="bg-base-100 border-b border-base-300"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="navbar px-4 lg:px-6 py-3">
        <div className="navbar-start gap-4 flex-1">
          <motion.button 
            onClick={handleLogoClick}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img 
              src={logoSrc} 
              alt="BioNabu Logo" 
              className="h-8 lg:h-10 w-auto"
            />
          </motion.button>
          
          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <SearchBar onSearch={handleSearch} defaultValue={query} isAIEnabled={true} />
          </div>
        </div>

        <div className="navbar-end gap-2">
          <button className="btn btn-ghost btn-circle btn-sm">
            <Settings className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <SearchBar onSearch={handleSearch} defaultValue={query} isAIEnabled={true} />
      </div>
    </motion.div>
  );
};

export default SearchNavbar;