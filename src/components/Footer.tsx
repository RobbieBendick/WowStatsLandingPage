interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links?: FooterLink[]
  description?: string
}

const footerSections: FooterSection[] = [
  {
    title: 'WowStats',
    description: 'Your ultimate World of Warcraft Arena statistics tracker',
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
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy', href: '#privacy' },
    ],
  },
]

export default function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {footerSections.map((section, index) => (
            <div key={index} className="footer-section">
              <h4>{section.title}</h4>
              {section.description && <p>{section.description}</p>}
              {section.links && (
                <>
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      onClick={(e) => handleScroll(e, link.href)}
                    >
                      {link.label}
                    </a>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 WowStats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
