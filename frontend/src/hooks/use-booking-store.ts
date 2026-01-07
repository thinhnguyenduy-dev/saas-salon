import { create } from 'zustand'

export interface Service {
  id: string
  name: string
  price: number
  duration: number // details in minutes
}

export interface Staff {
  id: string
  name: string
  image?: string
}

export interface TimeSlot {
  date: Date
  time: string // HH:mm
}

interface BookingState {
  step: number
  services: Service[]
  staff: Staff | null
  timeSlot: TimeSlot | null
  
  // Actions
  setStep: (step: number) => void
  addService: (service: Service) => void
  removeService: (serviceId: string) => void
  setStaff: (staff: Staff | null) => void
  setTimeSlot: (slot: TimeSlot | null) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  services: [],
  staff: null,
  timeSlot: null,

  setStep: (step) => set({ step }),
  
  addService: (service) => set((state) => {
    // Prevent duplicates
    if (state.services.find(s => s.id === service.id)) return state
    return { services: [...state.services, service] }
  }),

  removeService: (serviceId) => set((state) => ({
    services: state.services.filter(s => s.id !== serviceId)
  })),

  setStaff: (staff) => set({ staff }),
  
  setTimeSlot: (timeSlot) => set({ timeSlot }),

  reset: () => set({ 
    step: 1, 
    services: [], 
    staff: null, 
    timeSlot: null 
  })
}))
