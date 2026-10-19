import { useEffect, useState } from 'react';

const baseUrl = import.meta.env.BASE_URL;

type Shot = {
  id: string;
  label: string;
  caption: string;
  src: string;
};

const shots: Shot[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    caption:
      'Win rates, partners, frequent opponents, the comps you play most, the comps you face, and map statistics. Everything you need for a clear picture of your climb.',
    src: `${baseUrl}screenshots/dashboard/wowstats-dashboard.png`,
  },
  {
    id: 'recording',
    label: 'Auto Recording',
    caption:
      'Pro records the arena for you, so the review is ready the moment you leave. No hotkeys, no missed games. Every match is captured and waiting.',
    src: `${baseUrl}screenshots/replay-page.jpg`,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    caption:
      'Every ability by every player, laid out across the whole match. Scrub CC, cooldowns, and key windows to see exactly how the fight turned.',
    src: `${baseUrl}screenshots/timeline.png`,
  },
  {
    id: 'matchups',
    label: 'Matchups',
    caption:
      'See which compositions you win with, and which ones you lose to. Break down your record by bracket, partner, and enemy setup.',
    src: `${baseUrl}screenshots/matchup-analysis/your-comps.png`,
  },
  {
    id: 'death-log',
    label: 'Death Log',
    caption:
      'Every damage and healing event leading up to a death, in order. Trace the last seconds of a kill so you know what actually finished the fight.',
    src: `${baseUrl}screenshots/match-pages/wowstats-death-log.png`,
  },
];

export default function Showcase() {
  const [selected, setSelected] = useState<Shot | null>(null);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  return (
    <section id='advanced-features' className='product-section is-story'>
      <div className='container'>
        <div className='product-intro'>
          <p className='product-eyebrow'>Inside WowStats</p>
          <h2 className='product-title'>
            Everything you need after the arena ends
          </h2>
          <p className='product-lead'>
            One place for your history, matchups, and the tools that explain why
            you won or lost.
          </p>
        </div>

        <div className='product-story'>
          {shots.map((shot, index) => (
            <article
              key={shot.id}
              className={`story-band ${index % 2 === 1 ? 'reverse' : ''}`}
            >
              <button
                type='button'
                className='story-media'
                onClick={() => setSelected(shot)}
                aria-label={`Enlarge ${shot.label}`}
              >
                <img src={shot.src} alt='' loading='lazy' />
              </button>
              <div className='story-copy'>
                <p className='story-index'>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3>{shot.label}</h3>
                <p>{shot.caption}</p>
                <button
                  type='button'
                  className='story-link'
                  onClick={() => setSelected(shot)}
                >
                  View screenshot
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <div className='image-modal' onClick={() => setSelected(null)}>
          <button
            type='button'
            className='modal-close'
            onClick={event => {
              event.stopPropagation();
              setSelected(null);
            }}
            aria-label='Close'
          >
            ×
          </button>
          <div
            className='modal-content'
            onClick={event => event.stopPropagation()}
          >
            <p className='modal-title'>{selected.label}</p>
            <img
              src={selected.src}
              alt={selected.caption}
              className='modal-image'
            />
          </div>
        </div>
      )}
    </section>
  );
}
