import { useState, useEffect } from 'react'

// Get base URL for GitHub Pages compatibility
const baseUrl = import.meta.env.BASE_URL

// Dashboard screenshots
const dashboardViews = [
  `${baseUrl}screenshots/dashboard/wowstats-dashboard-1.png`,
  `${baseUrl}screenshots/dashboard/wowstats-dashboard-2.png`,
  `${baseUrl}screenshots/dashboard/wowstats-dashboard-3.png`,
]

// Detailed match analysis
const matchAnalysis = [
  `${baseUrl}screenshots/match-pages/wowstats-recent-matches.png`,
  `${baseUrl}screenshots/match-pages/wowstats-cc-timeline.png`,
  `${baseUrl}screenshots/match-pages/wowstats-resisted-and-cc-timeline.png`,
  `${baseUrl}screenshots/match-pages/wowstats-resisted-spells.png`,
  `${baseUrl}screenshots/match-pages/wowstats-missed-spells.png`,
  `${baseUrl}screenshots/match-pages/wowstats-death-log.png`,
]

const matchPages = matchAnalysis

const allImages = [...dashboardViews, ...matchPages]

export default function Showcase() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(-1)

  const openModal = (image: string, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedImage(null)
    setCurrentIndex(-1)
    document.body.style.overflow = 'unset'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return
    
    let newIndex = currentIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1
    } else {
      newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0
    }
    
    setCurrentIndex(newIndex)
    setSelectedImage(allImages[newIndex])
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'Escape') {
          closeModal()
        } else if (e.key === 'ArrowLeft') {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1
          setCurrentIndex(newIndex)
          setSelectedImage(allImages[newIndex])
        } else if (e.key === 'ArrowRight') {
          const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0
          setCurrentIndex(newIndex)
          setSelectedImage(allImages[newIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, currentIndex])

  const handleImageClick = (image: string) => {
    const index = allImages.indexOf(image)
    openModal(image, index)
  }

  return (
    <>
      <section id="showcase" className="showcase">
        <div className="container">
          <h2 className="section-title">See WowStats in Action</h2>
          <p className="section-subtitle">
            Get a glimpse of the powerful features and beautiful interface
          </p>
          
          <div className="showcase-section">
            <h3 className="showcase-section-title">Dashboard Views</h3>
            <p className="showcase-section-subtitle">
              Comprehensive overview of your statistics and performance metrics
            </p>
            <div className="showcase-grid">
              {dashboardViews.map((image, index) => (
                <div 
                  key={index} 
                  className="showcase-item"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="showcase-overlay">
                    <span className="showcase-overlay-icon">🔍</span>
                    <span className="showcase-overlay-text">Click to view</span>
                  </div>
                  <img 
                    src={image} 
                    alt={`WowStats Dashboard - ${image.split('/').pop()?.replace('.png', '').replace(/-/g, ' ')}`}
                    className="showcase-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="showcase-section">
            <h3 className="showcase-section-title">Match Analysis Pages</h3>
            <p className="showcase-section-subtitle">
              Detailed breakdowns including match overview, CC timelines, spell analysis, death logs, and more
            </p>
            <div className="showcase-grid">
              {matchPages.map((image, index) => (
                <div 
                  key={index} 
                  className="showcase-item"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="showcase-overlay">
                    <span className="showcase-overlay-icon">🔍</span>
                    <span className="showcase-overlay-text">Click to view</span>
                  </div>
                  <img 
                    src={image} 
                    alt={`WowStats Match Page - ${image.split('/').pop()?.replace('.png', '').replace(/-/g, ' ')}`}
                    className="showcase-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <button 
            className="modal-close"
            onClick={(e) => {
              e.stopPropagation()
              closeModal()
            }}
            aria-label="Close modal"
          >
            ×
          </button>
          <button
            className="modal-nav modal-nav-prev"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="modal-nav modal-nav-next"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Enlarged view"
              className="modal-image"
            />
          </div>
        </div>
      )}
    </>
  )
}
