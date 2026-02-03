const benefits = [
  {
    icon: '🎯',
    title: 'Quick Insights',
    description:
      'Get a clear snapshot of your performance immediately after every match, so you can make improvements fast.',
  },
  {
    icon: '💡',
    title: 'Intuitive Interface',
    description:
      'Navigate your stats effortlessly with a clean and user-friendly interface designed for WoW Arena players.',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description:
      'Monitor your skill improvement over time with visual charts and graphs that highlight trends in your gameplay.',
  },
  {
    icon: '🌐',
    title: 'Team & Opponent Overview',
    description:
      'Quickly spot performance trends for your team and opponents across matches at a glance.',
  },
];

export default function About() {
  return (
    <section id='about' className='about'>
      <div className='container'>
        <div className='about-content'>
          <div className='about-header'>
            <h2 className='section-title'>
              Why Choose <span className='gradient-text'>WowStats</span>?
            </h2>
            <p className='about-intro'>
              The ultimate companion for WoW Arena players. Stay informed, track
              progress, and gain insights that help you improve every match.
            </p>
          </div>
          <div className='benefits-grid'>
            {benefits.map((benefit, index) => (
              <div key={index} className='benefit-card'>
                <div className='benefit-icon'>{benefit.icon}</div>
                <h3 className='benefit-title'>{benefit.title}</h3>
                <p className='benefit-description'>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
