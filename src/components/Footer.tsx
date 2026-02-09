import { useLatestRelease } from '../hooks/useLatestRelease';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
  isDownload?: boolean;
}

interface FooterSection {
  title: string;
  links?: FooterLink[];
  description?: string;
}

const footerSections: FooterSection[] = [
  {
    title: 'WowStats',
    description:
      'By WoW PvPers, for WoW PvPers. Your ultimate Arena statistics tracker.',
  },
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#advanced-features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Download', href: '#', isDownload: true },
    ],
  },
  {
    title: 'Support',
    links: [
      {
        label: 'Help Center',
        href: 'https://discord.gg/gjvQKPWgEn',
        isExternal: true,
      },
      {
        label: 'Contact',
        href: 'https://discord.gg/gjvQKPWgEn',
        isExternal: true,
      },
      {
        label: 'Privacy',
        href: 'https://discord.gg/gjvQKPWgEn',
        isExternal: true,
      },
    ],
  },
];

export default function Footer() {
  const { downloadUrl } = useLatestRelease();

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url =
      downloadUrl ||
      'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest';
    window.open(url, '_blank');
  };

  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footer-content'>
          {footerSections.map((section, index) => (
            <div key={index} className='footer-section'>
              <h4>
                {section.title === 'WowStats' ? (
                  <span className='gradient-text'>{section.title}</span>
                ) : (
                  section.title
                )}
              </h4>
              {section.description && <p>{section.description}</p>}
              {section.links && (
                <>
                  {section.links.map((link, linkIndex) => {
                    if (link.isDownload) {
                      return (
                        <a
                          key={linkIndex}
                          href={
                            downloadUrl ||
                            'https://github.com/WoW-Stats/WoWStatsReleases/releases/latest'
                          }
                          onClick={handleDownload}
                          download
                        >
                          {link.label}
                        </a>
                      );
                    }
                    if (link.isExternal) {
                      return (
                        <a
                          key={linkIndex}
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {link.label}
                        </a>
                      );
                    }
                    return (
                      <a
                        key={linkIndex}
                        href={link.href}
                        onClick={e => handleScroll(e, link.href)}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
        <div className='footer-bottom'>
          <p>
            &copy; 2024 <span className='gradient-text'>WowStats</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
