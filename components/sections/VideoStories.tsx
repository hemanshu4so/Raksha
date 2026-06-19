const STORIES = [
  {
    id: 'london',
    caption: 'She made it from London.',
    src: '/videos/story-london',
  },
  {
    id: 'name',
    caption: 'The moment his name appeared.',
    src: '/videos/story-name',
  },
  {
    id: 'wears',
    caption: 'A rakhi he still wears.',
    src: '/videos/story-wears',
  },
]

export default function VideoStories() {
  return (
    <section className="rk-stories" aria-label="Seen Through Their Eyes">
      <header className="rk-stories__header">
        <p className="rk-eyebrow rk-stories__eyebrow">Seen Through Their Eyes</p>
      </header>

      <ul className="rk-stories__list" role="list">
        {STORIES.map((story) => (
          <li key={story.id} className="rk-stories__item" role="listitem">
            <div className="rk-stories__video-wrap">
              <video
                className="rk-stories__video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={story.caption}
              >
                <source src={`${story.src}.mp4`} type="video/mp4" />
                <source src={`${story.src}.webm`} type="video/webm" />
              </video>

              <div className="rk-stories__play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M8 5.14v14l11-7-11-7z" />
                </svg>
              </div>
            </div>

            <p className="rk-stories__caption">{story.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
