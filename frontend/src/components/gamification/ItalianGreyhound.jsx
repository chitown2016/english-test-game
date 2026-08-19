import { motion, AnimatePresence } from 'framer-motion';

export function ItalianGreyhound({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -30 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-20 z-30 pointer-events-none flex justify-center"
        >
          <div className="relative">
            {/* Floating hearts */}
            <motion.span
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -44, x: -24 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="absolute -top-2 -right-2 text-2xl z-10"
            >
              💕
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -52, x: 20 }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.35 }}
              className="absolute top-0 -left-4 text-xl z-10"
            >
              ✨
            </motion.span>

            {/* Photo bubble */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-br from-pastel-pink via-pastel-lavender to-pastel-peach shadow-glow"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                <img
                  src="/iggy.png"
                  alt="Iggy"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </motion.div>

            {/* Tiny caption */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-2 text-sm font-extrabold text-pastel-coral drop-shadow-sm"
            >
              Молодец! 🎉
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
