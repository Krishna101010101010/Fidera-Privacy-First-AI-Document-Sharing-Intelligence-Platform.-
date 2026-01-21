'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ClickSpark from '@/components/ClickSpark';

const Hyperspeed = dynamic(() => import('@/components/Hyperspeed'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'PP Neue Montreal', 'Poppins', sans-serif" }}>
      {/* Navigation - Fixed */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="white" />
              <path d="M12 28V12H24V15H16V18H23V21H16V28H12Z" fill="black" />
            </svg>
            <span className="text-2xl font-semibold tracking-tight text-white" style={{ color: '#ffffff' }}>idera</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition text-sm tracking-wide">How It Works</a>
            <a href="#features" className="text-gray-400 hover:text-white transition text-sm tracking-wide">Features</a>
            <a href="#security" className="text-gray-400 hover:text-white transition text-sm tracking-wide">Security</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm tracking-wide">Pricing</a>
          </div>

          <ClickSpark sparkColor="#fff" sparkCount={8}>
            <button className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
              Get Early Access
            </button>
          </ClickSpark>
        </div>
      </nav>

      {/* Hero Section - BLACK with Hyperspeed */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Hyperspeed Background */}
        <div className="absolute inset-0 w-full h-full">
          <Hyperspeed
            effectOptions={{
              distortion: 'turbulentDistortion',
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 3,
              fov: 90,
              fovSpeedUp: 150,
              speedUp: 2,
              carLightsFade: 0.4,
              totalSideLightSticks: 50,
              lightPairsPerRoadWay: 50,
              shoulderLinesWidthPercentage: 0.05,
              brokenLinesWidthPercentage: 0.1,
              brokenLinesLengthPercentage: 0.5,
              lightStickWidth: [0.12, 0.5],
              lightStickHeight: [1.3, 1.7],
              movingAwaySpeed: [60, 80],
              movingCloserSpeed: [-120, -160],
              carLightsLength: [400 * 0.05, 400 * 0.15],
              carLightsRadius: [0.05, 0.14],
              carWidthPercentage: [0.3, 0.5],
              carShiftX: [-0.2, 0.2],
              carFloorSeparation: [0.05, 1],
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
                rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
                sticks: 0xc5e8eb
              }
            }}
          />
        </div>

        {/* Hero Content - Positioned at bottom */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center mt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <span className="text-sm font-medium text-white/80 tracking-wide">Privacy-First Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8">
              <span className="text-white" style={{ color: '#ffffff' }}>Share Documents</span>
              <br />
              <span className="text-gray-300" style={{ color: '#d1d5db' }}>
                Without the Risk
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: '#d1d5db' }}>
              Automatic metadata stripping, AI-powered intelligence, and zero-hold deletion.
              The modern way to share sensitive documents.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <ClickSpark sparkColor="#fff" sparkCount={12} sparkRadius={20}>
                <button className="px-10 py-4 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all hover:scale-105">
                  Get Early Access
                </button>
              </ClickSpark>

              <button className="px-10 py-4 bg-white/10 text-white rounded-full font-medium text-lg border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                See How It Works
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>2-minute setup</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ============ WHITE SECTION STARTS HERE ============ */}

      {/* Problem Statement - WHITE */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-gray-900">
              Your Documents Are <span className="text-red-500">Leaking Data</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Every file you share contains hidden metadata that exposes your location, device, and identity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📍', title: 'GPS Location', desc: 'Exact coordinates embedded in photos and documents' },
              { icon: '🔍', title: 'Device Info', desc: 'Camera model, software version, serial numbers' },
              { icon: '👤', title: 'Identity Data', desc: 'Author names, company info, editing history' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - WHITE */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-gray-900">
              The Transparency Gate
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              See exactly what's hidden in your files before you share them.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Drop your document', icon: '⬆️' },
              { step: '02', title: 'Reveal', desc: 'See hidden metadata', icon: '🔍' },
              { step: '03', title: 'Sanitize', desc: 'Strip risky data', icon: '🧼' },
              { step: '04', title: 'Share', desc: 'Send with confidence', icon: '✨' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-gray-50 rounded-3xl border border-gray-200 text-center hover:bg-white hover:shadow-xl hover:border-gray-300 transition-all group"
              >
                <div className="text-xs font-mono text-gray-400 mb-4 tracking-widest">{item.step}</div>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - BLACK */}
      <section id="features" className="py-32 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Built for Privacy
            </h2>
            <p className="text-xl text-gray-400">Enterprise-grade security meets beautiful design</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Metadata Transparency',
                desc: 'See every hidden field before sharing. Full visibility into GPS, device info, and tracking data.'
              },
              {
                icon: '⏰',
                title: 'ZeroHold™ Technology',
                desc: 'Files auto-delete at expiry. Your sensitive data doesn\'t linger on our servers.'
              },
              {
                icon: '🤖',
                title: 'AI-Powered Insights',
                desc: 'Chat with your documents using RAG. Smart analysis without compromising privacy.'
              },
              {
                icon: '👁️',
                title: 'View-Only Sharing',
                desc: 'Recipients can view but never download. Watermarked, tracked, and secure.'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-gray-800 border border-gray-700 rounded-3xl hover:bg-gray-750 transition-all"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security - WHITE */}
      <section id="security" className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block px-5 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium mb-6">
              Security First
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-gray-900">
              50+ Metadata Fields Stripped
            </h2>
            <p className="text-xl text-gray-500">GPS, device info, editing history — all removed before sharing</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'GPS Coordinates', 'Camera Make/Model', 'Software Version', 'Edit History',
              'User Names', 'Company Data', 'IP Addresses', 'Device IDs',
              'Creation Dates', 'File Paths', 'Serial Numbers', 'Printer Info'
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="p-4 bg-gray-50 rounded-2xl border border-gray-200"
              >
                <div className="text-xs font-bold text-red-500 mb-1">REMOVED</div>
                <div className="text-sm font-medium text-gray-900">{item}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - LIGHT GRAY */}
      <section id="pricing" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-gray-900">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-500">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'Perfect for personal use',
                features: ['5 files per month', 'Basic metadata stripping', '24h expiration', 'View-only sharing'],
                featured: false
              },
              {
                name: 'Pro',
                price: '$19',
                desc: 'For professionals',
                features: ['Unlimited files', 'Deep metadata analysis', 'Custom expiration', 'AI chat with docs', 'Priority support'],
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'For teams',
                features: ['Everything in Pro', 'Team management', 'SSO integration', 'Custom branding', 'SLA guarantee'],
                featured: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-3xl border ${plan.featured
                  ? 'bg-gray-900 text-white border-gray-900 scale-105 shadow-2xl'
                  : 'bg-white border-gray-200 text-gray-900'
                  }`}
              >
                {plan.featured && (
                  <div className="inline-block px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold mb-4">
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg font-normal opacity-60">/mo</span>}
                </div>
                <p className={`${plan.featured ? 'text-gray-400' : 'text-gray-500'} mb-8`}>{plan.desc}</p>
                <ul className="space-y-3 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className={`${plan.featured ? 'text-green-400' : 'text-green-500'}`}>✓</span>
                      <span className={plan.featured ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <ClickSpark sparkColor={plan.featured ? '#fff' : '#000'}>
                  <button className={`w-full py-4 rounded-xl font-medium transition-all ${plan.featured
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                    Get Started
                  </button>
                </ClickSpark>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - WHITE */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
              Questions & Answers
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'How does Fidera protect my privacy?',
                a: 'Fidera strips 50+ metadata fields from documents before sharing, including GPS, device info, and editing history. We use AES-256 encryption and ZeroHold™ ensures permanent deletion at expiration.'
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
                a: 'Files are permanently deleted from our servers using ZeroHold™. This includes all copies, metadata, and AI-generated embeddings. No recovery is possible.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-100 transition"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - BLACK */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 bg-gray-900 text-white rounded-[40px]"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Ready to protect your documents?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands securing their sensitive files with Fidera
            </p>
            <ClickSpark sparkColor="#fff" sparkCount={14} sparkRadius={22}>
              <button className="px-12 py-5 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all">
                Get Started Free →
              </button>
            </ClickSpark>
            <p className="text-sm text-gray-500 mt-8">No credit card required • 2-minute setup</p>
          </motion.div>
        </div>
      </section>

      {/* Footer - WHITE */}
      <footer className="border-t border-gray-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="#111827" />
                  <path d="M12 28V12H24V15H16V18H23V21H16V28H12Z" fill="white" />
                </svg>
                <span className="text-xl font-semibold text-gray-900">idera</span>
              </div>
              <p className="text-gray-500 text-sm">
                Privacy-first document sharing for the modern world.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#features" className="hover:text-gray-900 transition">Features</a></li>
                <li><a href="#security" className="hover:text-gray-900 transition">Security</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2026 Fidera. All rights reserved.</p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-gray-900 transition">Twitter</a>
              <a href="#" className="hover:text-gray-900 transition">GitHub</a>
              <a href="#" className="hover:text-gray-900 transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
