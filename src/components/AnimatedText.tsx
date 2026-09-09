import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import React, { useRef } from 'react';

interface AnimatedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  highlightWord?: string;
  highlightClass?: string;
}

export function AnimatedHeading({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
  highlightWord,
  highlightClass = 'text-[#EDA81C]'
}: AnimatedHeadingProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { y: '110%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <Component className={className}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="inline"
      >
        {words.map((word, i) => {
          const isHighlighted = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
          return (
            <span key={i} className="inline-block overflow-hidden mr-[0.24em] align-top">
              <motion.span
                className={`inline-block ${isHighlighted ? highlightClass : ''}`}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  zoom?: boolean;
}

export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  zoom = false
}: RevealOnScrollProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case 'down':
        return { y: -30, x: 0 };
      case 'left':
        return { x: 30, y: 0 };
      case 'right':
        return { x: -30, y: 0 };
      case 'up':
      default:
        return { y: 30, x: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: zoom ? 0.94 : 1
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ZoomImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDrag' | 'onDragExit'> {
  containerClassName?: string;
  scaleOnHover?: number;
}

export function ZoomImage({
  containerClassName = '',
  scaleOnHover = 1.05,
  className = '',
  alt,
  ...props
}: ZoomImageProps) {
  return (
    <div className={`overflow-hidden relative ${containerClassName}`}>
      <motion.img
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        whileHover={{ scale: scaleOnHover }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full h-full object-cover transition-transform duration-700 ${className}`}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        {...props}
      />
    </div>
  );
}

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical parallax travel in pixels. Positive = content drifts up slower than scroll. */
  offset?: number;
}

/**
 * Lightweight scroll-parallax wrapper. Drifts its children vertically as the
 * page scrolls, producing layered depth without a dedicated scroll library.
 */
export function Parallax({ children, className = '', offset = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
