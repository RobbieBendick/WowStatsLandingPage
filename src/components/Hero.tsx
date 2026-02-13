import { useLatestRelease } from '../hooks/useLatestRelease';
import { useSlotStats } from '../hooks/useSlotStats';
import DownloadIcon from '@mui/icons-material/Download';

const HERO_STATS = [
  { end: 1000, suffix: '+' },
  { end: 4000, suffix: '+' },
  { end: 100000, suffix: '+' },
];

export default function Hero() {
  const { downloadUrl, loading } = useLatestRelease();
  const { values: statValues, isSpinning } = useSlotStats({
    stats: HERO_STATS,
    spinDuration: 2800,
    tickInterval: 70,
  });

  const handleLearnMore = () => {
    const features = document.querySelector('#advanced-features');
    features?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault();
      return;
    }
  };

  return (
    <section className='hero' aria-label='Hero'>
      <div className='hero-backdrop' aria-hidden='true' />
      <div className='hero-content'>
        <p className='hero-tagline'>WoW Arena Analytics</p>
        <h1 className='hero-title'>
          Track your
          <span className='gradient-text'> statistics</span>
        </h1>
        <p className='hero-subtitle'>
          Every arena match, broken down. Analyze comps, partners, and trends to
          understand why you win — and why you lose.
        </p>
        <p className='hero-byline'>
          Built by top PvP players to help you climb.
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
            <DownloadIcon sx={{ fontSize: '1.1rem', marginTop: '5px' }} />
            {loading ? 'Loading...' : 'Download for Windows'}
          </a>
          <button
            type='button'
            className='btn-secondary'
            onClick={handleLearnMore}
            aria-label='Learn More'
          >
            Learn More
          </button>
        </div>
        <div className='hero-stats'>
          <div className='stat-item'>
            <div
              className={`stat-number stat-slot${isSpinning ? ' stat-slot--spinning' : ''}`}
            >
              {statValues[0]}
            </div>
            <div className='stat-label'>Active Users</div>
          </div>
          <div className='stat-item'>
            <div
              className={`stat-number stat-slot${isSpinning ? ' stat-slot--spinning' : ''}`}
            >
              {statValues[1]}
            </div>
            <div className='stat-label'>Characters Tracked</div>
          </div>
          <div className='stat-item'>
            <div
              className={`stat-number stat-slot${isSpinning ? ' stat-slot--spinning' : ''}`}
            >
              {statValues[2]}
            </div>
            <div className='stat-label'>Data Points</div>
          </div>
        </div>
      </div>
      <div className='hero-scroll-cue' aria-hidden='true'>
        <span className='hero-scroll-dot' />
      </div>
    </section>
  );
}
