import { motion } from 'motion/react';

const Footer = () => {
  return (
    <motion.footer 
      className="footer footer-center py-6 lg:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div>
        <p className="text-sm lg:text-base text-base-content/60 font-geist">
          Powered by NASA Bioscience Research Archives
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;