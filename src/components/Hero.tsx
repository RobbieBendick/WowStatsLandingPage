import { useLatestRelease } from '../hooks/useLatestRelease';
import { useCountUp } from '../hooks/useCountUp';

export default function Hero() {
  const { downloadUrl, loading } = useLatestRelease();

  const activeUsers = useCountUp({ end: 1000, suffix: '+' });
  const charactersTracked = useCountUp({ end: 4000, suffix: '+' });
  const dataPoints = useCountUp({ end: 100000, suffix: '+', duration: 2500 });

  const handleLearnMore = () => {
    const features = document.querySelector('#features');
    features?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault();
      return;
    }
    // Let the browser handle the download
  };

  return (
    <section className='hero'>
      <div className='hero-content'>
        <h1 className='hero-title'>
          Track Your WoW Arena
          <span className='gradient-text'> Statistics</span>
        </h1>
        <p className='hero-subtitle'>
          Every arena match, broken down. Analyze comps, partners, and trends to
          understand why you win — and why you lose.
        </p>
        <p className='hero-byline'>
          Built by the best PvP players in the world to help you climb.
        </p>
        <div className='hero-buttons'>
          <a
            href={
              downloadUrl ||
              'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'
            }
            onClick={handleDownload}
            download
            className='btn-primary'
          >
            {loading ? 'Loading...' : 'Download for Windows'}
          </a>
          <button className='btn-secondary' onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
        <div className='hero-stats'>
          <div className='stat-item'>
            <div
              className='stat-number'
              style={{
                filter: `blur(${activeUsers.blur}px)`,
                opacity: activeUsers.isAnimating
                  ? 0.85 + (1 - activeUsers.blur) * 0.15
                  : 1,
                transform: activeUsers.isAnimating
                  ? `scale(${0.98 + (1 - activeUsers.blur) * 0.02})`
                  : 'scale(1)',
              }}
            >
              {activeUsers.value}
            </div>
            <div className='stat-label'>Active Users</div>
          </div>
          <div className='stat-item'>
            <div
              className='stat-number'
              style={{
                filter: `blur(${charactersTracked.blur}px)`,
                opacity: charactersTracked.isAnimating
                  ? 0.85 + (1 - charactersTracked.blur) * 0.15
                  : 1,
                transform: charactersTracked.isAnimating
                  ? `scale(${0.98 + (1 - charactersTracked.blur) * 0.02})`
                  : 'scale(1)',
              }}
            >
              {charactersTracked.value}
            </div>
            <div className='stat-label'>Characters Tracked</div>
          </div>
          <div className='stat-item'>
            <div
              className='stat-number'
              style={{
                filter: `blur(${dataPoints.blur}px)`,
                opacity: dataPoints.isAnimating
                  ? 0.85 + (1 - dataPoints.blur) * 0.15
                  : 1,
                transform: dataPoints.isAnimating
                  ? `scale(${0.98 + (1 - dataPoints.blur) * 0.02})`
                  : 'scale(1)',
              }}
            >
              {dataPoints.value}
            </div>
            <div className='stat-label'>Data Points</div>
          </div>
        </div>
      </div>
    </section>
  );
}
