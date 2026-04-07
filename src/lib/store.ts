import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  icon?: string;
  features: string[];
  isActive: boolean;
}

export interface BookingData {
  serviceId: string;
  date: Date | null;
  time: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  addOns: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN';
}

interface AppState {
  // Services
  services: Service[];
  setServices: (services: Service[]) => void;
  
  // Booking
  bookingData: BookingData;
  setBookingData: (data: Partial<BookingData>) => void;
  resetBookingData: () => void;
  
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  // UI State
  isBookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup';
  setAuthModalTab: (tab: 'login' | 'signup') => void;
}

const initialBookingData: BookingData = {
  serviceId: '',
  date: null,
  time: '09:00',
  address: '',
  city: 'Saskatoon',
  postalCode: '',
  notes: '',
  addOns: [],
};

export const useAppStore = create<AppState>((set) => ({
  // Services
  services: [],
  setServices: (services) => set({ services }),
  
  // Booking
  bookingData: initialBookingData,
  setBookingData: (data) => set((state) => ({ 
    bookingData: { ...state.bookingData, ...data } 
  })),
  resetBookingData: () => set({ bookingData: initialBookingData }),
  
  // Auth
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
  
  // UI State
  isBookingModalOpen: false,
  setBookingModalOpen: (open) => set({ isBookingModalOpen: open }),
  isAuthModalOpen: false,
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  authModalTab: 'login',
  setAuthModalTab: (tab) => set({ authModalTab: tab }),
}));
