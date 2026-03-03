import styles from '../styles/Components.module.css'

interface NavigationProps {
  screen: string
  setScreen: (screen: string) => void
}

export default function Navigation({ screen, setScreen }: NavigationProps) {
  return (
    <div className={styles.bottomNav}>
      <div 
        className={`${styles.navItem} ${screen === 'home' ? styles.active : ''}`}
        onClick={() => setScreen('home')}
      >
        <div className={styles.navIcon}>🏠</div>
        <div className={styles.navLabel}>Home</div>
      </div>
      
      <div 
        className={`${styles.navItem} ${screen === 'events' ? styles.active : ''}`}
        onClick={() => setScreen('events')}
      >
        <div className={styles.navIcon}>📅</div>
        <div className={styles.navLabel}>Events</div>
      </div>
      
      <div 
        className={`${styles.navItem} ${screen === 'report' ? styles.active : ''}`}
        onClick={() => setScreen('report')}
      >
        <div className={styles.navIcon}>➕</div>
        <div className={styles.navLabel}>Report</div>
      </div>
      
      <div 
        className={`${styles.navItem} ${screen === 'dashboard' ? styles.active : ''}`}
        onClick={() => setScreen('dashboard')}
      >
        <div className={styles.navIcon}>👤</div>
        <div className={styles.navLabel}>Dashboard</div>
      </div>
    </div>
  )
}
