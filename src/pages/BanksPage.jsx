import React from 'react';
import CoveredBanksDirectory from '../components/CoveredBanksDirectory';
import InstitutionalBankExplorer from '../components/InstitutionalBankExplorer';

function BanksPage({ toggleBank, selectSingleBank, activeCardsList, toggleCompareQueue, compareQueue }) {
  const handleSelectBank = (bankName) => {
    if (selectSingleBank) {
      selectSingleBank(bankName);
    } else if (toggleBank) {
      toggleBank(bankName);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-12 text-left">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
          FINANCIAL INFORMATION PLATFORM
        </span>
        <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
          Top Listed Banks & Profiles
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
          Explore debit card lineups, trust scores, lounge eligibility, and charges across India's leading banks
        </p>
      </div>

      {/* Dynamic Covered Banks Directory */}
      <CoveredBanksDirectory
        onSelectBank={handleSelectBank}
        customCardsList={activeCardsList}
      />

      {/* Institutional Bank Explorer Section */}
      <InstitutionalBankExplorer
        onSelectBank={handleSelectBank}
        onCompareCard={toggleCompareQueue}
        compareQueue={compareQueue}
        customCardsList={activeCardsList}
      />
    </main>
  );
}

export default BanksPage;
