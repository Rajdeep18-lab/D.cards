import { useEffect } from 'react';

const DEFAULT_TITLE = "D.Card – Compare Debit Cards, Savings & Current Accounts in India";
const DEFAULT_DESC = "Compare debit cards, savings accounts and current accounts in India. Explore fees, benefits, eligibility and features with D.Card.";
const BASE_URL = "https://www.dcard.website";

/**
 * useSEO Hook
 * Dynamically synchronizes document title, meta description, robots, canonical URL,
 * Open Graph, Twitter metadata, and optional JSON-LD structured data.
 * Guarantees zero duplicate tags by updating existing elements in document.head.
 */
export function useSEO({
  title,
  description,
  canonicalUrl,
  robots = "index, follow",
  ogType = "website",
  ogImage = "https://www.dcard.website/logo.png",
  schema = null
} = {}) {
  useEffect(() => {
    // 1. Document Title
    const finalTitle = title ? title.trim() : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to update or create a meta element
    const setMeta = (attrName, attrVal, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to update or create canonical link element
    const setCanonical = (href) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Meta description, robots, author, language
    const finalDesc = description ? description.trim() : DEFAULT_DESC;
    setMeta('name', 'description', finalDesc);
    setMeta('name', 'robots', robots);
    setMeta('name', 'author', 'D.Card');
    setMeta('name', 'language', 'English');

    // 3. Canonical URL
    const finalCanonical = canonicalUrl || `${BASE_URL}/`;
    setCanonical(finalCanonical);

    // 4. Open Graph
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDesc);
    setMeta('property', 'og:url', finalCanonical);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'D.Card');
    setMeta('property', 'og:image', ogImage);

    // 5. Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDesc);
    setMeta('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    let schemaScript = document.getElementById('dcard-structured-data');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dcard-structured-data';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, canonicalUrl, robots, ogType, ogImage, schema]);
}

export default useSEO;
