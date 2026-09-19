'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Props = {
  children: ReactNode
  /** Stagger index - each step delays the reveal by 60ms. */
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
  as?: 'div' | 'section' | 'li' | 'article'
}

const OFFSET = 18

/**
 * Scroll-triggered entrance. Animates once, uses only transform and opacity so
 * it never triggers layout, and collapses to a plain fade when the visitor
 * prefers reduced motion.
 */
export function Reveal({ children, delay = 0, direction = 'up', className, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const Component = motion[as]

  const hidden = reduced
    ? { opacity: 0 }
    : {
        opacity: 0,
        y: direction === 'up' ? OFFSET : 0,
        x: direction === 'left' ? OFFSET : direction === 'right' ? -OFFSET : 0,
      }

  return (
    <Component
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: reduced ? 0.2 : 0.55,
        delay: reduced ? 0 : delay * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  )
}
