import React from 'react';
import { Code2, Bolt, FileText, Activity, ShieldCheck, Filter, MessageSquare, Headphones, ArrowRight, Database, FileCode, Zap, Monitor } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-up">
        <nav className="glass-nav border border-gray-200/60 rounded-full pl-5 pr-2 py-2 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
          <a href="#" className="group flex items-center gap-2 text-sm text-gray-800 hover:text-black transition-colors">
            <div className="bg-black text-white p-1 rounded-md">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-montserrat font-semibold tracking-tight">Peter & Partner</span>
          </a>

          <div className="h-4 w-px bg-gray-200"></div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 font-montserrat">
            <a href="#health-check" className="hover:text-black transition-colors">Health Check</a>
            <a href="#solutions" className="hover:text-black transition-colors">Solutions</a>
            <a href="#contact" className="hover:text-black transition-colors flex items-center gap-1">
              Contact
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tighter">LIVE</span>
            </a>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden md:block"></div>

          <a href="#book" className="group bg-black text-white text-xs px-4 py-2.5 rounded-full hover:bg-gray-800 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 font-montserrat font-medium shadow-lg shadow-black/10 text-nowrap whitespace-nowrap">
            Book Health Check
          </a>
        </nav>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        
        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-14 lg:p-20 shadow-sm border border-gray-100 relative overflow-hidden group">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

          <div className="flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="animate-fade-up delay-100 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-mono mb-8 hover:bg-white hover:shadow-sm transition-all cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MACAO’S FRACTIONAL TECH TEAM • ON-CALL SUPPORT
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-200 text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8 text-gray-900 font-medium font-serif">
              Unblock your <br />
              <span className="italic text-gray-400">Revenue.</span>
            </h1>

            {/* Description */}
            <p className="animate-fade-up delay-300 text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mb-10 font-montserrat font-medium text-balance">
              We fix the technical debt that’s costing you sales. From broken forms to AI-driven lead filtering, we provide on-call engineering for Macao businesses.
            </p>

            {/* Buttons */}
            <div className="animate-fade-up delay-500 flex flex-wrap justify-center gap-4 w-full">
              <button className="bg-gray-900 text-white pl-6 pr-5 py-3.5 rounded-xl text-sm hover:bg-black hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-montserrat font-medium shadow-xl shadow-gray-900/20">
                Get Free Health Check
                <Bolt className="w-4 h-4" />
              </button>
              <button className="bg-white border border-gray-200 text-gray-600 px-6 py-3.5 rounded-xl text-sm hover:border-gray-400 hover:text-gray-900 transition-all duration-300 font-montserrat font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Our Solutions
              </button>
            </div>

            {/* Code Preview Snippet */}
            <div className="mt-16 w-full max-w-3xl animate-fade-up delay-500 mx-auto">
               <div className="rounded-xl border border-gray-200 bg-[#111] shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#1a1a1a]">
                     <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                     </div>
                     <div className="mx-auto text-[10px] text-gray-500 font-mono">technical-health-check.ts</div>
                  </div>
                  <div className="p-6 text-left overflow-x-auto">
                     <pre className="font-mono text-xs md:text-sm leading-relaxed"><code className="language-typescript"><span className="text-purple-400">export async function</span> <span className="text-blue-400">Audit</span>(domain: string) {"{"}
  <span className="text-purple-400">const</span> leaks = <span className="text-purple-400">await</span> <span className="text-blue-400">scanForTechDebt</span>(domain);
  
  <span className="text-gray-500">// Identifying revenue-blocking issues</span>
  <span className="text-purple-400">return</span> {"{"}
    tracking: leaks.pixel_status,    <span className="text-gray-500">// Blind or Active</span>
    speed: leaks.load_time,         <span className="text-gray-500">// CAC Impact</span>
    automation: leaks.ai_ready      <span className="text-gray-500">// Efficiency Opportunity</span>
  {"}"};
{"}"}</code></pre>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Marquee */}
        <div className="w-full py-12 mt-4 border-b border-gray-100 marquee-mask relative overflow-hidden">
          <div className="flex w-[200%] animate-infinite-scroll">
              <div className="flex items-center justify-around w-1/2 gap-12 px-8">
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Next.js</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">AI Agents</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Meta CAPI</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">GTM Server-Side</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">SAP Integration</span>
                  </div>
                   <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Shopify/WP</span>
                  </div>
              </div>
               {/* Duplicate for Marquee */}
               <div className="flex items-center justify-around w-1/2 gap-12 px-8">
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Next.js</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">AI Agents</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Meta CAPI</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">GTM Server-Side</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">SAP Integration</span>
                  </div>
                   <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                     <span className="font-semibold text-lg font-montserrat">Shopify/WP</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div id="solutions" className="py-24">
          <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Conversion */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-montserrat">The Conversion Fix</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat">
                      Stop guessing. We implement GTM Server-Side and Meta CAPI so your ads see 100% of your conversions. Accurate data = Lower CAC.
                  </p>
              </div>

              {/* Feature 2: Lead Filter */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Filter className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-montserrat">The Smart Filter</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat">
                      Custom AI agents that qualify every inquiry 24/7. Your team only talks to "High Intent" buyers. No more junk leads.
                  </p>
              </div>

              {/* Feature 3: Emergency Dev */}
              <div className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Monitor className="w-6 h-6 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-montserrat">The Emergency Dev</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-montserrat">
                      Website hanging? SAP issues? Shopify/WP technical debt? We are your on-call CTOs for one-off fixes and deep technical unblocking.
                  </p>
              </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div id="health-check" className="py-16 bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity className="w-64 h-64 text-gray-900" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10 text-left">
               <div>
                  <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif">The Impact</h2>
                  <p className="text-gray-500 font-montserrat">Real-world results for our partners.</p>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-4 md:mt-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Results
               </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="mb-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                  </div>
                  <span className="text-2xl font-bold font-mono">100%</span>
                  <span className="font-montserrat font-medium text-xs text-gray-600 uppercase mt-1">Tracking</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="mb-4">
                    <Zap className="w-10 h-10 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold font-mono">Zero</span>
                  <span className="font-montserrat font-medium text-xs text-gray-600 uppercase mt-1">Junk Leads</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="mb-4">
                    <MessageSquare className="w-10 h-10 text-purple-500" />
                  </div>
                  <span className="text-2xl font-bold font-mono">24/7</span>
                  <span className="font-montserrat font-medium text-xs text-gray-600 uppercase mt-1">Qualification</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="mb-4">
                    <Headphones className="w-10 h-10 text-orange-500" />
                  </div>
                  <span className="text-2xl font-bold font-mono">On-Call</span>
                  <span className="font-montserrat font-medium text-xs text-gray-600 uppercase mt-1">Expert Support</span>
              </div>
          </div>
        </div>

        {/* Engineering Blog Section (The Case Studies) */}
        <div id="blog" className="py-24">
           <div className="flex justify-between items-end mb-16">
              <div className="text-left">
                   <h2 className="text-4xl md:text-5xl tracking-tight text-gray-900 font-medium mb-4 font-serif">The Fix Archive</h2>
                  <p className="text-gray-500 font-montserrat max-w-lg">Technical deep-dives into how we unblock revenue for our clients.</p>
              </div>
               <a href="#" className="hidden md:flex items-center gap-2 text-sm font-semibold border-b border-gray-200 pb-1 hover:border-black transition-colors font-montserrat">
                  View Archive
                  <ArrowRight className="w-4 h-4" />
               </a>
           </div>

           <div className="flex flex-col gap-6">
              <article className="group relative flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg text-left">
                  <div className="w-full md:w-64 h-48 bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center text-gray-400">
                      <FileCode className="w-12 h-12" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-gray-100 font-montserrat">
                          Performance
                      </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mb-3">
                          <span>Case Study</span>
                          <span>•</span>
                          <span>Fix</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors font-serif">
                          <a href="#" className="before:absolute before:inset-0">Why iOS14 is costing you 30% of your Meta ROI</a>
                      </h3>
                      <p className="text-gray-500 font-montserrat text-sm leading-relaxed mb-4 line-clamp-2">
                          How we implemented Server-Side Tracking to recover lost conversion data and optimize ad delivery.
                      </p>
                      <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 font-montserrat font-medium">Tracking</span>
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 font-montserrat font-medium">ROI</span>
                      </div>
                  </div>
              </article>

               <article className="group relative flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg text-left">
                  <div className="w-full md:w-64 h-48 bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center text-gray-400">
                       <Database className="w-12 h-12" />
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-gray-100 font-montserrat">
                          Integrations
                      </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mb-3">
                          <span>Case Study</span>
                          <span>•</span>
                          <span>Solution</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors font-serif">
                          <a href="#" className="before:absolute before:inset-0">How to fix the 'SAP Hang' on your custom website</a>
                      </h3>
                      <p className="text-gray-500 font-montserrat text-sm leading-relaxed mb-4 line-clamp-2">
                          A guide to asynchronous SAP communication patterns that keep your site fast during data syncs.
                      </p>
                       <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 font-montserrat font-medium">SAP</span>
                          <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 font-montserrat font-medium">API</span>
                      </div>
                  </div>
              </article>
           </div>
        </div>

        {/* Footer */}
        <div id="book" className="py-20 border-t border-gray-200 mt-12 text-center">
          <h2 className="text-3xl font-medium mb-6 font-montserrat font-serif">Ready to Scale?</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto font-montserrat font-medium leading-relaxed">
            Book your 20-minute health check. Zero cost. Zero obligation. We find the technical friction, you get the roadmap.
          </p>
          <div className="flex justify-center gap-4">
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 font-montserrat">
                  Book Now
              </button>
              <button className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors font-montserrat">
                  Email Peter
              </button>
          </div>
          <p className="mt-12 text-xs text-gray-400 font-mono uppercase tracking-widest">
             © 2026 Peter & Partner • Unblocking Macao’s Digital Economy.
          </p>
        </div>
      </main>
    </>
  );
}
