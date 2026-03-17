/**
 * HeroConcept1 — "Sacred Geometry"
 * Orbital rings, Swiss precision typography, cardinal modality icons.
 * Mood: Scientific, meditative, ultra-premium Swiss design.
 */
import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import { Wind, Activity, Sun, Droplets, User, Play } from 'lucide-react';
import { MagneticButton } from '../shared/MagneticButton';

interface HeroConcept1Props {
  onLaunchBuilder: () => void;
  onNavigate: (path: string) => void;
  onWatchDemo?: () => void;
}

const MODALITIES = [
  { id: 'oxygen',   Icon: Wind,     label: 'Oxygen',   sublabel: 'O₂',   color: '#0891b2', angle: 0   },
  { id: 'light',    Icon: Sun,      label: 'Light',    sublabel: 'RLT',  color: '#d97706', angle: 90  },
  { id: 'hydrogen', Icon: Droplets, label: 'Hydrogen', sublabel: 'H₂',  color: '#0ea5e9', angle: 180 },
  { id: 'signal',   Icon: Activity, label: 'Signal',   sublabel: 'PEMF', color: '#7c3aed', angle: 270 },
];

export const HeroConcept1: React.FC<HeroConcept1Props> = ({ onLaunchBuilder, onNavigate, onWatchDemo }) => {
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const orbX = useTransform(springX, [-1, 1], [-18, 18]);
  const orbY = useTransform(springY, [-1, 1], [-12, 12]);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 600], [0, 60]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafaf8]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ opacity: heroOpacity }}
    >
      {/* Subtle grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      {/* Orbital ring system */}
      <motion.div
        className="absolute"
        style={{ x: orbX, y: orbY }}
      >
        {/* Ring 1 — outermost, slow rotation */}
        <motion.div
          className="absolute rounded-full border border-slate-200/60"
          style={{ width: '70vmin', height: '70vmin', top: '-35vmin', left: '-35vmin' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 2 */}
        <motion.div
          className="absolute rounded-full border border-slate-300/40"
          style={{ width: '54vmin', height: '54vmin', top: '-27vmin', left: '-27vmin' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 3 — dashed */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '40vmin', height: '40vmin', top: '-20vmin', left: '-20vmin',
            border: '1px dashed rgba(8,145,178,0.25)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        {/* Ring 4 — inner glow ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '26vmin', height: '26vmin', top: '-13vmin', left: '-13vmin',
            border: '1px solid rgba(8,145,178,0.15)',
            boxShadow: '0 0 30px rgba(8,145,178,0.08), inset 0 0 30px rgba(8,145,178,0.04)',
          }}
          animate={{ rotate: -180 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Modality icons on the outermost ring */}
        {MODALITIES.map(({ id, Icon, label, sublabel, color, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const r = 35; // vmin radius
          const x = Math.sin(rad) * r;
          const y = -Math.cos(rad) * r;
          return (
            <motion.div
              key={id}
              className="absolute flex flex-col items-center"
              style={{
                left: `calc(${x}vmin - 28px)`,
                top: `calc(${y}vmin - 28px)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + angle / 360, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: `${color}08`,
                  borderColor: `${color}30`,
                  boxShadow: `0 0 20px ${color}15`,
                }}
              >
                <Icon size={20} style={{ color }} strokeWidth={1.5} />
              </div>
              <span className="mt-1 text-[9px] uppercase tracking-[0.2em] font-semibold" style={{ color: `${color}cc` }}>
                {sublabel}
              </span>
            </motion.div>
          );
        })}

        {/* Center convergence point */}
        <div className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 bg-slate-900"
          style={{ boxShadow: '0 0 24px rgba(8,145,178,0.4)' }} />
      </motion.div>

      {/* Core content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y: heroTextY }}
      >
        {/* Overline */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="h-px w-12 bg-slate-300" />
          <span className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-semibold">
            Bio-Optimization Systems
          </span>
          <div className="h-px w-12 bg-slate-300" />
        </motion.div>

        {/* Brand name */}
        <motion.h1
          id="home-hero-headline"
          className="text-[13vmin] md:text-[11vmin] font-thin tracking-[0.25em] text-slate-900 leading-none mb-4"
          style={{ fontFamily: '"Syncopate", "Outfit", sans-serif' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          HYLONO
        </motion.h1>

        {/* Divider with rule */}
        <motion.div
          className="flex items-center justify-center gap-6 my-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-slate-300" />
        </motion.div>

        {/* Tagline — split layout */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-2xl md:text-3xl font-light text-slate-600 tracking-wide leading-relaxed">
            Where{' '}
            <span className="font-semibold text-slate-900 relative">
              Mind
              <motion.span
                className="absolute -bottom-0.5 left-0 w-full h-px bg-cyan-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              />
            </span>
            {' '}connects with{' '}
            <span className="font-semibold text-slate-900 relative">
              Matter
              <motion.span
                className="absolute -bottom-0.5 left-0 w-full h-px bg-purple-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              />
            </span>
          </p>
          <p id="home-hero-description" className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
            Compare oxygen, hydrogen, red-light, and signal-based systems, choose a rental or
            purchase path, and follow structured protocols built for practical daily routines.
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {['CE Marked Devices', '5-Year Warranty', '2,500+ Users', 'MDR Compliant'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-cyan-500" />
              <span className="text-xs text-slate-500 tracking-wide">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <MagneticButton
            onClick={onLaunchBuilder}
            className="group px-10 py-4 bg-slate-900 text-white rounded-none tracking-[0.2em] text-xs font-semibold uppercase hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/10 flex items-center gap-3"
            strength={0.3}
          >
            <User size={14} />
            Begin Protocol
          </MagneticButton>
          <MagneticButton
            onClick={() => onNavigate('rental')}
            className="group px-10 py-4 bg-transparent border border-slate-300 text-slate-700 rounded-none tracking-[0.2em] text-xs font-semibold uppercase hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-3"
            strength={0.25}
          >
            Rent from €149/mo
          </MagneticButton>
          {onWatchDemo && (
            <MagneticButton
              onClick={onWatchDemo}
              className="group px-6 py-4 text-slate-400 tracking-[0.15em] text-xs uppercase hover:text-slate-700 transition-colors flex items-center gap-2"
              strength={0.2}
            >
              <Play size={12} strokeWidth={2} /> Watch Demo
            </MagneticButton>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-slate-400">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.section>
  );
};

