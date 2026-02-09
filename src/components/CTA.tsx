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
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of players already tracking their WoW statistics</p>
          <p className='cta-note'>
            We're actively improving{' '}
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
            . Expect frequent updates and ongoing improvements.
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
            <DownloadIcon sx={{ fontSize: '1.1rem' }} />
            {loading ? 'Loading...' : 'Download'}
          </a>
        </div>
      </div>
    </section>
  );
}
