import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHOTOS = ['/iggy1-nobg.png', '/iggy2-nobg.png', '/iggy3-nobg.png', '/iggy4-nobg.png'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ItalianGreyhound({ show, onDismiss }) {
  const bagRef = useRef([]);
  const [photo, setPhoto] = useState(PHOTOS[0]);

  // preload so the first pop-up isn't blank
  useEffect(() => {
    PHOTOS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    if (bagRef.current.length === 0) {
      bagRef.current = shuffle(PHOTOS);
      // avoid showing the same photo twice in a row across reshuffles
      if (bagRef.current[bagRef.current.length - 1] === photo && bagRef.current.length > 1) {
        [bagRef.current[0], bagRef.current[bagRef.current.length - 1]] = [
          bagRef.current[bagRef.current.length - 1],
          bagRef.current[0],
        ];
      }
    }
    setPhoto(bagRef.current.pop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

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
              className="absolute -top-2 right-2 text-3xl z-10"
            >
              💕
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 0, x: 0 }}
              animate={{ opacity: [0, 1, 0], y: -52, x: 20 }}
              transition={{ duration: 1.1, repeat: Infinity, delay: 0.35 }}
              className="absolute top-2 -left-4 text-2xl z-10"
            >
              ✨
            </motion.span>

            {/* Cutout photo */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <img
                src={photo}
                alt="Iggy"
                className="h-52 sm:h-64 w-auto object-contain drop-shadow-2xl pointer-events-auto cursor-pointer select-none"
                draggable={false}
                onClick={onDismiss}
              />
            </motion.div>

            {/* Tiny caption */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-2 text-base font-extrabold text-pastel-coral drop-shadow-sm"
            >
              Молодец! 🎉
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
