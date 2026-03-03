import styles from '../styles/Components.module.css'

interface HeaderProps {
  screen: string
}

export default function Header({ screen }: HeaderProps) {
  const titles = {
    home: 'CivicLink',
    events: 'Civic Events',
    report: 'Submit Report',
    dashboard: 'My Dashboard'
  }

  return (
    <div className={styles.header}>
      <h1>{titles[screen as keyof typeof titles]}</h1>
      <div className={styles.headerSubtitle}>📍 Baltimore, MD</div>
    </div>
  )
}
