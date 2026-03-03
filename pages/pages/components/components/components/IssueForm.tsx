import { useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from '../styles/Forms.module.css'

interface IssueFormProps {
  onSuccess: (trackingNumber: string) => void
}

export default function IssueForm({ onSuccess }: IssueFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'infrastructure',
    location: '',
    description: '',
    photos: [] as string[]
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate tracking number
      const trackingNumber = `CVLK-2025-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`

      // Insert into database
      const { error } = await supabase
        .from('issue_reports')
        .insert([{
          tracking_number: trackingNumber,
          title: formData.title,
          category: formData.category,
          location: formData.location,
          description: formData.description,
          photo_urls: formData.photos,
          status: 'submitted',
          is_public: false
        }])

      if (error) throw error

      onSuccess(trackingNumber)
      
      // Reset form
      setFormData({
        title: '',
        category: 'infrastructure',
        location: '',
        description: '',
        photos: []
      })
    } catch (error) {
      alert('Error submitting report. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Issue Title *</label>
        <input
          type="text"
          className={styles.input}
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Category</label>
        <select
          className={styles.select}
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          <option value="infrastructure">Infrastructure</option>
          <option value="safety">Safety</option>
          <option value="housing">Housing</option>
          <option value="services">Public Services</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Location</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Street address or intersection"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description *</label>
        <textarea
          className={styles.textarea}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <button type="submit" className={styles.btnPrimary} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Issue Report'}
      </button>
    </form>
  )
}
