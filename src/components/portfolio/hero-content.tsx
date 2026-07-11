"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Github, Check, Copy, Laptop, Layout } from "lucide-react";
import { ThemeTogglePill } from "@/components/shared/theme-toggle-pill";
import { HeroGitHubButton } from "@/components/auth/hero-github-button";

export function HeroContent({ session }: { session: any }) {
  // Animation variants
  const badgeVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } }
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } }
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.5 } }
  };

  const floatingBrowser: Variants = {
    animate: { y: [0, -10, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
  };

  const floatingCard1: Variants = {
    animate: { y: [0, -8, 0], rotate: 2, transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }
  };

  const floatingCard2: Variants = {
    animate: { y: [0, 8, 0], rotate: -2, transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 } }
  };

  const floatingCard3: Variants = {
    animate: { y: [0, -6, 0], rotate: 1, transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#FCFCFC] dark:bg-[#0A0A0A] selection:bg-[#FFB400]/30 transition-colors duration-500 font-sans flex flex-col">
      {/* Background Grid & Glow (Theme Specific) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
        
        {/* Radial Glows */}
        <div className="absolute left-0 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB400]/5 blur-[120px] dark:bg-[#FFB400]/10" />
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#FFB400]/5 blur-[100px] dark:bg-[#FFB400]/5" />
      </div>

      {/* Header */}
      <header className="relative z-50 flex w-full items-center justify-between px-8 py-6 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-[#FFB400]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-[20px] font-black tracking-tight text-[#111111] dark:text-white">BYOP</span>
        </div>
        <ThemeTogglePill />
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center w-full max-w-[1440px] mx-auto px-8 lg:px-12 xl:px-16 pb-24 lg:pb-0">
        
        {/* LEFT COLUMN (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col items-start justify-center pt-10 lg:pt-0">
          <motion.div initial="hidden" animate="visible" variants={badgeVariants}>
            <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200/80 bg-white/50 px-4 py-1.5 text-xs font-bold text-[#666666] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 uppercase tracking-widest shadow-sm">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-[#FFB400] shadow-[0_0_8px_rgba(255,180,0,0.8)]" />
              Free Portfolio Generator for Developers
            </div>
          </motion.div>

          <motion.h1 
            initial="hidden" animate="visible" variants={titleVariants}
            className="font-heading text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black tracking-tight text-[#111111] dark:text-white leading-[1.05]"
          >
            Generate your portfolio.
            <br />
            <span className="bg-gradient-to-r from-[#FFB400] to-[#FFD000] bg-clip-text text-transparent">
              Publish it for free.
            </span>
          </motion.h1>

          <motion.p 
            initial="hidden" animate="visible" variants={textVariants}
            className="mt-8 max-w-[600px] text-base md:text-lg lg:text-[19px] font-medium leading-relaxed text-[#666666] dark:text-zinc-400"
          >
            BYOP is a free portfolio generator for students and developers.
            Import GitHub projects, customize your theme,
            and publish your portfolio with a shareable public link in minutes.
          </motion.p>

          <motion.div 
            initial="hidden" animate="visible" variants={buttonVariants}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href={session ? "/dashboard" : "#"} 
              className="flex h-12 items-center justify-center rounded-[14px] bg-[#FFB400] px-8 text-[15px] font-bold text-black transition-all hover:bg-[#FFC433] hover:shadow-[0_8px_30px_rgba(255,180,0,0.3)] w-full sm:w-auto shadow-sm"
            >
              {session ? "Go to Dashboard" : "Get Started"}
            </Link>
            {!session && (
              <HeroGitHubButton />
            )}
          </motion.div>

          <motion.div 
            initial="hidden" animate="visible" variants={buttonVariants}
            className="mt-12 flex flex-wrap items-center gap-6 text-[13px] font-bold text-[#666666] dark:text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#FFB400]" strokeWidth={3} />
              Free Forever
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#FFB400]" strokeWidth={3} />
              GitHub Import
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#FFB400]" strokeWidth={3} />
              Open Source
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (45%) */}
        <div className="w-full lg:w-[45%] h-full flex items-center justify-center relative mt-16 lg:mt-0">
          
          {/* Floating Browser Mockup */}
          <motion.div animate="animate" variants={floatingBrowser} className="relative z-20 w-full max-w-[600px]">
            <div className="relative w-full rounded-[20px] border border-zinc-200/80 bg-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#171717]/80 dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
              {/* Browser Toolbar */}
              <div className="flex items-center border-b border-zinc-200/50 px-5 py-4 dark:border-white/5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56] border border-black/10" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F] border border-black/10" />
                </div>
                <div className="mx-auto flex h-7 w-[60%] items-center justify-center rounded-md bg-zinc-100/80 text-[11px] font-medium text-zinc-500 dark:bg-black/50 dark:text-zinc-400 shadow-inner">
                  portfolio.tinobritty.me/yourname
                </div>
              </div>
              
              {/* Browser Content */}
              <div className="h-[420px] rounded-b-[20px] bg-[#FCFCFC] p-8 dark:bg-[#101010] flex flex-col relative overflow-hidden">
                <div className="w-full flex justify-between items-center mb-12">
                   <div className="font-bold text-sm text-[#111] dark:text-white tracking-wide">Developer.</div>
                   <div className="flex gap-4 text-xs font-medium text-zinc-400">
                     <span>About</span>
                     <span>Projects</span>
                     <span>Contact</span>
                   </div>
                </div>
                <div className="max-w-[80%]">
                  <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-6" />
                  <h3 className="text-[28px] font-black text-[#111] dark:text-white mb-3 leading-tight">Crafting Digital<br/>Experiences.</h3>
                  <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-[260px] leading-relaxed">Full-stack software engineer building open-source tools and premium web applications.</p>
                  <div className="mt-8 flex gap-4">
                    <div className="h-9 w-28 rounded-full bg-[#111] dark:bg-white" />
                    <div className="h-9 w-28 rounded-full border border-zinc-200 dark:border-zinc-800" />
                  </div>
                </div>
                {/* Decorative background element in browser */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-zinc-100 dark:bg-zinc-900 rounded-tl-[100px] -mr-10 -mb-10" />
              </div>
            </div>

            {/* Mouse Cursor Animating */}
            <motion.div 
              animate={{ x: [100, 250, 100], y: [100, 200, 100] }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 z-50 pointer-events-none drop-shadow-xl"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#111] dark:text-white fill-white dark:fill-black">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                <path d="M13 13l6 6" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Floating Card 1: GitHub Import */}
          <motion.div animate="animate" variants={floatingCard1} className="absolute -left-12 lg:-left-20 top-10 z-30 pointer-events-none hidden sm:block">
            <div className="flex items-center gap-4 rounded-[16px] border border-zinc-200/80 bg-white/80 p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/90 dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-black">
                <Github className="h-5 w-5 text-[#111] dark:text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#111] dark:text-white">GitHub Imported</p>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">12 repositories synced</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Card 2: Theme Customization */}
          <motion.div animate="animate" variants={floatingCard2} className="absolute -right-6 lg:-right-12 top-1/2 z-30 pointer-events-none hidden sm:block">
            <div className="flex flex-col gap-3 rounded-[16px] border border-zinc-200/80 bg-white/80 p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/90 dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] w-48">
              <div className="flex items-center gap-2 mb-1">
                <Layout className="h-4 w-4 text-[#FFB400]" />
                <span className="text-[12px] font-bold text-[#111] dark:text-white">Theme Applied</span>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-[#111]" />
                <div className="h-6 w-6 rounded-full bg-zinc-200" />
                <div className="h-6 w-6 rounded-full bg-[#FFB400]" />
              </div>
            </div>
          </motion.div>

          {/* Floating Card 3: Deploy Success */}
          <motion.div animate="animate" variants={floatingCard3} className="absolute -left-4 lg:-left-10 bottom-16 z-30 pointer-events-none hidden sm:block">
            <div className="flex items-center gap-3 rounded-[16px] border border-zinc-200/80 bg-white/80 px-5 py-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/90 dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[13px] font-bold text-[#111] dark:text-white">Deploy Complete</span>
            </div>
          </motion.div>

          {/* Mascot (Overlapping at bottom right) */}
          <motion.div 
            animate={{ y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 lg:-bottom-16 lg:-right-16 z-40 w-[240px] lg:w-[320px] pointer-events-none"
          >
            <Image 
              src="/images/hero.png" 
              alt="BYOP Mascot" 
              width={600} 
              height={600} 
              className="w-full h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
