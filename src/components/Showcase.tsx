import { useState, useEffect } from 'react';

// Get base URL for GitHub Pages compatibility
const baseUrl = import.meta.env.BASE_URL;

// Dashboard screenshots with titles
const dashboardViews = [
  {
    src: `${baseUrl}screenshots/dashboard/wowstats-dashboard-1.png`,
    title: 'Main Dashboard Overview',
  },
  {
    src: `${baseUrl}screenshots/dashboard/wowstats-dashboard-2.png`,
    title: 'Performance Metrics',
  },
  {
    src: `${baseUrl}screenshots/dashboard/wowstats-dashboard-3.png`,
    title: 'Frequently Played Compositions',
  },
];

// Detailed match analysis with titles
const matchAnalysis = [
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-recent-matches.png`,
    title: 'Recent Matches',
  },
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-cc-timeline.png`,
    title: 'Crowd Control Timeline',
  },
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-cc-timeline-hover.png`,
    title: 'Hover Tooltip Analysis',
  },
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-cooldown-timeline.png`,
    title: 'Cooldown Timeline',
  },
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-resisted-spells.png`,
    title: 'Resisted Spells',
  },
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-death-log.png`,
    title: 'Death Log Analysis',
  },
];

// Spell statistics screenshots
const spellStatsViews = [
  {
    src: `${baseUrl}screenshots/spell-stats/spell-stats-no-filters.png`,
    title: 'Spell Statistics Overview',
  },
  {
    src: `${baseUrl}screenshots/spell-stats/spell-stats-filters-top.png`,
    title: 'Filters Active - Top View',
  },
  {
    src: `${baseUrl}screenshots/spell-stats/spell-stats-filters-bottom.png`,
    title: 'Filters Active - Bottom View',
  },
];

// Matchup analysis (comps, matchups, etc.) — PNG by default; optional GIF on hover (modal always shows PNG)
type MatchupImage = {
  pngSrc: string;
  gifSrc?: string;
  title: string;
};

const matchupAnalysis: MatchupImage[] = [
  {
    pngSrc: `${baseUrl}screenshots/matchup-analysis/your-comps.png`,
    gifSrc: `${baseUrl}screenshots/matchup-analysis/your-comps-gif.gif`,
    title: 'Your Compositions',
  },
  {
    pngSrc: `${baseUrl}screenshots/matchup-analysis/opponent-comps.png`,
    gifSrc: `${baseUrl}screenshots/matchup-analysis/opponent-comp-matches-gif.gif`,
    title: 'Opponent Compositions',
  },
];

const matchPages = matchAnalysis;
// For modal: use GIF when available (matchup), else PNG
const allImages: { src: string; title: string }[] = [
  ...dashboardViews,
  ...matchPages,
  ...spellStatsViews,
  ...matchupAnalysis.map(m => ({
    src: m.gifSrc || m.pngSrc,
    title: m.title,
  })),
];

