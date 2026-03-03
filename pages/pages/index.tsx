import { useState, useEffect } from 'react'
import { supabase, IssueReport, LEReport, CivicEvent } from '../lib/supabase'
import Navigation from '../components/Navigation'
import Header from '../components/Header'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [screen, setScreen] = useState('home')
  const [issues, setIssues] = useState<IssueReport[]>([])
  const [leReports, setLeReports] = useState<LEReport[]>([])
  const [events, setEvents] = useState<CivicEvent[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    // Load issues
    const { data: issuesData } = await supabase
      .from('issue_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (issuesData) setIssues(issuesData)

    // Load events
    const { data: eventsData } = await supabase
      .from('civic_events')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(5)
    
    if (eventsData) setEvents(eventsData)

    // Load LE reports count (don't show details)
    const { count } = await supabase
      .from('le_reports')
      .select('*', { count: 'exact', head: true })
    
    // Store count but not details (privacy)
  }

  return (
    <div className={styles.container}>
      <Header screen={screen} />
      
      <main className={styles.main}>
        {screen === 'home' && (
          <div>
            <div className={styles.alert}>
              <strong>✓ Welcome to CivicLink!</strong> Report issues, document law enforcement activity, and engage with local democracy.
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{events.length}</div>
                <div className={styles.statLabel}>Events</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{issues.length}</div>
                <div className={styles.statLabel}>Issues</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>-</div>
                <div className={styles.statLabel}>Private</div>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>Get Started</h3>
            
            {issues.slice(0, 2).map(issue => (
              <div key={issue.id} className={styles.card}>
                <div className={styles.cardTitle}>🔧 {issue.title}</div>
                <div className={styles.cardMeta}>
                  {issue.category} • <span className={styles.badge}>{issue.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'events' && (
          <div>
            <h3 className={styles.sectionTitle}>Upcoming Events</h3>
            {events.map(event => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventTitle}>{event.title}</div>
                <div className={styles.eventMeta}>
                  📅 {new Date(event.start_time).toLocaleDateString()}<br/>
                  📍 {event.location_address}
                </div>
                <button className={styles.btnPrimary}>Save Event</button>
              </div>
            ))}
          </div>
        )}

        {screen === 'report' && (
          <div>
            <h3 className={styles.sectionTitle}>Submit Report</h3>
            <div className={styles.card}>
              <p style={{textAlign: 'center', color: '#666'}}>
                Report forms will load here. Full implementation coming next.
              </p>
            </div>
          </div>
        )}

        {screen === 'dashboard' && (
          <div>
            <h3 className={styles.sectionTitle}>My Reports</h3>
            <div className={styles.card}>
              <p style={{textAlign: 'center', color: '#666'}}>
                Your submitted reports will appear here.
              </p>
            </div>
          </div>
        )}
      </main>

      <Navigation screen={screen} setScreen={setScreen} />
    </div>
  )
}
