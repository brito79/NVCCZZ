'use client'

import { motion } from 'framer-motion';
import { ChatbotProvider } from '@/components/chatbot';
import { ArrowRight, Users, TrendingUp, Lightbulb, Building, Globe, Award, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Venture Capital Funding",
      description: "Access to capital for startups and growth-stage businesses across all sectors."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Incubation Programs",
      description: "Comprehensive mentorship and training to accelerate your business growth."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Private Equity",
      description: "Strategic investments for established companies looking to scale."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Market Access",
      description: "Connect with networks and opportunities across Zimbabwe and beyond."
    }
  ];

  const sectors = [
    "Technology & ICT",
    "Agriculture & Agro-processing", 
    "Manufacturing",
    "Renewable Energy",
    "Healthcare & Biotechnology",
    "Financial Services & Fintech",
    "Tourism & Hospitality",
    "Education & Training"
  ];

  return (
    <ChatbotProvider position="bottom-right">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Arcus</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/auth"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Services
                </Link>
                <Link 
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Zimbabwe's Premier
                <span className="text-blue-400 block">Venture Capital</span>
                Institution
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Empowering entrepreneurs with innovative financing solutions, mentorship, and strategic support to drive economic growth across Zimbabwe.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center"
                >
                  Apply for Funding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link 
                  href="/auth"
                  className="border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Comprehensive support for businesses at every stage of growth
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Investment Sectors</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                We invest across diverse sectors to drive innovation and economic growth
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectors.map((sector, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center hover:bg-white/10 transition-colors"
                >
                  <p className="text-white font-medium">{sector}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">100+</div>
                <div className="text-gray-300">Businesses Funded</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">$50M+</div>
                <div className="text-gray-300">Capital Deployed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">8</div>
                <div className="text-gray-300">Investment Sectors</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to take your business to the next level? Let's discuss how we can help.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300">
                  4th Floor Blue Bridge North<br />
                  Eastgate Mall, Harare
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-300">
                  +263 242 709325
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-blue-400 mb-4 flex justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-300">
                  info@nvccz.com
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              © 2024 National Venture Capital Company of Zimbabwe. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ChatbotProvider>
  );
};

export default LandingPage; 