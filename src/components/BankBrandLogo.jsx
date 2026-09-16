import React, { memo } from 'react';
import BankLogo from './BankLogo';

/**
 * BankBrandLogo
 * Standardized bridge component that renders the official bank logo via BankLogo.
 */
function BankBrandLogo({ bankName = '', logoText = '', className = "w-10 h-10" }) {
  const resolvedName = bankName || logoText;
  return (
    <BankLogo 
      bankName={resolvedName} 
      size="auto" 
      className={className} 
    />
  );
}

export default memo(BankBrandLogo);
