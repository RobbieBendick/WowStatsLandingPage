interface FooterLink {
  label: string;
  href: string;
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
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Download', href: '#contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact', href: '' },
      { label: 'Privacy', href: '#privacy' },
    ],
  },
];

export default function Footer() {
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
                    if (link.label === 'Contact') {
                      return (
                        <a
                          key={linkIndex}
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            window.open(
                              'https://discord.gg/gjvQKPWgEn',
                              '_blank'
                            )
                          }
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
