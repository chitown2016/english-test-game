import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const variants = {
    primary: 'bg-pastel-coral text-white shadow-glow hover:bg-pastel-coral/90',
    secondary: 'bg-pastel-lavender text-ink hover:bg-pastel-lavender/80',
    success: 'bg-pastel-softgreen text-ink hover:bg-pastel-softgreen/80',
    danger: 'bg-pastel-softred text-white hover:bg-pastel-softred/90',
    ghost: 'bg-transparent text-ink hover:bg-black/5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-2xl',
    md: 'px-6 py-3 text-base rounded-3xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      disabled={disabled}
      className={`
        font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-soft p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProgressBar({ value, max, className = '' }) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className={`w-full bg-pastel-lavender/50 rounded-full h-4 overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-pastel-coral to-pastel-peach rounded-full"
      />
    </div>
  );
}
