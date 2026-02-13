'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FOOTER_SECTIONS, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {FOOTER_SECTIONS.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h4 className="font-bold text-white mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-foreground/60 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h4 className="font-bold text-white mb-4 text-lg">Connect</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SOCIAL_LINKS.map((social) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center justify-start gap-2"
                >
                  <div className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center text-primary hover:shadow-neon transition-all duration-300 text-xl">
                    {social.icon}
                  </div>
                  <span className="text-sm text-foreground/60">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/50"
        >
          <p>© 2026 AK with AI. All rights reserved.</p>
          <Link href="/admin" className="hover:text-primary transition-colors">
            Admin Login
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
