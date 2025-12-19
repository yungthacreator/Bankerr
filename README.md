# Bankerr - The Xoom of Crypto

A modern fintech landing page built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 📝 **TypeScript** for type safety
- 🎬 **Framer Motion** for animations
- 📱 **Fully responsive** design
- ✨ **Animated widgets** (live transactions, exchange rates)
- ⌨️ **Typing effect** in hero
- 📊 **Animated counters**
- 🎠 **Testimonial marquee**
- 📱 **Phone mockup** with real UI
- 🔗 **Connect Wallet** modal
- 📧 **Waitlist form** (Netlify ready)

## Quick Start

### Option 1: Deploy to Vercel (Recommended - 2 minutes)

1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Click "Deploy"
6. Done! Your site is live.

### Option 2: Deploy to Netlify

1. Push this code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Select your GitHub repo
5. Deploy settings are auto-detected from `netlify.toml`
6. Click "Deploy site"

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
bankerr-nextjs/
├── app/
│   ├── globals.css      # Global styles + Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page with all components
├── public/              # Static assets
├── next.config.js       # Next.js config
├── tailwind.config.js   # Tailwind config
├── tsconfig.json        # TypeScript config
├── netlify.toml         # Netlify deployment config
└── package.json         # Dependencies
```

## Customization

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  accent: '#ff6b35',        // Main brand color
  'accent-dark': '#e55a2b', // Hover state
}
```

### Change Typing Words

In `app/page.tsx`, find the `TypingEffect` component:

```tsx
<TypingEffect words={['Nigeria', 'India', 'UK', 'Mexico', 'Japan', 'anywhere']} />
```

### Change Testimonials

In `app/page.tsx`, find the `testimonials` array in `TestimonialsSection`.

### Change Phone UI

In `app/page.tsx`, edit the `PhoneMockup` component.

## Form Handling

### Netlify Forms

The waitlist form is ready for Netlify Forms. Just deploy to Netlify and forms work automatically.

### Custom Backend

Replace the `handleSubmit` function in `CTASection`:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  
  if (res.ok) {
    setSubmitted(true)
  }
}
```

## Environment Variables

Create `.env.local` for local development:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animations

## License

MIT

---

Built with ❤️ using Claude
