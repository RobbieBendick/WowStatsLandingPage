const benefits = [
  {
    icon: '⚡',
    title: 'Real-Time Sync',
    description: 'Instant data synchronization keeps your stats always up to date',
  },
  {
    icon: '🎨',
    title: 'Intuitive Design',
    description: 'Intuitive interface that makes tracking your progress fun and effortless',
  },
  {
    icon: '🔍',
    title: 'Advanced Filters',
    description: 'Powerful search and filtering to find exactly what you need. Search games vs specific classes, opponents, maps, and more',
  },
  {
    icon: '💾',
    title: 'Cloud Backup & Restore',
    description: 'Save your data to the cloud and restore it anytime. Your stats are always safe and accessible',
  },
]

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-header">
            <h2 className="section-title">Why Choose WowStats?</h2>
            <p className="about-intro">
              The ultimate analytics platform for WoW Arena players. 
              Elevate your gameplay with insights that matter.
            </p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
