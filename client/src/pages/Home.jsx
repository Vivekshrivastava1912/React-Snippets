import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCode, FaLock, FaRobot, FaArrowRight, FaGlobe, FaCopy, FaCheck } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Home = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const heroCode = `import React from 'react';\n\nexport const Button = () => {\n  return (\n    <button className="px-6 py-2 bg-white text-black rounded-sm">\n      Initialize Process\n    </button>\n  );\n};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(heroCode);
    setCopied(true);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 md:pt-20 pb-16 md:pb-24 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-100 opacity-[0.15] bg-linear-to-br from-blue-600 via-transparent to-purple-600 blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Text / Mobile Top */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 md:mb-8">
              <span className="w-2 h-2 rounded-sm bg-green-500 animate-pulse"></span>
              React Snippet Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter leading-[1.1] mb-6">
              Build UI <br className="hidden lg:block" />
              <span className="font-black text-transparent bg-clip-text bg-linear-to-br from-white via-yellow-200 to-yellow-500">
                Faster.
              </span>
            </h1>

            <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
              Stop rewriting the same components. Discover, save, and reuse premium React snippets instantly. Elevate your development workflow with our intelligent code vault.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/components"
                className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-black text-xs md:text-sm uppercase tracking-widest font-bold rounded-sm hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.25)]"
              >
                Explore Library <FaArrowRight size={12} />
              </Link>
              <Link
                to="/aicomponent-gen"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white text-xs md:text-sm uppercase tracking-widest font-bold rounded-sm hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <FaCode size={14} /> Open AI Lab
              </Link>
            </div>
          </div>

          {/* Right Preview / Mobile Bottom */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none mx-auto lg:mt-0 mt-8">
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-linear-to-r from-yellow-500/20 to-transparent blur-xl transform group-hover:scale-105 transition-transform duration-700 pointer-events-none"></div>
              <div className="bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden shadow-2xl relative transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] transition-transform duration-700 group-hover:rotate-0">

                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500/10"></div>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Button.jsx</div>
                  <div className="flex gap-2 text-gray-500 relative z-20">
                    <button onClick={handleCopy} className="hover:text-yellow-500 transition-colors" title="Copy to clipboard">
                      {copied ? <FaCheck size={12} className="text-yellow-500" /> : <FaCopy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="p-6 font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed text-gray-400 overflow-x-auto bg-black/40 pb-16">
                  <div className="flex"><span className="text-yellow-500">import</span>&nbsp;React&nbsp;<span className="text-yellow-500">from</span>&nbsp;<span className="text-green-400">'react'</span>;</div>
                  <br />
                  <div className="flex"><span className="text-yellow-500">export const</span>&nbsp;<span className="text-blue-400">Button</span>&nbsp;=&nbsp;()&nbsp;<span className="text-yellow-500">=&gt;</span>&nbsp;&#123;</div>
                  <div className="flex">&nbsp;&nbsp;<span className="text-yellow-500">return</span>&nbsp;(</div>
                  <div className="flex">&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">button</span>&nbsp;<span className="text-yellow-300">className</span>=<span className="text-green-400">"px-6 py-2 bg-yellow-500 text-black rounded-sm"</span>&gt;</div>
                  <div className="flex">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Initialize Process</div>
                  <div className="flex">&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">button</span>&gt;</div>
                  <div className="flex">&nbsp;&nbsp;);</div>
                  <div className="flex">&#125;;</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 3. CORE FEATURES SECTION */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500/50 mb-3">Platform Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Everything you need.</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FaGlobe size={20} />}
              title="Global Components"
              description="Explore the public library of React components. Search, discover, and copy snippets with a single click."
              onClick={() => navigate('/components')}
            />
            <FeatureCard
              icon={<FaLock size={20} />}
              title="Code Vault"
              description="Save your React snippets to your personal account. Choose between public or private visibility."
              onClick={() => navigate(user?._id ? '/addsnippet' : '/login')}
            />
            <FeatureCard
              icon={<FaRobot size={20} />}
              title="AI Lab Workspace"
              description="An intuitive workspace to write, manage, and refine your React components before publishing."
              onClick={() => navigate('/aicomponent-gen')}
            />
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA SECTION */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8">Ready to scale?</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Join developers who are already using React Snippets to streamline their component management. Stop typing, start building.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user?._id ? (
              <Link
                to="/register"
                className="w-full sm:w-auto px-12 py-4 bg-yellow-500 text-black text-xs md:text-sm uppercase tracking-widest font-bold rounded-sm hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] active:scale-95"
              >
                Create Account
              </Link>
            ) : (
              <Link
                to="/components"
                className="w-full sm:w-auto px-12 py-4 bg-yellow-500 text-black text-xs md:text-sm uppercase tracking-widest font-bold rounded-sm hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)] active:scale-95"
              >
                Go to Library
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

const StepCard = ({ number, title, desc, onClick }) => (
  <div
    onClick={onClick}
    className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left bg-[#050505] p-8 md:p-10 border border-white/5 rounded-sm hover:border-yellow-500/30 cursor-pointer transition-all group"
  >
    <div className="w-14 h-14 bg-[#0a0a0a] border border-white/10 rounded-sm flex items-center justify-center text-lg font-black text-white mb-8 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
      {number}
    </div>
    <h4 className="text-base md:text-lg font-bold mb-3 tracking-tight uppercase group-hover:text-yellow-500 transition-colors">{title}</h4>
    <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{desc}</p>
  </div>
)

const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-8 md:p-10 bg-[#050505] border border-white/5 rounded-sm hover:border-yellow-500/30 cursor-pointer hover:bg-yellow-500/[0.02] transition-all group flex flex-col justify-between h-full"
    >
      <div>
        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center mb-8 group-hover:bg-yellow-500 transition-all duration-300">
          <div className="text-white group-hover:text-black transition-colors">{icon}</div>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 group-hover:text-yellow-500 transition-colors">{title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5">
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600 group-hover:text-yellow-500 transition-colors">Explore Feature →</span>
      </div>
    </div>
  )
}

export default Home;
