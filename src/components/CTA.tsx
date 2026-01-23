import { useLatestRelease } from '../hooks/useLatestRelease'

export default function CTA() {
  const { downloadUrl, loading } = useLatestRelease()

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!downloadUrl || loading) {
      e.preventDefault()
      return
    }
    // Let the browser handle the download
  }

  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of players already tracking their WoW statistics</p>
          <a 
            href={downloadUrl || 'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'}
            onClick={handleDownload}
            download
            className="btn-primary large"
          >
            {loading ? 'Loading...' : 'Download'}
          </a>
        </div>
      </div>
    </section>
  )
}
