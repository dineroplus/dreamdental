export function BrandLogo() {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <img
        alt="Dream Dental & Aesthetic Group"
        className="graphic-logo"
        src="/brand/logo.png"
        style={{ height: 72, width: 'auto' }}
      />
      <span
        style={{
          fontSize: 15,
          fontWeight: 650,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        Dream Dental
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          opacity: 0.65,
        }}
      >
        Aesthetic Group
      </span>
    </span>
  )
}
