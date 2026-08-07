import { Link } from 'react-router-dom';
import { CreditCard, Mail, Send, ShieldCheck, ArrowRight, Bot } from 'lucide-react';

function Footer({ onOpenLegal }) {
  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Debit Cards', path: '/cards' },
      { name: 'Compare Cards', path: '/compare' },
      { name: 'AI Advisor', path: '/ai-advisor' },
      { name: 'Saved Favorites', path: '/favorites' },
      { name: 'Top Banks', path: '/banks' },
    ],
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Founders & Team', path: '/founders' },
      { name: 'Contact Support', path: '/contact' },
      { name: 'Privacy Policy', type: 'privacy' },
      { name: 'Terms & Conditions', type: 'terms' },
      { name: 'Disclaimer', type: 'disclaimer' },
    ],
  };

  return (
    <footer className="mt-20 px-4 sm:px-6 lg:px-8 pt-14 pb-8 text-xs transition-colors border-t border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-[#6B7280] dark:text-slate-400">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 text-left">
 
        {/* Logo & Description & Social Links */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <img 
              src="/logo-mark.png" 
              alt="D.CARD Mark" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                D.<span className="text-[#2563EB]">CARD</span>
              </span>
              <span className="text-[9px] font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase mt-0.5">
                COMPARE. CHOOSE. BENEFIT MORE.
              </span>
            </div>
          </Link>
          
          <p className="text-xs leading-relaxed text-[#6B7280] dark:text-slate-400 max-w-[280px]">
            Independent Debit Card Comparison & Financial Information Platform. Compare. Choose. Benefit More.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 pt-1">
            <a 
              href="https://www.instagram.com/dcard.official?igsh=MTV1Nm5zYWtjdWR4cA=="
              target="_blank"
              rel="noopener noreferrer"
              title="Official Instagram"
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#2563EB] hover:text-white transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links & Company Nav Columns */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="font-bold text-[#1F2937] dark:text-white text-sm mb-4">{section}</h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.name}>
                  {link.type ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (onOpenLegal) {
                          onOpenLegal(link.type);
                        }
                      }}
                      className="text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors flex items-center gap-1.5 text-left w-full bg-transparent border-none cursor-pointer focus:outline-none text-xs font-normal"
                    >
                      <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                      <span>{link.name}</span>
                    </button>
                  ) : (
                    <Link 
                      to={link.path}
                      className="text-[#6B7280] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors flex items-center gap-1.5 text-xs font-normal"
                    >
                      <ArrowRight className="w-3 h-3 text-[#2563EB]" />
                      <span>{link.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter & Ask Firestore AI Column */}
        <div className="space-y-4">
          <h4 className="font-bold text-[#1F2937] dark:text-white text-sm">Stay Updated</h4>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 space-y-3 shadow-sm">
            <p className="font-semibold text-xs text-[#1F2937] dark:text-white">Fintech Insights Newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 outline-none text-[#1F2937] dark:text-white"
              />
              <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ask AI Advisor Button */}
          <Link
            to="/ai-advisor"
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white font-semibold text-xs flex items-center justify-between shadow-md hover:border-[#2563EB] border border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#60A5FA]" />
              <span>Ask AI Advisor</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#60A5FA] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Disclaimer */}
      <div className="h-px bg-[#E5E7EB] dark:border-slate-800 mb-6" />
      <div className="flex flex-col gap-3 text-center text-[#6B7280] dark:text-slate-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 D.CARD. Financial Information Platform. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-[#2563EB] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Independent Ratings</span>
          </p>
        </div>
        <p className="leading-relaxed text-[10px] text-justify max-w-7xl mx-auto opacity-85">
          <strong>Regulatory Disclaimer:</strong> D.CARD is an independent debit card comparison platform. All card specs, fee structures, lounge eligibility rules, and MAB terms are collected from public bank disclosures. Registered trademarks, logos, and bank names belong to their respective corporate owners. D.CARD does not provide banking or lending services directly.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
