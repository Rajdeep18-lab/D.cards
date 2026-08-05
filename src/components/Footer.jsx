function Footer({ onOpenLegal, onOpenAbout, onOpenContact }) {
  const footerLinks = {
    'Quick Links': [
      { name: 'Home', href: '#home' },
      { name: 'Compare Cards', href: '#comparison' },
      { name: 'Top Banks', href: '#banks' },
      { name: 'Leadership & Office', href: '#leadership' },
    ],
    'Company': [
      { name: 'About Us', type: 'about' },
      { name: 'Privacy Policy', type: 'privacy' },
      { name: 'Terms & Conditions', type: 'terms' },
      { name: 'Disclaimer', type: 'disclaimer' },
    ],
  };

  return (
    <footer className="mt-20 px-4 sm:px-6 lg:px-8 pt-14 pb-8 text-sm transition-colors border-t border-[#D89AB6]/20 dark:border-secondary/15 bg-gradient-to-br from-[#F8EEF5]/95 to-[#EEE9F8]/95 dark:from-[#0c0612]/95 dark:to-[#060309]/95 text-slate-800 dark:text-slate-350">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 text-left">
 
        {/* Brand & Leadership Summary */}
        <div>
          <a href="#home" className="flex items-center gap-1 mb-3 group w-fit">
            <span className="text-2xl font-black tracking-tight font-serif text-gradient">D.</span>
            <span className="text-2xl font-light tracking-tight font-serif text-[#1E0B16] dark:text-[#F5D9E8] group-hover:text-[#C21875] transition-colors">Card</span>
          </a>
          <p className="text-textSoft dark:text-slate-400 leading-relaxed text-xs max-w-[260px]">
            Bespoke debit card discovery & banking optimization layers.
          </p>

          <div className="mt-4 pt-3 border-t border-[#D89AB6]/20 text-[11px] space-y-1">
            <p className="font-bold text-[#7A0F52] dark:text-roseGold uppercase tracking-wider text-[9.5px]">Leadership Executive Team</p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">Founder: <span className="font-black text-[#1E0B16] dark:text-white">Ritik Raj</span></p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">Co-Founder: <span className="font-black text-[#1E0B16] dark:text-white">Rajdeep</span></p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">CTO: <span className="font-black text-[#1E0B16] dark:text-white">Kaushik Kumar Srivastava</span></p>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">CMO: <span className="font-black text-[#1E0B16] dark:text-white">Bipanshu Dubey</span></p>
          </div>

          {/* Social icons */}
          <div className="flex gap-2.5 mt-4">
            {['In', 'Tw', 'Fb'].map((icon) => (
              <div key={icon}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#7A0F52] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:text-white"
                style={{
                  background: 'rgba(245,217,232,0.6)',
                  border: '1px solid rgba(194,24,117,0.25)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg,#8A0E5A,#C21875)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(122,15,82,0.35)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(245,217,232,0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(194,24,117,0.25)';
                  e.currentTarget.style.color = '#7A0F52';
                }}>
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="font-bold text-[#1E0B16] dark:text-white mb-4">{section}</h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.name}>
                  {link.type ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (link.type === 'about' && onOpenAbout) {
                          onOpenAbout();
                        } else if (onOpenLegal) {
                          onOpenLegal(link.type);
                        }
                      }}
                      className="text-textSoft dark:text-slate-400 hover:text-[#C21875] dark:hover:text-roseGold transition-colors flex items-center gap-2 group text-left w-full bg-transparent border-none cursor-pointer focus:outline-none text-xs"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-[#C21875] dark:bg-roseGold transition-all duration-200 block" />
                      {link.name}
                    </button>
                  ) : (
                    <a href={link.href}
                      className="text-textSoft dark:text-slate-400 hover:text-[#C21875] dark:hover:text-roseGold transition-colors flex items-center gap-2 group text-xs">
                      <span className="w-0 group-hover:w-2 h-px bg-[#C21875] transition-all duration-200 block" />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact & Office Address */}
        <div>
          <h4 className="font-bold text-[#1E0B16] dark:text-white mb-3">Corporate Office</h4>
          <div className="space-y-1.5 text-xs text-textSoft dark:text-slate-400 font-medium">
            <p className="flex items-start gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <span className="text-[#C21875]">📍</span> 5th Floor, Yashoban Tower
            </p>
            <p className="pl-5 text-[11.5px]">Above Srileathers, Near IDBI Bank</p>
            <p className="pl-5 text-[11.5px]">Saraidhela, Dhanbad</p>
            <p className="pl-5 text-[11.5px] font-bold text-[#C21875] dark:text-roseGold">Jharkhand – 828127</p>

            <div className="pt-2 space-y-1">
              <p className="flex items-center gap-2 text-xs">
                <span className="text-[#D89AB6]">✉</span> support@dcard.in
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl text-xs"
            style={{
              background: 'linear-gradient(135deg, rgba(245,217,232,0.5), rgba(238,233,248,0.5))',
              border: '1px solid rgba(216,154,182,0.35)'
            }}>
            <p className="font-semibold text-[#7A0F52] mb-1">Newsletter</p>
            <div className="flex gap-2 mt-1.5">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg outline-none text-[#1E0B16]"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #E8D9E3' }} />
              <button className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#A30D62,#C21875)' }}>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-px bg-slate-200 dark:bg-secondary/15 mb-6" />
      <div className="flex flex-col gap-4 text-center text-textSoft dark:text-slate-500 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 D.Card capital network. Founded by Ritik Raj, Rajdeep, Kaushik Kumar Srivastava & Bipanshu Dubey. All rights reserved.</p>
          <p className="text-gradient font-black tracking-wide">Secured with Bank-Grade Sandbox Protocol.</p>
        </div>
        <p className="leading-relaxed text-[10px] text-justify max-w-7xl mx-auto opacity-75">
          <strong>Regulatory Disclaimer:</strong> D.Card is an independent capital sandbox engine. All debit card metrics, monthly average balance (MAB) targets, airport lounge qualifiers, and interest rates represent audited figures, but parameters fluctuate frequently based on respective bank policies. All third-party registered trademarks, logos, and bank brands are intellectual property of their respective corporate owners. We receive no direct financial compensation from primary banks listed here.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

