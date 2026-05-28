export interface StatusOption {
  value: string
  label: string
  emoji: string
}

export interface Fragment {
  id: string
  createdAt: string
  text: string
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'rainbow'
  images: string[]
  video?: string
}

export interface Habit {
  id: string
  name: string
  icon: string
  streakMe: number
  streakHer: number
  history: Record<string, { me: boolean; her: boolean }>
}

export interface Footprint {
  id: string
  destination: string
  dateRange: [string, string]
  photos: string[]
  vlog?: string
  notes: string
}

export interface BucketItem {
  id: string
  title: string
  completed: boolean
  completedAt?: string
  photos: string[]
  video?: string
  note?: string
}

export interface LoveLetter {
  id: string
  from: '小鸡毛' | '小白'
  title: string
  content: string
  createdAt: string
  unlockAt: string
  isRead: boolean
}
