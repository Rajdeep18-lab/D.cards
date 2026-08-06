import React, { useState, useEffect, useRef, memo } from 'react';
import DebitCardCard from './DebitCardCard';

/**
 * High-Performance Progressive Viewport Windowed Card Grid
 * Renders cards in chunks to maintain 60 FPS scrolling and low DOM node count on mobile.
 */
function VirtualizedCardGrid({
  cards = [],
  toggleCompareQueue,
  compareQueue = [],
  setSelectedCard,
  userProfile,
  activeFilters = [],
  STATIC_RANKINGS
}) {
  const CHUNK_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const observerRef = useRef(null);

  // Reset window count when card list/filters change
  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [cards]);

  // Infinite viewport scroll trigger for smooth 60 FPS rendering
  useEffect(() => {
    if (visibleCount >= cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => Math.min(prev + CHUNK_SIZE, cards.length));
        }
      },
      { rootMargin: '400px 0px 400px 0px', threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [visibleCount, cards.length]);

  const visibleCards = cards.slice(0, visibleCount);
  const isQueuedSet = new Set(compareQueue.map(c => String(c.id)));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCards.map((card) => {
          const isQueued = isQueuedSet.has(String(card.id));
          return (
            <div key={card.id} className="h-full gpu-layer">
              <DebitCardCard
                card={card}
                onCompare={() => toggleCompareQueue(card)}
                isQueued={isQueued}
                onViewDetails={() => setSelectedCard(card)}
                userProfile={userProfile}
                activeFilters={activeFilters}
                rankings={STATIC_RANKINGS}
              />
            </div>
          );
        })}
      </div>

      {/* Viewport Bottom Sentinel for Progressive Chunking */}
      {visibleCount < cards.length && (
        <div 
          ref={observerRef} 
          className="w-full py-8 flex flex-col items-center justify-center gap-2 select-none"
        >
          <div className="w-6 h-6 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          <p className="text-xs font-bold text-textSoft dark:text-slate-400">
            Loading more cards ({visibleCount} of {cards.length})...
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(VirtualizedCardGrid);
