'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// ============================================
// ANIMATION VARIANTS (Framer-style)
// ============================================

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.4, 0.25, 1], // Custom easing
    },
  }),
}

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: 'easeOut',
    },
  }),
}

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.34, 1.56, 0.64, 1], // Spring-like
    },
  }),
}

const slideInLeftVariant = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const slideInRightVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

// Stagger container for children
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

// ============================================
// ANIMATED COMPONENTS
// ============================================

// Animated Counter with scroll trigger
const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }: { 
  end: number
  duration?: number
  suffix?: string
  prefix?: string 
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      
      // Eased progress for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easedProgress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Typing Effect with cursor
const TypingEffect = ({ words }: { words: string[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <span className="text-accent inline-flex items-center">
      {currentText}
      <motion.span 
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 w-[3px] h-[1em] bg-accent inline-block"
      />
    </span>
  )
}

// Animated Underline
const AnimatedUnderline = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="absolute bottom-1 left-0 w-full h-[6px] bg-gradient-to-r from-accent to-orange-400 rounded-full origin-left"
      />
    </span>
  )
}

// Magnetic Button (follows cursor slightly)
const MagneticButton = ({ 
  children, 
  className = '',
  onClick
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.15
    const y = (clientY - top - height / 2) * 0.15
    setPosition({ x, y })
  }

  const handleLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// Floating Widget with parallax
const FloatingWidget = ({ 
  children, 
  className = '',
  delay = 0,
  floatIntensity = 15
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  floatIntensity?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -floatIntensity, 0],
          rotate: [0, 1, 0, -1, 0]
        }}
        transition={{ 
          duration: 5 + Math.random() * 2, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Glow Button
const GlowButton = ({ 
  children, 
  primary = false,
  className = '',
  href
}: { 
  children: React.ReactNode
  primary?: boolean
  className?: string
  href?: string
}) => {
  const baseClasses = primary
    ? 'relative px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg overflow-hidden group'
    : 'px-8 py-4 border-2 border-gray-200 rounded-full font-semibold text-lg hover:border-gray-400 transition-colors'

  const content = (
    <>
      {primary && (
        <>
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400 via-accent to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
          {/* Breathing glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 107, 53, 0.3)',
                '0 0 40px rgba(255, 107, 53, 0.5)',
                '0 0 20px rgba(255, 107, 53, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${className} inline-block`}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${className}`}
    >
      {content}
    </motion.button>
  )
}

// Live Transaction Widget with animation
const LiveTransactionWidget = () => {
  const transactions = [
    { from: 'Sarah', to: 'Lagos', amount: '$250', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { from: 'James', to: 'London', amount: '$1,200', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { from: 'Aisha', to: 'Mumbai', amount: '$500', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % transactions.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const tx = transactions[currentIndex]

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/10 border border-white/50 flex items-center gap-3 min-w-[240px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-3 w-full"
        >
          <div className="relative">
            <Image 
              src={tx.avatar} 
              alt={tx.from}
              width={44}
              height={44}
              className="rounded-full"
            />
            <motion.div 
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900">{tx.from} → {tx.to}</p>
            <p className="text-xs text-gray-500">Just now</p>
          </div>
          <motion.div 
            className="text-green-600 font-bold"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {tx.amount}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Exchange Widget
const ExchangeWidget = () => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl shadow-black/10 border border-white/50 w-[260px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500">LIVE RATES</span>
        <motion.span 
          className="text-xs text-green-500 font-medium flex items-center gap-1"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Live
        </motion.span>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <span className="font-semibold text-gray-900">USD</span>
          </div>
          <span className="font-bold text-gray-900">$1,000</span>
        </div>
        <div className="flex justify-center">
          <motion.div 
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm"
          >
            ↓
          </motion.div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇳🇬</span>
            <span className="font-semibold text-gray-900">NGN</span>
          </div>
          <span className="font-bold text-green-600">₦1,550,000</span>
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-3">You save $45 vs banks</p>
    </div>
  )
}

// Phone Mockup with 3D tilt
const PhoneMockup = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 20
    const y = -(e.clientY - top - height / 2) / 20
    setRotateX(y)
    setRotateY(x)
  }

  const handleLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{
        perspective: '1000px',
      }}
      className="relative"
    >
      <motion.div
        animate={{ 
          rotateX,
          rotateY,
          y: [0, -10, 0]
        }}
        transition={{ 
          rotateX: { type: 'spring', stiffness: 100, damping: 15 },
          rotateY: { type: 'spring', stiffness: 100, damping: 15 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-[300px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/30">
          <div className="bg-white rounded-[2.5rem] overflow-hidden">
            {/* Notch */}
            <div className="bg-gray-900 h-7 rounded-b-2xl mx-auto w-32 relative -top-1" />
            
            {/* Screen Content */}
            <div className="p-5 -mt-3">
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <div>
                  <p className="text-xs text-gray-500">Good morning,</p>
                  <p className="font-serif font-semibold text-lg text-gray-900">Samuel</p>
                </div>
                <Image 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Profile"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-gray-100"
                />
              </div>
              
              {/* Balance Card */}
              <motion.div 
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white mb-5 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <p className="text-xs opacity-70 uppercase tracking-wider">Total Balance</p>
                <p className="font-serif text-3xl font-semibold mt-1 mb-4">$12,847.32</p>
                <div className="flex gap-2">
                  {[
                    { color: 'bg-blue-500', name: 'ETH' },
                    { color: 'bg-purple-500', name: 'SOL' },
                    { color: 'bg-orange-500', name: 'BTC' },
                  ].map((token) => (
                    <span key={token.name} className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 text-xs">
                      <span className={`w-2 h-2 rounded-full ${token.color}`} />
                      {token.name}
                    </span>
                  ))}
                </div>
              </motion.div>
              
              {/* Actions */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: '↑', label: 'Send' },
                  { icon: '↓', label: 'Receive' },
                  { icon: '⇄', label: 'Swap' },
                ].map((action, i) => (
                  <motion.div 
                    key={action.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-50 rounded-xl p-3 text-center cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm text-lg">
                      {action.icon}
                    </div>
                    <span className="text-xs text-gray-600">{action.label}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-xl p-1">
                {[
                  { name: 'Sarah Johnson', time: '2 min ago', amount: '-$250', positive: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
                  { name: 'James Wilson', time: '1 hour ago', amount: '+$1,200', positive: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
                ].map((tx, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 bg-white rounded-xl p-3 mb-1 last:mb-0"
                    whileHover={{ x: 4 }}
                  >
                    <Image 
                      src={tx.avatar}
                      alt={tx.name}
                      width={40}
                      height={40}
                      className="rounded-xl"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.time}</p>
                    </div>
                    <span className={`font-bold text-sm ${tx.positive ? 'text-green-500' : 'text-gray-900'}`}>
                      {tx.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// NAVBAR
// ============================================

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <motion.a 
          href="#" 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="w-11 h-11 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl relative overflow-hidden"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="relative z-10">B</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
          <span className="font-serif font-semibold text-xl">Bankerr</span>
        </motion.a>
        
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Security'].map((item, i) => (
            <motion.a 
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-gray-600 hover:text-gray-900 transition-colors relative"
              whileHover={{ y: -2 }}
            >
              {item}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02, borderColor: '#999' }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-full font-semibold text-sm transition-colors"
          >
            Connect Wallet
          </motion.button>
          <GlowButton primary href="#waitlist" className="text-sm !px-5 !py-2.5">
            Join Waitlist
          </GlowButton>
        </div>

        <motion.button 
          className="md:hidden w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <motion.span 
              animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 9 : 0 }}
              className="h-0.5 bg-gray-900 w-full origin-left"
            />
            <motion.span 
              animate={{ opacity: mobileMenuOpen ? 0 : 1, x: mobileMenuOpen ? 20 : 0 }}
              className="h-0.5 bg-gray-900 w-full"
            />
            <motion.span 
              animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -9 : 0 }}
              className="h-0.5 bg-gray-900 w-full origin-left"
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <motion.div 
              className="p-6 space-y-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {['Features', 'How It Works', 'Security'].map((item) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-gray-600"
                  variants={staggerItem}
                >
                  {item}
                </motion.a>
              ))}
              <motion.hr variants={staggerItem} />
              <motion.button 
                variants={staggerItem}
                className="w-full py-3 border-2 border-gray-200 rounded-full font-semibold"
              >
                Connect Wallet
              </motion.button>
              <motion.a 
                href="#waitlist"
                variants={staggerItem}
                className="block w-full py-3 bg-accent text-white rounded-full font-semibold text-center"
              >
                Join Waitlist
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ============================================
// HERO SECTION
// ============================================

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100 to-orange-50 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6"
          >
            <motion.span 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium">Coming Soon</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
          >
            Send{' '}
            <AnimatedUnderline>money</AnimatedUnderline>
            {' '}to<br />
            <TypingEffect words={['Nigeria', 'India', 'UK', 'Mexico', 'Japan', 'anywhere']} />
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 mb-4 max-w-lg"
          >
            Transfer funds to 160+ countries in seconds. Not days. 
            Works with your bank account or crypto wallet.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg font-serif text-accent font-medium mb-8"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Web2 simplicity.
            </motion.span>{' '}
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="inline-block"
            >
              Web3 power.
            </motion.span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <GlowButton primary href="#waitlist">
              Join Waitlist →
            </GlowButton>
            <GlowButton>
              Connect Wallet
            </GlowButton>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-12"
          >
            {[
              { value: 0, prefix: '$', label: 'Transferred (Pre-launch)' },
              { value: 160, suffix: '+', label: 'Countries' },
              { value: 0.1, suffix: '%', label: 'Fees', isDecimal: true },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <p className="font-serif text-3xl font-semibold">
                  {stat.isDecimal ? `${stat.value}${stat.suffix}` : (
                    <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  )}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Phone + Widgets */}
        <div className="relative flex justify-center items-center min-h-[600px]">
          <PhoneMockup />
          
          {/* Floating Widgets */}
          <FloatingWidget className="top-0 -left-4 lg:left-0" delay={0.8}>
            <LiveTransactionWidget />
          </FloatingWidget>
          
          <FloatingWidget className="bottom-20 -right-4 lg:right-0" delay={1} floatIntensity={12}>
            <ExchangeWidget />
          </FloatingWidget>
          
          <FloatingWidget className="top-1/3 -right-8 lg:-right-4" delay={1.2} floatIntensity={10}>
            <motion.div 
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/10 border border-white/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✓
                </motion.div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Transfer Complete</p>
                  <p className="text-xs text-gray-500">Arrived in 2.3s</p>
                </div>
              </div>
            </motion.div>
          </FloatingWidget>
        </div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SECTION (Infinite Marquee)
// ============================================

const TestimonialsSection = () => {
  const testimonials = [
    { name: 'Marcus Chen', location: '🇬🇧 London', quote: 'Finally, a way to send money home without losing 10% to fees.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Sarah Okonkwo', location: '🇳🇬 Lagos', quote: 'My family receives money in seconds, not days. Game changer.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
    { name: 'James Rodriguez', location: '🇺🇸 Miami', quote: 'The best rates I have found anywhere. And the app is beautiful.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Aisha Patel', location: '🇮🇳 Mumbai', quote: 'I can finally pay my team internationally without headaches.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
    { name: 'Thomas Müller', location: '🇩🇪 Berlin', quote: 'Blockchain payments made simple. This is what crypto should be.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Emma Nakamura', location: '🇯🇵 Tokyo', quote: 'Super fast, super cheap. Already told everyone I know.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face' },
  ]

  return (
    <section className="py-20 border-t border-gray-100 overflow-hidden">
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-10"
      >
        Loved by early adopters worldwide
      </motion.p>
      <div className="relative">
        <motion.div 
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div 
              key={i} 
              className="flex-shrink-0 w-[320px] bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
                <div>
                  <p className="font-serif font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.location}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t.quote}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// TRUST SECTION
// ============================================

const TrustSection = () => {
  const universities = ['Oxford', 'Imperial', 'UCL', 'Harvard', 'Cambridge', 'MIT']
  
  return (
    <section className="py-16 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8"
        >
          Trusted by people from
        </motion.p>
        <motion.div 
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {universities.map((uni) => (
            <motion.span 
              key={uni}
              variants={staggerItem}
              whileHover={{ scale: 1.1, color: '#fff' }}
              className="font-serif text-xl md:text-2xl text-gray-500 hover:text-white transition-colors cursor-default"
            >
              {uni}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection = () => {
  const features = [
    { icon: '⚡', title: 'Instant Transfers', desc: 'Money arrives in seconds, not days. No more waiting for international wires.' },
    { icon: '💱', title: 'Best Rates', desc: 'Up to 8x better than banks. We aggregate liquidity for the best prices.' },
    { icon: '🏦', title: 'Bank + Crypto', desc: 'Works with your bank account or crypto wallet. You choose.' },
    { icon: '📈', title: 'Earn Yield', desc: 'Your idle balance earns up to 8% APY through secure DeFi protocols.' },
    { icon: '🔗', title: 'Multi Chain', desc: 'Ethereum, Solana, Bitcoin. One app, every blockchain.' },
    { icon: '⛽', title: 'Gasless', desc: 'We cover gas fees. You never pay extra for transactions.' },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            Features
          </motion.span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Everything you need to move<br />
            <AnimatedUnderline>money</AnimatedUnderline> globally
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We built the infrastructure so you can focus on what matters.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-8 group cursor-default relative overflow-hidden"
            >
              {/* Hover gradient */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Top accent bar on hover */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-orange-400"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div 
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm relative z-10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-serif text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
              <p className="text-gray-500 relative z-10">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// HOW IT WORKS SECTION
// ============================================

const HowItWorksSection = () => {
  const steps = [
    { num: 1, title: 'Sign Up', desc: 'Create an account with email or connect your wallet.' },
    { num: 2, title: 'Add Funds', desc: 'Link your bank or deposit crypto. Your choice.' },
    { num: 3, title: 'Enter Details', desc: 'Amount and recipient. See exact fees upfront.' },
    { num: 4, title: 'Send', desc: 'One tap. Track in real time. Done.' },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            How It Works
          </motion.span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Send <AnimatedUnderline>money</AnimatedUnderline> in 4 simple steps
          </h2>
          <p className="text-xl text-gray-500">No complexity. No hidden fees. Just fast, simple transfers.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              <motion.div 
                className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 font-serif text-3xl font-semibold relative z-10"
                whileHover={{ scale: 1.1, backgroundColor: '#ff6b35', color: '#fff', borderColor: '#ff6b35' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {step.num}
              </motion.div>
              <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
              
              {/* Animated connector line */}
              {i < steps.length - 1 && (
                <motion.div 
                  className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200 overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
                >
                  <motion.div 
                    className="h-full w-1/3 bg-accent"
                    animate={{ x: ['0%', '300%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// SECURITY SECTION
// ============================================

const SecuritySection = () => {
  const checks = [
    'Multi signature smart contracts',
    'Audited by Trail of Bits and OpenZeppelin',
    '$50M insurance coverage',
    '24/7 fraud monitoring',
    'Non custodial: you control your keys',
  ]

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="security" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <motion.div 
            className="w-[360px] h-[420px] bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-blue-500"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div 
              className="text-8xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              🛡️
            </motion.div>
            <div className="flex gap-3">
              {['SOC 2', 'ISO 27001', 'GDPR'].map((badge, i) => (
                <motion.span 
                  key={badge} 
                  className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-500 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            Security
          </motion.span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Your <AnimatedUnderline>money</AnimatedUnderline> is safe
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Institutional grade security. We partnered with the best to protect your funds.
          </p>
          <ul className="space-y-4">
            {checks.map((check, i) => (
              <motion.li 
                key={check}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 py-4 border-b border-gray-100 cursor-default"
              >
                <motion.span 
                  className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: 'spring' }}
                >
                  ✓
                </motion.span>
                <span className="text-gray-700">{check}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================

const CTASection = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="waitlist" className="py-32 px-6 bg-accent relative overflow-hidden" ref={ref}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ 
          background: [
            'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #fff 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #fff 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6"
        >
          Ready to send money without borders?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xl text-white/90 mb-10"
        >
          Be the first to know when we launch.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Waitlist
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur rounded-2xl p-8 max-w-md mx-auto"
            >
              <motion.div 
                className="text-5xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <p className="text-white font-semibold text-xl">You are on the list!</p>
              <p className="text-white/80">We will notify you when Bankerr launches.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Image 
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-accent"
                />
              </motion.div>
            ))}
          </div>
          <span className="text-white/90">
            <strong>0</strong> people on the waitlist. Be the first!
          </span>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================

const Footer = () => {
  const links = {
    Product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Resources: ['Docs', 'Help', 'Blog', 'Status'],
    Legal: ['Privacy', 'Terms', 'Cookies'],
  }

  return (
    <footer className="py-20 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">
                B
              </div>
              <span className="font-serif font-semibold text-xl">Bankerr</span>
            </motion.a>
            <p className="text-gray-400 mb-6 max-w-xs">
              The Xoom of crypto. Send money anywhere, instantly. Web2 simplicity, Web3 power.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', '📸'].map((icon) => (
                <motion.a 
                  key={icon} 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <motion.div 
          className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © 2025 Bankerr. All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}

// ============================================
// MAIN PAGE
// ============================================

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <HeroSection />
      <TestimonialsSection />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  )
}
