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
    title: 'User Stats & Rankings',
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
  {
    src: `${baseUrl}screenshots/match-pages/wowstats-cc-timeline-hover.png`,
    title: 'Hover Tooltip Analysis',
  },
];

const matchPages = matchAnalysis;
const allImages = [...dashboardViews, ...matchPages];

export default function Showcase() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

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

  return (
    <>
      <section id='showcase' className='showcase'>
        <div className='container'>
          <h2 className='section-title'>See WowStats in Action</h2>
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
              Detailed breakdowns including match overview, CC timelines, spell
              analysis, death logs, and more
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
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className='modal-image'
            />
            <p className='modal-title'>{selectedImage.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
