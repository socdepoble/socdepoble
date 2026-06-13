// src/components/UniversalCardAnimat.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
Props:
 - id, title, body, image, onLike, liked (bool), variant ('feed'|'market')
 - className
*/

const cardVariants = {
  initial: { opacity: 0, y: -12, scale: 0.995 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 700, damping: 28 } },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.28 } }
};

const likeVariants = {
  idle: { scale: 1 },
  pop: { scale: [1, 1.18, 0.96, 1], transition: { duration: 0.48, times: [0,0.35,0.7,1], ease: "easeOut" } }
};

const rippleVariants = {
  hidden: { scale: 0, opacity: 0.6 },
  show: { scale: 1.6, opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function UniversalCardAnimat({ id, title, body, image, onLike, liked=false, variant="feed", className="" }) {
  return (
    <AnimatePresence>
      <motion.article
        layout
        initial="initial"
        animate="enter"
        exit="exit"
        variants={cardVariants}
        className={`universal-card bg-white rounded-2xl p-5 shadow-sm border border-slate-200 ${className}`}
        role="article"
        aria-labelledby={`card-${id}-title`}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center text-slate-800 font-bold text-xl shadow-sm">
            {title?.slice(0,1)}
          </div>

          <div className="flex-1">
            <h4 id={`card-${id}-title`} className="font-bold text-lg text-slate-800">{title}</h4>
            <p className="text-slate-600 mt-2 leading-relaxed">{body}</p>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <motion.button
                aria-pressed={liked}
                onClick={onLike}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                whileTap={{ scale: 0.96 }}
                initial="idle"
                animate={liked ? "pop" : "idle"}
                variants={likeVariants}
              >
                <motion.span className="w-5 h-5 flex items-center justify-center text-lg" aria-hidden>
                  {liked ? "❤️" : "🤍"}
                </motion.span>
                <span className="text-sm font-semibold text-slate-700">Like</span>

                {/* ripple effect */}
                <motion.span
                  className="absolute left-0 top-0 w-full h-full rounded-xl pointer-events-none bg-red-400/20"
                  variants={rippleVariants}
                  initial="hidden"
                  animate={liked ? "show" : "hidden"}
                />
              </motion.button>

              <button className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-700">Comentar</button>
              
              {variant === 'market' && (
                <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors text-sm font-bold shadow-sm ml-auto">
                  Contactar
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}
