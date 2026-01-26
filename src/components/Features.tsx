interface Feature {
  icon: string
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: '📊',
    title: 'Organized Match History',
    description: "Organize your match history by map, opponent, teammate, or specific classes. Filter and search through your entire match history with powerful tools.",
  },
  {
    icon: '⚔️',
    title: 'Combat Analysis',
    description: 'Deep dive into your combat performance with detailed damage and healing breakdowns.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description: 'Monitor your character\'s progression over time with beautiful charts and graphs.',
  },
  {
    icon: '🔍',
    title: 'Advanced Match Search',
    description: 'Find matches by map, opponent, teammate, or specific classes. Filter and search through your entire match history with powerful tools.',
  },
]

export default function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">
          Everything you need to track and improve your WoW experience
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