export default function Showcase() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [hoveredMatchupIndex, setHoveredMatchupIndex] = useState<number | null>(
    null,
  );

  const openModal = (image: { src: string; title: string }, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(-1);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
    } else {
      newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
    }

    setCurrentIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const handleImageClick = (image: { src: string; title: string }) => {
    const index = allImages.findIndex(img => img.src === image.src);
    openModal(image, index);
  };

  const handleMatchupImageClick = (image: MatchupImage) => {
    const modalImage = {
      src: image.gifSrc || image.pngSrc,
      title: image.title,
    };
    const index = allImages.findIndex(
      img =>
        img.title === image.title && img.src === (image.gifSrc || image.pngSrc),
    );
    openModal(modalImage, index >= 0 ? index : allImages.length - 1);
  };

  return (
    <>
      <section id='showcase' className='showcase'>
        <div className='container'>
          <h2 className='section-title'>
            See <span className='gradient-text'>WowStats</span> in Action
          </h2>
          <p className='section-subtitle'>
            Get a glimpse of the powerful features and beautiful interface
          </p>

          <div className='showcase-section'>
            <h3 className='showcase-section-title'>Dashboard Views</h3>
            <p className='showcase-section-subtitle'>
              Comprehensive overview of your statistics and performance metrics
            </p>
            <div className='showcase-grid'>
              {dashboardViews.map((image, index) => (
                <div
                  key={index}
                  className='showcase-item'
                  onClick={() => handleImageClick(image)}
                >
                  <div className='showcase-overlay'>
                    <span className='showcase-overlay-text'>{image.title}</span>
                    <span className='showcase-overlay-icon'>🔍</span>
                    <span className='showcase-overlay-text'>Click to View</span>
                  </div>
                  <img
                    src={image.src}
                    alt={image.title}
                    className='showcase-image'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='showcase-section'>
            <h3 className='showcase-section-title'>Match Analysis Pages</h3>
            <p className='showcase-section-subtitle'>
              Detailed breakdowns including match overview, Crowd Control
              timelines, spell analysis, death logs, and more
            </p>
            <div className='showcase-grid'>
              {matchPages.map((image, index) => (
                <div
                  key={index}
                  className='showcase-item'
                  onClick={() => handleImageClick(image)}
                >
                  <div className='showcase-overlay'>
                    <span className='showcase-overlay-text'>{image.title}</span>
                    <span className='showcase-overlay-icon'>🔍</span>
                    <span className='showcase-overlay-text'>Click to View</span>
                  </div>
                  <img
                    src={image.src}
                    alt={image.title}
                    className='showcase-image'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='showcase-section'>
            <h3 className='showcase-section-title'>Spell Statistics</h3>
            <p className='showcase-section-subtitle'>
              Break down all of your crits, resists, and misses from your
              perspective or from your opponent’s abilities used against you
              across every game, with advanced filters.
            </p>
            <div className='showcase-grid'>
              {spellStatsViews.map((image, index) => (
                <div
                  key={index}
                  className='showcase-item'
                  onClick={() => handleImageClick(image)}
                >
                  <div className='showcase-overlay'>
                    <span className='showcase-overlay-text'>{image.title}</span>
                    <span className='showcase-overlay-icon'>🔍</span>
                    <span className='showcase-overlay-text'>Click to View</span>
                  </div>
                  <img
                    src={image.src}
                    alt={image.title}
                    className='showcase-image'
                    loading='lazy'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='showcase-section'>
            <h3 className='showcase-section-title'>Matchup Analysis</h3>
            <p className='showcase-section-subtitle'>
              Compare compositions and analyze matchups at a glance
            </p>
            <div className='showcase-grid'>
              {matchupAnalysis.map((image, index) => {
                const isGifOnly =
                  image.pngSrc.endsWith('.gif') && !image.gifSrc;
                const isHovered = hoveredMatchupIndex === index;
                const showGif = isHovered && (image.gifSrc || isGifOnly);
                return (
                  <div
                    key={index}
                    className='showcase-item showcase-item-matchup'
                    onClick={() => handleMatchupImageClick(image)}
                    onMouseEnter={() => setHoveredMatchupIndex(index)}
                    onMouseLeave={() => setHoveredMatchupIndex(null)}
                  >
                    <div className='showcase-overlay'>
                      <span className='showcase-overlay-text'>
                        {image.title}
                      </span>
                      <span className='showcase-overlay-icon'>🔍</span>
                      <span className='showcase-overlay-text'>
                        Click to View
                      </span>
                    </div>
                    {(image.gifSrc || isGifOnly) && !isHovered && (
                      <span className='showcase-gif-badge' aria-hidden>
                        Hover to play
                      </span>
                    )}
                    {!isGifOnly && (
                      <img
                        src={image.pngSrc}
                        alt={image.title}
                        className='showcase-image showcase-image-png'
                        loading='lazy'
                      />
                    )}
                    {isGifOnly && !showGif && (
                      <div className='showcase-image showcase-image-placeholder'>
                        Hover to preview
                      </div>
                    )}
                    {showGif && (
                      <img
                        src={image.gifSrc || image.pngSrc}
                        alt={`${image.title} (animated)`}
                        className={`showcase-image showcase-image-gif ${
                          isGifOnly ? 'showcase-image-gif-standalone' : ''
                        }`}
                        loading='eager'
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className='image-modal' onClick={closeModal}>
          <button
            className='modal-close'
            onClick={e => {
              e.stopPropagation();
              closeModal();
            }}
            aria-label='Close modal'
          >
            ×
          </button>
          <button
            className='modal-nav modal-nav-prev'
            onClick={e => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            aria-label='Previous image'
          >
            ‹
          </button>
          <button
            className='modal-nav modal-nav-next'
            onClick={e => {
              e.stopPropagation();
              navigateImage('next');
            }}
            aria-label='Next image'
          >
            ›
          </button>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <p className='modal-title'>{selectedImage.title}</p>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className='modal-image'
            />
          </div>
        </div>
      )}
    </>
  );
}
