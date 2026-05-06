import { motion } from "framer-motion";

const baseTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1]
};

const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 32,
  scale = 1,
  amount = 0.2,
  ...rest
}) => {
  const initial = {
    opacity: 0,
    y,
    scale: scale === 1 ? 1 : scale
  };

  return (
    <motion.div
      {...rest}
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ ...baseTransition, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
