'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ClickSpark from '@/components/ClickSpark';
import PixelCard from '@/components/PixelCard';

const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});

export default function MarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-xl" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Fidera
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#security" className="text-gray-300 hover:text-white transition">Security</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
          </div>

          <ClickSpark sparkColor="#06b6d4" sparkCount={10}>
            <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Get Early Access
            </button>
          </ClickSpark>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hyperspeed Background */}
        <div className="absolute inset-0 w-full h-full">
          <Hyperspeed
            effectOptions={{
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x8b5cf6,
                brokenLines: 0x06b6d4,
                leftCars: [0x8b5cf6, 0x3b82f6, 0x06b6d4],
                rightCars: [0x06b6d4, 0x3b82f6, 0x8b5cf6],
                sticks: 0x06b6d4
              }
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-full border border-purple-500/30">
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Privacy-First AI Document Sharing Platform
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Share Documents
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Without the Data Leak
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Automatic metadata stripping, AI-powered intelligence, and zero-hold deletion.
              The future of secure document sharing is here.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <ClickSpark sparkColor="#8b5cf6" sparkCount={12} sparkRadius={20}>
                <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                  Get Early Access
                </button>
              </ClickSpark>

              <ClickSpark sparkColor="#06b6d4" sparkCount={8}>
                <button className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                  See How It Works
                </button>
              </ClickSpark>
            </div>

            <div className="flex items-center justify-center gap-8 pt-12 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2-minute setup</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="relative py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Your Documents Are Leaking Data
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Every file you share contains hidden metadata that exposes your location, device, identity, and more.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📍', title: 'GPS Location', desc: 'Your exact coordinates embedded in photos' },
              { icon: '🔍', title: 'Device Info', desc: 'Camera model, software, serial numbers' },
              { icon: '👤', title: 'Identity Data', desc: 'Author names, company info, edit history' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-gradient-to-br from-red-950/20 to-orange-950/20 backdrop-blur-sm border border-red-500/20 rounded-2xl"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-red-400">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              The <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Transparency Gate</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See exactly what's hidden in your files before you share them. Complete transparency, complete control.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Drop your document', icon: '⬆️' },
              { step: '02', title: 'Reveal', desc: 'See hidden metadata exposed', icon: '🔍' },
              { step: '03', title: 'Sanitize', desc: 'Strip all risky data', icon: '🧼' },
              { step: '04', title: 'Share', desc: 'Send with confidence', icon: '✨' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <PixelCard variant="indigo" className="w-full h-auto">
                  <div className="p-8 text-center relative z-10">
                    <div className="text-sm font-mono text-purple-400 mb-4">{item.step}</div>
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </PixelCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-black via-cyan-950/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Built for <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Privacy</span>
            </h2>
            <p className="text-xl text-gray-400">Enterprise-grade security meets beautiful user experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Metadata Transparency',
                desc: 'See every hidden field before sharing. Full visibility into GPS, device info, and tracking data.',
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                icon: '⏰',
                title: 'ZeroHold™ Technology',
                desc: 'Files auto-delete at expiry. Your sensitive data doesn\'t linger on our servers.',
                gradient: 'from-cyan-600 to-blue-600'
              },
              {
                icon: '🤖',
                title: 'AI-Powered Insights',
                desc: 'Chat with your documents using RAG. Smart analysis without compromising privacy.',
                gradient: 'from-blue-600 to-purple-600'
              },
              {
                icon: '👁️',
                title: 'View-Only Sharing',
                desc: 'Recipients can view but never download. Watermarked, tracked, and secure.',
                gradient: 'from-pink-600 to-purple-600'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-white/30 transition-all hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section id="security" className="relative py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block px-6 py-2 bg-red-900/20 border border-red-500/30 rounded-full mb-6">
              <span className="text-red-400 font-semibold">Security First</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                50+ Metadata Fields
              </span>
              <br />
              Stripped Automatically
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'GPS Coordinates',
              'Camera Make/Model',
              'Software Version',
              'Edit History',
              'User Names',
              'Company Data',
              'IP Addresses',
              'Device IDs',
              'Creation Dates',
              'File Paths',
              'Serial Numbers',
              'Printer Info'
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="p-4 bg-gradient-to-br from-red-950/20 to-orange-950/20 border border-red-500/20 rounded-xl backdrop-blur-sm"
              >
                <div className="text-xs font-bold text-red-400 mb-2">REMOVED</div>
                <div className="text-sm font-semibold">{item}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your privacy needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'Perfect for personal use',
                features: ['5 files per month', 'Basic metadata stripping', '24h expiration', 'View-only sharing'],
                cta: 'Start Free',
                featured: false
              },
              {
                name: 'Pro',
                price: '$19',
                desc: 'For professionals',
                features: ['Unlimited files', 'Deep metadata analysis', 'Custom expiration', 'AI chat with docs', 'Priority support'],
                cta: 'Get Pro',
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'For teams & organizations',
                features: ['Everything in Pro', 'Team management', 'SSO integration', 'Custom branding', 'SLA guarantee'],
                cta: 'Contact Sales',
                featured: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl border ${plan.featured
                    ? 'bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border-purple-500/50 scale-105'
                    : 'bg-white/5 border-white/10'
                  } backdrop-blur-sm relative overflow-hidden`}
              >
                {plan.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-xs font-bold">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-5xl font-black mb-2">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-gray-400">/mo</span>}
                </div>
                <p className="text-gray-400 mb-8">{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <ClickSpark sparkColor={plan.featured ? '#06b6d4' : '#8b5cf6'}>
                  <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.featured
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:shadow-lg hover:shadow-cyan-500/50'
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}>
                    {plan.cta}
                  </button>
                </ClickSpark>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Fidera protect my privacy?',
                a: 'Fidera automatically strips 50+ metadata fields from your documents before sharing, including GPS coordinates, device information, and editing history. We use industry-standard encryption and our ZeroHold™ technology ensures files are permanently deleted at expiration.'
              },
              {
                q: 'What file formats are supported?',
                a: 'We support PDFs, Word documents (DOCX), images (JPG, PNG), and various other formats. Our deep metadata extraction works across all major document types.'
              },
              {
                q: 'Can recipients download my files?',
                a: 'No. Recipients can only view files through our secure viewer. All content is watermarked and tracked. Downloads are disabled to prevent unauthorized distribution.'
              },
              {
                q: 'How does the AI chat feature work?',
                a: 'Our AI uses RAG (Retrieval-Augmented Generation) with local LLM models to analyze your documents. All processing happens securely, and we never use your data to train models.'
              },
              {
                q: 'What happens when files expire?',
                a: 'Files are permanently deleted from our servers using our ZeroHold™ technology. This includes all copies, metadata, and AI-generated embeddings. No recovery is possible.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition"
                >
                  <span className="font-bold text-lg pr-8">{faq.q}</span>
                  <svg
                    className={`w-6 h-6 text-purple-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-16 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to take control of your <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">privacy</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands protecting their sensitive files with Fidera's privacy-first platform
            </p>
            <ClickSpark sparkColor="#8b5cf6" sparkCount={16} sparkRadius={25}>
              <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-xl shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                Get Started Free
              </button>
            </ClickSpark>
            <p className="text-sm text-gray-500 mt-6">No credit card required • 2-minute setup • Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-xl" />
                <span className="text-2xl font-bold">Fidera</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Privacy-first document sharing for the modern world.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#security" className="hover:text-white transition">Security</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Fidera. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
