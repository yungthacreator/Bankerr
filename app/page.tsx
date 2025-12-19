'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Typing Effect Component
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
    <span className="text-accent">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// Floating Widget Component
const FloatingWidget = ({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Live Transaction Widget
const LiveTransactionWidget = () => {
  const transactions = [
    { from: 'Sarah', to: 'Lagos', amount: '$250', time: '2s ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { from: 'James', to: 'London', amount: '$1,200', time: '5s ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
    { from: 'Aisha', to: 'Mumbai', amount: '$500', time: '8s ago', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
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
    <motion.div 
      key={currentIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="glass rounded-2xl p-4 shadow-xl flex items-center gap-3 min-w-[240px]"
    >
      <div className="relative">
        <Image 
          src={tx.avatar} 
          alt={tx.from}
          width={44}
          height={44}
          className="rounded-full"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{tx.from} → {tx.to}</p>
        <p className="text-xs text-gray-500">{tx.time}</p>
      </div>
      <div className="text-green-500 font-bold">{tx.amount}</div>
    </motion.div>
  )
}

// Stats Widget
const StatsWidget = () => {
  return (
    <div className="glass rounded-2xl p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-gray-500">LIVE STATS</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Transactions Today</span>
          <span className="font-bold text-accent"><AnimatedCounter end={1247} /></span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Countries Active</span>
          <span className="font-bold text-accent"><AnimatedCounter end={89} /></span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg. Transfer Time</span>
          <span className="font-bold text-accent">2.3s</span>
        </div>
      </div>
    </div>
  )
}

// Currency Exchange Widget
const ExchangeWidget = () => {
  const [amount, setAmount] = useState('1,000')
  
  return (
    <div className="glass rounded-2xl p-5 shadow-xl w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500">LIVE RATES</span>
        <span className="text-xs text-green-500 font-medium">● Updated now</span>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <span className="font-semibold">USD</span>
          </div>
          <span className="font-bold">${amount}</span>
        </div>
        <div className="flex justify-center">
          <motion.div 
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white"
          >
            ↓
          </motion.div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇳🇬</span>
            <span className="font-semibold">NGN</span>
          </div>
          <span className="font-bold text-green-600">₦1,550,000</span>
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-3">You save $45 vs banks</p>
    </div>
  )
}

// Phone Mockup Component
const PhoneMockup = () => {
  return (
    <motion.div 
      className="relative"
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-[300px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Notch */}
          <div className="bg-gray-900 h-7 rounded-b-2xl mx-auto w-32 relative -top-1" />
          
          {/* Screen Content */}
          <div className="p-5 -mt-3">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div>
                <p className="text-xs text-gray-500">Good morning,</p>
                <p className="font-serif font-semibold text-lg">Samuel</p>
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
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
            </div>
            
            {/* Actions */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: '↑', label: 'Send' },
                { icon: '↓', label: 'Receive' },
                { icon: '⇄', label: 'Swap' },
              ].map((action) => (
                <motion.div 
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
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
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 mb-1 last:mb-0">
                  <Image 
                    src={tx.avatar}
                    alt={tx.name}
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{tx.name}</p>
                    <p className="text-xs text-gray-500">{tx.time}</p>
                  </div>
                  <span className={`font-bold text-sm ${tx.positive ? 'text-green-500' : 'text-gray-900'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Navbar Component
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl relative overflow-hidden">
            <span className="relative z-10">B</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <span className="font-serif font-semibold text-xl">Bankerr</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#how" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 border-2 border-gray-200 rounded-full font-semibold text-sm hover:border-gray-400 transition-colors"
          >
            Connect Wallet
          </motion.button>
          <motion.a 
            href="#waitlist"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-accent text-white rounded-full font-semibold text-sm hover:bg-accent-dark transition-colors"
          >
            Join Waitlist
          </motion.a>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 bg-gray-900 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`h-0.5 bg-gray-900 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-gray-900 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="p-6 space-y-4">
              <a href="#features" className="block text-gray-600">Features</a>
              <a href="#how" className="block text-gray-600">How It Works</a>
              <a href="#security" className="block text-gray-600">Security</a>
              <hr />
              <button className="w-full py-3 border-2 border-gray-200 rounded-full font-semibold">
                Connect Wallet
              </button>
              <a href="#waitlist" className="block w-full py-3 bg-accent text-white rounded-full font-semibold text-center">
                Join Waitlist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100 to-orange-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        {/* Left Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Coming Soon</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6"
          >
            Send{' '}
            <span className="relative inline-block">
              <span className="underline-animation">money</span>
            </span>
            {' '}to<br />
            <TypingEffect words={['Nigeria', 'India', 'UK', 'Mexico', 'Japan', 'anywhere']} />
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-4 max-w-lg"
          >
            Transfer funds to 160+ countries in seconds. Not days. 
            Works with your bank account or crypto wallet.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-serif text-accent font-medium mb-8"
          >
            Web2 simplicity. Web3 power.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-accent text-white rounded-full font-semibold text-lg hover:bg-accent-dark transition-colors shadow-lg shadow-accent/25"
            >
              Join Waitlist →
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border-2 border-gray-200 rounded-full font-semibold text-lg hover:border-gray-400 transition-colors"
            >
              Connect Wallet
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-12"
          >
            {[
              { value: '$0', label: 'Transferred (Pre-launch)' },
              { value: '160+', label: 'Countries' },
              { value: '0.1%', label: 'Fees' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl font-semibold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Content - Phone + Widgets */}
        <div className="relative flex justify-center items-center min-h-[600px]">
          <PhoneMockup />
          
          {/* Floating Widgets */}
          <FloatingWidget className="top-0 -left-4 lg:left-0" delay={0.6}>
            <LiveTransactionWidget />
          </FloatingWidget>
          
          <FloatingWidget className="bottom-20 -right-4 lg:right-0" delay={0.8}>
            <ExchangeWidget />
          </FloatingWidget>
          
          <FloatingWidget className="top-1/3 -right-8 lg:-right-4" delay={1}>
            <div className="glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-sm">Transfer Complete</p>
                  <p className="text-xs text-gray-500">Arrived in 2.3s</p>
                </div>
              </div>
            </div>
          </FloatingWidget>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section (Marquee)
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
      <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-10">
        Loved by early adopters worldwide
      </p>
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div key={i} className="flex-shrink-0 w-[320px] mx-4 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-2 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-serif font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.location}</p>
              </div>
            </div>
            <p className="text-gray-600 italic">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  )
}


// Trust Section
const TrustSection = () => {
  const universities = [
    { name: 'Oxford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/200px-Oxford-University-Circlet.svg.png' },
    { name: 'Imperial', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Imperial_College_London_crest.svg/200px-Imperial_College_London_crest.svg.png' },
    { name: 'UCL', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/University_College_London_logo.svg/200px-University_College_London_logo.svg.png' },
    { name: 'Harvard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/200px-Harvard_University_coat_of_arms.svg.png' },
    { name: 'Cambridge', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Coat_of_Arms_of_the_University_of_Cambridge.svg/200px-Coat_of_Arms_of_the_University_of_Cambridge.svg.png' },
    { name: 'MIT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/200px-MIT_logo.svg.png' },
  ]
  
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
          Trusted by people from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {universities.map((uni) => (
            <motion.div 
              key={uni.name}
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-2 cursor-default"
            >
              <img 
                src={uni.logo} 
                alt={uni.name}
                className="h-12 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs text-gray-500">{uni.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section
const FeaturesSection = () => {
  const features = [
    { icon: '⚡', title: 'Instant Transfers', desc: 'Money arrives in seconds, not days. No more waiting for international wires.' },
    { icon: '💱', title: 'Best Rates', desc: 'Up to 8x better than banks. We aggregate liquidity for the best prices.' },
    { icon: '🏦', title: 'Bank + Crypto', desc: 'Works with your bank account or crypto wallet. You choose.' },
    { icon: '📈', title: 'Earn Yield', desc: 'Your idle balance earns up to 8% APY through secure DeFi protocols.' },
    { icon: '🔗', title: 'Multi Chain', desc: 'Ethereum, Solana, Bitcoin. One app, every blockchain.' },
    { icon: '⛽', title: 'Gasless', desc: 'We cover gas fees. You never pay extra for transactions.' },
  ]

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6">
            Features
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Everything you need to move<br />
            <span className="underline-animation">money</span> globally
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            We built the infrastructure so you can focus on what matters.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-8 group cursor-default"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { num: 1, title: 'Sign Up', desc: 'Create an account with email or connect your wallet.' },
    { num: 2, title: 'Add Funds', desc: 'Link your bank or deposit crypto. Your choice.' },
    { num: 3, title: 'Enter Details', desc: 'Amount and recipient. See exact fees upfront.' },
    { num: 4, title: 'Send', desc: 'One tap. Track in real time. Done.' },
  ]

  return (
    <section id="how" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6">
            How It Works
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Send <span className="underline-animation">money</span> in 4 simple steps
          </h2>
          <p className="text-xl text-gray-500">No complexity. No hidden fees. Just fast, simple transfers.</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: '#ff6b35', color: '#fff' }}
                className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 font-serif text-3xl font-semibold transition-colors"
              >
                {step.num}
              </motion.div>
              <h3 className="font-serif text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-500">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200">
                  <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-200 rotate-45" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Flow Diagram */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white border border-gray-100 rounded-3xl p-8 flex flex-wrap justify-center items-center gap-6"
        >
          {['👤 You', '🔐 Bankerr', '⛓️ Blockchain', '🏦 Local Bank', '👥 Recipient'].map((node, i, arr) => (
            <div key={node} className="flex items-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-2xl hover:bg-accent hover:border-accent transition-colors">
                  {node.split(' ')[0]}
                </div>
                <span className="text-sm text-gray-500">{node.split(' ')[1]}</span>
              </motion.div>
              {i < arr.length - 1 && (
                <motion.span 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-2xl text-gray-300"
                >
                  →
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Security Section
const SecuritySection = () => {
  const checks = [
    'Multi signature smart contracts',
    'Audited by Trail of Bits and OpenZeppelin',
    '$50M insurance coverage',
    '24/7 fraud monitoring',
    'Non custodial: you control your keys',
  ]

  return (
    <section id="security" className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-[360px] h-[420px] bg-gray-50 border border-gray-100 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-blue-500" />
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🛡️
            </motion.div>
            <div className="flex gap-3">
              {['SOC 2', 'ISO 27001', 'GDPR'].map((badge) => (
                <span key={badge} className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-500 shadow-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-semibold mb-6">
            Security
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
            Your <span className="underline-animation">money</span> is safe
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Institutional grade security. We partnered with the best to protect your funds.
          </p>
          <ul className="space-y-4">
            {checks.map((check, i) => (
              <motion.li 
                key={check}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 py-4 border-b border-gray-100 hover:pl-3 transition-all"
              >
                <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                <span className="text-gray-700">{check}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="py-32 px-6 bg-accent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6"
        >
          Ready to send <span className="underline decoration-white/30">money</span> without borders?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/90 mb-10"
        >
          Be the first to know when we launch.
        </motion.p>

        {!submitted ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Join Waitlist
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur rounded-2xl p-6 max-w-md mx-auto"
          >
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold">You are on the list!</p>
            <p className="text-white/80 text-sm">We will notify you when Bankerr launches.</p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-4 mt-10"
        >
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
            ].map((src, i) => (
              <Image 
                key={i}
                src={src}
                alt=""
                width={40}
                height={40}
                className="rounded-full border-2 border-accent"
              />
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

// Footer
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
            <a href="#" className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl">
                B
              </div>
              <span className="font-serif font-semibold text-xl">Bankerr</span>
            </a>
            <p className="text-gray-400 mb-6 max-w-xs">
              The Xoom of crypto. Send money anywhere, instantly. Web2 simplicity, Web3 power.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', '📸'].map((icon) => (
                <a key={icon} href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-accent transition-colors">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2025 Bankerr. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  return (
    <main>
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
