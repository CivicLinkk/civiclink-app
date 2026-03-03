import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from '../styles/Forms.module.css'

interface ICEFormProps {
  onSuccess: (trackingNumber: string) => void
}

export default function ICEForm({ onSuccess }: ICEFormProps) {
  const [loading, setLoading] = useState(false)
  const [firstTime, setFirstTime] = useState<boolean | null>(null)
  const [gpsCoords, setGpsCoords] = useState<{lat: number, lng: number} | null>(null)
  const [formData, setFormData] = useState({
    incident_date: '',
    incident_time: '',
    location: '',
    agent_name: '',
    badge_number: '',
    agent_count: '',
    vehicle_info: '',
    description: '',
    photos: [] as string[],
    videos: [] as string[]
  })

  function getGPS() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => alert('Unable to get location')
      )
    } else {
      alert('Geolocation not supported')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (firstTime === null) {
      alert('Please select if this is your first time seeing ICE at this location')
      return
    }

    setLoading(true)

    try {
      const trackingNumber = `LE-2025-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`

      const { error } = await supabase
        .from('le_reports')
        .insert([{
          tracking_number: trackingNumber,
          agency_type: 'ice',
          incident_date: formData.incident_date,
          incident_time: formData.incident_time,
          location_address: formData.location,
          latitude: gpsCoords?.lat,
          longitude: gpsCoords?.lng,
          officer_name: formData.agent_name, // Using officer_name field for agent
          badge_number: formData.badge_number,
          agent_count: formData.agent_count ? parseInt(formData.agent_count) : null,
          vehicle_info: formData.vehicle_info,
          description: formData.description,
          first_time_location: firstTime,
          photo_paths: formData.photos,
          video_paths: formData.videos,
          report_status: 'private'
        }])

      if (error) throw error

      onSuccess(trackingNumber)
      
      // Reset form
      setFormData({
        incident_date: '',
        incident_time: '',
        location: '',
        agent_name: '',
        badge_number: '',
        agent_count: '',
        vehicle_info: '',
        description: '',
        photos: [],
        videos: []
      })
      setFirstTime(null)
      setGpsCoords(null)
    } catch (error) {
      alert('Error submitting report. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.notice}>
        🛡️ <strong>Your Safety First:</strong> This report is completely private and encrypted.
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Date Spotted *</label>
        <input
          type="date"
          className={styles.input}
          value={formData.incident_date}
          onChange={(e) => setFormData({...formData, incident_date: e.target.value})}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Time Spotted</label>
        <input
          type="time"
          className={styles.input}
          value={formData.incident_time}
          onChange={(e) => setFormData({...formData, incident_time: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Location *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Street address or nearby landmark"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={getGPS}
        >
          📍 Use My Current Location
        </button>
        {gpsCoords && (
          <div className={styles.coordsBox}>
            🗺️ Location Captured: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>First time seeing ICE here? *</label>
        <div className={styles.freqGrid}>
          <div
            className={`${styles.freqBtn} ${firstTime === true ? styles.selected : ''}`}
            onClick={() => setFirstTime(true)}
          >
            ✓ First Time Here
          </div>
          <div
            className={`${styles.freqBtn} ${firstTime === false ? styles.selected : ''}`}
            onClick={() => setFirstTime(false)}
          >
            ⚠️ Seen Before Here
          </div>
        </div>
        <div className={styles.helper}>Helps track ICE activity patterns</div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Number of Agents</label>
        <input
          type="number"
          className={styles.input}
          placeholder="How many agents?"
          value={formData.agent_count}
          onChange={(e) => setFormData({...formData, agent_count: e.target.value})}
          min="1"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Agent Name/Description</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Name on uniform or physical description"
          value={formData.agent_name}
          onChange={(e) => setFormData({...formData, agent_name: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Badge Number (Encrypted)</label>
        <input
          type="text"
          className={styles.input}
          placeholder="If visible"
          value={formData.badge_number}
          onChange={(e) => setFormData({...formData, badge_number: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Vehicle Info</label>
        <input
          type="text"
          className={styles.input}
          placeholder="License plate, color, type, markings"
          value={formData.vehicle_info}
          onChange={(e) => setFormData({...formData, vehicle_info: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>What Did You Observe? *</label>
        <textarea
          className={styles.textarea}
          placeholder="Describe what you saw..."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? 'Submitting Securely...' : '🔒 Submit Secure Report'}
      </button>
    </form>
  )
}
