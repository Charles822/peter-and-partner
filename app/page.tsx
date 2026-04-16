import React from 'react';
import Image from 'next/image';
import { Code2, Bolt, FileText, Activity, Zap, Monitor, Database, MapPin } from 'lucide-react';
import { HeroTerminal } from './components/HeroTerminal';
import { FaqSection } from './components/FaqSection';
import { faqJsonLd } from './faq-data';

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />
      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-up">
        <nav className="glass-nav border border-gray-200/60 rounded-full pl-5 pr-2 py-2 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <a href="#" className="group flex items-center gap-2 text-sm text-gray-800 hover:text-black transition-colors">
            <div className="bg-black text-white p-1 rounded-md">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-montserrat font-semibold tracking-tight">On-Call CTO</span>
          </a>

          <div className="h-4 w-px bg-gray-200"></div>

          <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-500 font-montserrat">
            <a href="#health-check" className="hover:text-black transition-colors">Free Health Check</a>
            <a href="#ladder" className="hover:text-black transition-colors text-nowrap">The Ladder</a>
            <a href="#team" className="hover:text-black transition-colors">Team</a>
            <a href="#clients" className="hover:text-black transition-colors">Clients</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
            <a href="#book" className="hover:text-black transition-colors flex items-center gap-1">
              Contact
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tighter">LIVE</span>
            </a>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden lg:block"></div>

          <a href="#book" className="group bg-black text-white text-xs px-4 py-2.5 rounded-full hover:bg-gray-800 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 font-montserrat font-medium shadow-lg shadow-black/10 text-nowrap whitespace-nowrap">
            Book Health Check
          </a>
        </nav>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">

        {/* Hero Section — content on page background, no outer card */}
        <div className="relative overflow-hidden py-8 md:py-14 lg:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          <div className="flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto">

            {/* Badge */}
            <div className="animate-fade-up delay-100 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-mono mb-8 hover:bg-white hover:shadow-sm transition-all cursor-default text-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              FRACTIONAL CTO • MACAO
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-200 text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8 text-gray-900 font-medium font-serif">
              Macao&apos;s Technical Fixer. <br />
              <span className="italic text-gray-400">One Day a Week.</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-up delay-300 text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mb-10 font-montserrat font-medium text-balance">
              Your website is slow. Your tracking is blind. Your leads are unqualified. We sit in your Macao office one day a week and fix what&apos;s broken — from infrastructure to AI automation.
            </p>

            {/* Buttons */}
            <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-4 w-full">
              <button className="bg-gray-900 text-white pl-6 pr-5 py-3.5 rounded-xl text-sm hover:bg-black hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-montserrat font-medium shadow-xl shadow-gray-900/20">
                Book a 20-Min Health Check
                <Bolt className="w-4 h-4" />
              </button>
              <button className="bg-white border border-gray-200 text-gray-600 px-6 py-3.5 rounded-xl text-sm hover:border-gray-400 hover:text-gray-900 transition-all duration-300 font-montserrat font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                See Our Process
              </button>
            </div>

            <HeroTerminal />
          </div>
        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full py-12 mt-4 border-b border-gray-100 marquee-mask relative overflow-hidden">
          <div className="flex w-[200%] animate-infinite-scroll">
              <div className="flex items-center justify-around w-1/2 gap-12 px-8">
                  <span className="font-semibold text-lg font-montserrat opacity-50">Next.js</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">AI Agents</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">Meta CAPI</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">GTM Server-Side</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">SAP Integration</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">Shopify/WP</span>
              </div>
               <div className="flex items-center justify-around w-1/2 gap-12 px-8">
                  <span className="font-semibold text-lg font-montserrat opacity-50">Next.js</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">AI Agents</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">Meta CAPI</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">GTM Server-Side</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">SAP Integration</span>
                  <span className="font-semibold text-lg font-montserrat opacity-50">Shopify/WP</span>
              </div>
          </div>
        </div>

        {/* The Digital Growth Ladder Section */}
        <div id="ladder" className="py-24">
          <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif text-center">The Digital Growth Ladder</h2>
          <p className="text-center text-gray-500 font-montserrat max-w-2xl mx-auto mb-16 leading-relaxed">
            Senior engineers in your Macao office one day a week — fixing what&apos;s broken on the spot, not selling slide decks.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 font-montserrat">Step 1: Technical Relief</h3>
                  <p className="text-sm italic text-gray-600 font-montserrat mb-3">The Doctor — Stop the bleeding.</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                      Slow WordPress, SAP or API hangs, broken forms, and blind Meta / Google Pixel / CAPI tracking. We stabilize the stack so your existing engine works the way it should.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Stop the bleeding</span>
              </div>

              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 font-montserrat">Step 2: Data Architecture</h3>
                  <p className="text-sm italic text-gray-600 font-montserrat mb-3">The Pipes — Build the brain.</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                      Clean historical data, automated pipelines, CRM hygiene, and cross-platform integration — so customer data is a reliable asset, not a spreadsheet gamble. Measurement and server-side tracking sit on top of that foundation.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Build the brain</span>
              </div>

              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Monitor className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1 font-montserrat">Step 3: Operational AI</h3>
                  <p className="text-sm italic text-gray-600 font-montserrat mb-3">Scale the output.</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                      With trustworthy data from Step 2, we deploy custom AI agents to qualify leads, handle support, and automate internal workflows — so your team spends time on decisions, not repetitive triage.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Scale the output</span>
              </div>
          </div>
        </div>

        {/* Team Section */}
        <div id="team" className="py-24 border-t border-gray-100">
          <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif text-center">The Team</h2>
          <p className="text-center text-gray-500 font-montserrat max-w-2xl mx-auto mb-16">
            Macao-based engineering with strategy support — built for operators who want fixes, not slide decks.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <article className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left">
              <div className="relative aspect-[4/5] w-full max-h-80 mx-auto mb-6 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="/team/charles.jpg"
                  alt="Charles Fauchet, CTO and engineering lead"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 font-montserrat">Charles Fauchet</h3>
              <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">CTO / Engineering</p>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat">
                Hands-on technical lead: architecture, integrations, performance, and shipping fixes in your stack — not advice from the sidelines.
              </p>
            </article>
            <article className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 text-left">
              <div className="relative aspect-[4/5] w-full max-h-80 mx-auto mb-6 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="/team/peter.jpg"
                  alt="Peter Mason, CEO and strategy (AI agent)"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 font-montserrat">Peter Mason</h3>
              <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4">CEO / Strategy (AI agent)</p>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat">
                Runs strategy and client operations with consistent follow-through — an AI agent partner that keeps priorities aligned while Charles executes in the codebase.
              </p>
            </article>
          </div>
        </div>

        {/* Clients / Use Cases */}
        <div id="clients" className="py-24">
          <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-16 font-serif text-center">What We&apos;ve Built</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left">
              <h3 className="text-lg font-semibold font-montserrat text-gray-900 mb-2">Rare Champagne</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                From standalone CMS to database and CRM integration — one coherent data layer for catalog and customers.
              </p>
              <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Data architecture</span>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left">
              <h3 className="text-lg font-semibold font-montserrat text-gray-900 mb-2">Agence Symbiose</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                Meta lead automation — less manual triage, faster handoff from ad click to qualified conversation.
              </p>
              <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Data architecture</span>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left">
              <h3 className="text-lg font-semibold font-montserrat text-gray-900 mb-2">Nautical Vibes</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                Server-side tracking with Google Tag Manager — more reliable measurement and cleaner signal for campaigns.
              </p>
              <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Data architecture</span>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 text-left">
              <h3 className="text-lg font-semibold font-montserrat text-gray-900 mb-2">VoxAI</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-montserrat mb-4">
                Operational AI agent on OpenClaw plus workflow automation — hands-on ops support that runs around the clock.
              </p>
              <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">Operational AI</span>
            </div>
          </div>
        </div>

        {/* Lead Magnet Section */}
        <div id="health-check" className="py-16 bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity className="w-64 h-64 text-gray-900" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 relative z-10 text-left">
               <div className="max-w-3xl">
                  <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif">Is your Tech Stack Leaking Revenue?</h2>
                  <p className="text-gray-500 font-montserrat leading-relaxed">
                    Most teams lose money in three places: a fragile stack and blind tracking (technical relief), messy or silo&apos;d data (data architecture), and manual bottlenecks that better automation could lift (operational AI). In 20 minutes we stress-test where you&apos;re bleeding — straight engineering triage for Macao businesses, not a slide deck. Zero cost. Zero obligation.
                  </p>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0 border border-emerald-100/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Macao · engineering triage
               </div>
          </div>

          <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6 relative z-10">What we check in the health check</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              <div className="text-left p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col h-full">
                  <div className="mb-4">
                    <Zap className="w-9 h-9 text-gray-900" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-gray-900 mb-2">Technical relief</h3>
                  <p className="text-sm text-gray-500 font-montserrat leading-relaxed flex-1">
                    Slow sites, SAP/API hangs, broken forms, and Meta / Google / CAPI gaps — is the engine actually working?
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mt-4">Stop the bleeding</span>
              </div>
              <div className="text-left p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col h-full">
                  <div className="mb-4">
                    <Database className="w-9 h-9 text-gray-900" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-gray-900 mb-2">Data architecture</h3>
                  <p className="text-sm text-gray-500 font-montserrat leading-relaxed flex-1">
                    CRM hygiene, pipelines, integrations, and whether measurement reflects reality — not just ad platform reports.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mt-4">Build the brain</span>
              </div>
              <div className="text-left p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col h-full">
                  <div className="mb-4">
                    <Monitor className="w-9 h-9 text-gray-900" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-gray-900 mb-2">Operational AI</h3>
                  <p className="text-sm text-gray-500 font-montserrat leading-relaxed flex-1">
                    Where agents or workflow automation would pay off once data and systems are trustworthy — leads, support, internal ops.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mt-4">Scale the output</span>
              </div>
              <div className="text-left p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col h-full">
                  <div className="mb-4">
                    <MapPin className="w-9 h-9 text-gray-900" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-gray-900 mb-2">How we work</h3>
                  <p className="text-sm text-gray-500 font-montserrat leading-relaxed flex-1">
                    Fractional CTO support in your Macao office — senior engineers who fix on the spot when there&apos;s a real fit.
                  </p>
                  <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest mt-4">On-site · one day / week</span>
              </div>
          </div>

          <p className="mt-10 text-gray-600 font-montserrat text-sm md:text-base leading-relaxed max-w-3xl relative z-10">
            You leave with a short prioritized readout — what to fix first, mapped to <span className="font-medium text-gray-800">Relief → Data → AI</span> — and whether ongoing fractional CTO makes sense. <a href="#book" className="text-gray-900 font-medium underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors">Book the health check</a>.
          </p>
        </div>

        <FaqSection />

        {/* Footer */}
        <div id="book" className="py-20 border-t border-gray-200 mt-12 text-center">
          <h2 className="text-3xl font-medium mb-6 font-serif text-gray-900">Ready to Fix What&apos;s Broken?</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto font-montserrat font-medium leading-relaxed">
            Book your 20-minute health check. Zero cost. Zero obligation. We map findings to Relief → Data → AI and you get a clear next-step roadmap.
          </p>
          <div className="flex justify-center gap-4">
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-montserrat">
                  Claim Your Free Health Check
              </button>
              <button className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors font-montserrat">
                  Email Peter
              </button>
          </div>
          <p className="mt-12 text-xs text-gray-400 font-mono uppercase tracking-widest">
             © 2026 On-Call CTO • Unblocking Macao&apos;s Digital Economy.
          </p>
        </div>
      </main>
    </>
  );
}
