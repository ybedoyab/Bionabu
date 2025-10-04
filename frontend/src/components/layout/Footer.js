import React from 'react';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-primary" />
        <span className="font-geist font-medium">NASA Space Biology Research Hub</span>
      </div>
      <div className="text-sm text-base-content/60">
        Powered by AI analysis of NASA bioscience research data
      </div>
    </motion.footer>
  );
};

export default Footer;
