import { useLatestRelease } from '../hooks/useLatestRelease';
import DownloadIcon from '@mui/icons-material/Download';

export default function CTA() {
  const { downloadUrl, loading } = useLatestRelease();

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault();
      return;
    }
    // Let the browser handle the download
  };

  return (
    <section id='contact' className='cta-section'>
      <div className='container'>
        <div className='cta-content'>
          <h2>Download free. Climb smarter.</h2>
          <p>
            Start reviewing after every arena. Upgrade for death logs, timelines,
            and auto recording.
          </p>
          <p className='cta-note'>
            We&apos;re actively improving{' '}
            <span className='gradient-text'>WoWStats</span> and would love your
            feedback on{' '}
            <a
              href='https://discord.gg/gjvQKPWgEn'
              target='_blank'
              rel='noopener noreferrer'
              className='cta-note-link'
            >
              Discord
            </a>
            . Expect regular updates with continuous improvements and new
            features.
          </p>
          <a
            href={
              downloadUrl ||
              'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'
            }
            onClick={handleDownload}
            download
            className='btn-primary large'
          >
            <DownloadIcon sx={{ fontSize: '1.1rem', marginTop: '5px' }} />
            {loading ? 'Loading...' : 'Download'}
          </a>
        </div>
      </div>
    </section>
  );
}
