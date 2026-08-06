import React, { useState, useEffect, memo } from 'react';
import DebitCardCard from './DebitCardCard';

/**
 * Top Cards Viewport Grid Component
 * Displays Top 12 Cards initially, with user controls to load more or expand all cards.
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
  const INITIAL_TOP_COUNT = 12;
  const CHUNK_INCREMENT = 12;
  const [visibleCount, setVisibleCount] = useState(INITIAL_TOP_COUNT);

  // Reset to Top 12 cards when search/filters change
  useEffect(() => {
    setVisibleCount(INITIAL_TOP_COUNT);
  }, [cards]);

  const visibleCards = cards.slice(0, visibleCount);
  const isQueuedSet = new Set(compareQueue.map(c => String(c.id)));
  const remainingCount = cards.length - visibleCount;

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

      {/* Manual Load Controls: Top Cards Only by default */}
      {visibleCount < cards.length && (
        <div className="w-full py-10 flex flex-col sm:flex-row items-center justify-center gap-3 select-none">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + CHUNK_INCREMENT, cards.length))}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-secondary to-primary text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Show More Cards (+{Math.min(CHUNK_INCREMENT, remainingCount)})
          </button>

          <button
            onClick={() => setVisibleCount(cards.length)}
            className="px-6 py-3 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-secondary/20 text-slate-800 dark:text-slate-100 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            View All {cards.length} Cards ➔
          </button>
        </div>
      )}

      {visibleCount > INITIAL_TOP_COUNT && cards.length > INITIAL_TOP_COUNT && (
        <div className="w-full pt-4 pb-8 flex justify-center">
          <button
            onClick={() => {
              setVisibleCount(INITIAL_TOP_COUNT);
              document.getElementById('cards')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-secondary dark:text-roseGold hover:underline cursor-pointer flex items-center gap-1"
          >
            ↑ Collapse Back to Top 12 Cards
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(VirtualizedCardGrid);
