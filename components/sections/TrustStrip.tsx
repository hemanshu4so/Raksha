export default function TrustStrip() {
  const items = [
    { icon: 'ti-certificate', label: 'Certified Silver' },
    { icon: 'ti-hand-stop', label: 'Made by Hand' },
    { icon: 'ti-gift', label: 'Gift Ready' },
  ]

  return (
    <div className="rk-trust" role="list" aria-label="Trust signals">
      <ul className="rk-trust__list">
        {items.map((item) => (
          <li key={item.label} className="rk-trust__item">
            <i className={`ti ${item.icon} rk-trust__icon`} aria-hidden="true" />
            <span className="rk-trust__label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
