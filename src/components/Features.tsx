interface Feature {
  icon: string;
  title: string;
  description: string;
}

const advancedFeatures: Feature[] = [
  {
    icon: '💀',
    title: 'Death Log',
    description:
      'See every damage event leading to player deaths in detail, including damage taken, and abilities used. Perfect for learning from mistakes and improving performance.',
  },
  {
    icon: '🛡️',
    title: 'Resists & Missed Spells',
    description:
      'Analyze which spells were resisted or missed by you or your opponents, giving insight into what abilities were less effective and how to adjust your strategy.',
  },
  {
    icon: '⏱️',
    title: 'CC & Cooldown Timeline',
    description:
      'View every crowd control and cooldown ability on a timeline spanning the entire match. Understand exactly when key abilities were used to optimize your gameplay.',
  },
  {
    icon: '📋',
    title: 'Detailed Match Breakdown',
    description:
      'Dive into a complete match overview with stats for damage, healing, killing blows and more. Everything is structured to give you a full picture of how the game unfolded.',
  },
];

export default function AdvancedFeatures() {
  return (
    <section id='advanced-features' className='advanced-features'>
      <div className='container'>
        <h2 className='section-title'>Advanced Match Tools</h2>
        <p className='section-subtitle'>
          Gain deeper insights into your matches with powerful analysis tools
        </p>
        <div className='features-grid'>
          {advancedFeatures.map((feature, index) => (
            <div key={index} className='feature-card'>
              <div className='feature-icon'>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
