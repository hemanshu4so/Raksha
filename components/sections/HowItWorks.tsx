const STEPS = [
  { icon: 'ti-diamond',       label: 'Choose Design' },
  { icon: 'ti-needle-thread', label: 'Choose Thread' },
  { icon: 'ti-typography',    label: 'Choose Font'   },
  { icon: 'ti-signature',     label: 'Add Name'      },
  { icon: 'ti-eye',           label: 'Preview'       },
  { icon: 'ti-gift',          label: 'Gift Ready'    },
]

export default function HowItWorks({
  eyebrow = 'Six gentle steps',
  heading = 'How It Works',
}: {
  eyebrow?: string
  heading?: string
}) {
  return (
    <section className="rk-how" aria-labelledby="rk-how-title">
      <div className="rk-how__header">
        <p className="rk-eyebrow">{eyebrow}</p>
        <h2 className="rk-how__heading" id="rk-how-title">{heading}</h2>
      </div>
      <ol className="rk-how__grid">
        {STEPS.map((step, i) => (
          <li key={step.label} className="rk-how__step">
            <i className={`ti ${step.icon} rk-how__step-icon`} aria-hidden="true" />
            <p className="rk-how__step-num">Step {i + 1}</p>
            <p className="rk-how__step-label">{step.label}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
