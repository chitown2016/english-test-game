import { motion, AnimatePresence } from 'framer-motion';

export function ItalianGreyhound({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-24 z-30 pointer-events-none flex justify-center"
        >
          <div className="relative w-40 h-32">
            {/* Little sparkle hearts */}
            <motion.span
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -40, x: -20 }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
              className="absolute top-0 right-6 text-xl"
            >
              💕
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -48, x: 16 }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.4 }}
              className="absolute top-2 left-8 text-lg"
            >
              ✨
            </motion.span>

            <motion.svg
              viewBox="0 0 160 120"
              className="w-full h-full drop-shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Tail */}
              <motion.g
                animate={{ rotate: [-8, 12, -8] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '118px 64px' }}
              >
                <path
                  d="M118 64 Q135 52 138 36 Q140 28 134 30 Q128 32 122 48 Q116 60 118 64"
                  fill="#E5E7EB"
                  stroke="#D1D5DB"
                  strokeWidth="1.5"
                />
              </motion.g>

              {/* Back legs */}
              <motion.g
                animate={{ rotate: [10, -10, 10] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '96px 78px' }}
              >
                <path
                  d="M96 78 L92 98 L86 102"
                  stroke="#9CA3AF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              <motion.g
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut', delay: 0.08 }}
                style={{ transformOrigin: '108px 78px' }}
              >
                <path
                  d="M108 78 L112 98 L118 102"
                  stroke="#9CA3AF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>

              {/* Body */}
              <ellipse
                cx="102"
                cy="64"
                rx="34"
                ry="14"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />

              {/* Front legs */}
              <motion.g
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '132px 78px' }}
              >
                <path
                  d="M132 78 L136 98 L142 102"
                  stroke="#D1D5DB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
              <motion.g
                animate={{ rotate: [10, -10, 10] }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut', delay: 0.08 }}
                style={{ transformOrigin: '120px 78px' }}
              >
                <path
                  d="M120 78 L116 98 L110 102"
                  stroke="#D1D5DB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>

              {/* Neck and head */}
              <path
                d="M128 58 L150 40 L158 42 L164 36 L162 50 L154 52 L146 64"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Ear */}
              <motion.path
                d="M154 42 L150 26 L158 38"
                fill="#E5E7EB"
                stroke="#D1D5DB"
                strokeWidth="1.5"
                animate={{ rotate: [-4, 6, -4] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '154px 42px' }}
              />

              {/* Eye */}
              <circle cx="156" cy="44" r="2" fill="#374151" />

              {/* Nose */}
              <circle cx="164" cy="38" r="2.5" fill="#F9A8D4" />

              {/* Collar */}
              <path
                d="M146 56 Q150 58 154 56"
                stroke="#F472B6"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
