import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type IssueReport = {
  id: number
  tracking_number: string
  title: string
  category: string
  location: string
  description: string
  photo_urls: string[]
  status: string
  created_at: string
}

export type LEReport = {
  id: number
  tracking_number: string
  agency_type: 'police' | 'ice'
  incident_date: string
  incident_time?: string
  location_address: string
  latitude?: number
  longitude?: number
  agent_name?: string
  badge_number?: string
  agent_count?: number
  vehicle_info?: string
  description: string
  first_time_location?: boolean
  photo_paths: string[]
  video_paths: string[]
  created_at: string
}

export type CivicEvent = {
  id: number
  title: string
  description: string
  event_type: string
  start_time: string
  location_address: string
  created_at: string
}
