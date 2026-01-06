import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Game, Booking, mockBookings } from '@/lib/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface BookingContextType {
  user: User | null;
  bookings: Booking[];
  currentBooking: {
    game: Game | null;
    selectedSeats: string[];
  };
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  selectGame: (game: Game) => void;
  toggleSeat: (seatId: string) => void;
  clearSelection: () => void;
  submitPayment: (transactionId: string) => Booking | null;
  verifyPayment: (bookingId: string, approved: boolean) => void;
  getUserBookings: () => Booking[];
  getAllBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [currentBooking, setCurrentBooking] = useState<{ game: Game | null; selectedSeats: string[] }>({
    game: null,
    selectedSeats: [],
  });

  const login = (email: string, password: string): boolean => {
    // Mock login - in real app, validate against backend
    if (email === 'admin@tickets.com' && password === 'admin123') {
      setUser({ id: 'admin', name: 'Admin User', email, isAdmin: true });
      return true;
    }
    if (email && password.length >= 6) {
      setUser({ id: 'user1', name: email.split('@')[0], email, isAdmin: false });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentBooking({ game: null, selectedSeats: [] });
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (name && email && password.length >= 6) {
      setUser({ id: `user_${Date.now()}`, name, email, isAdmin: false });
      return true;
    }
    return false;
  };

  const selectGame = (game: Game) => {
    setCurrentBooking({ game, selectedSeats: [] });
  };

  const toggleSeat = (seatId: string) => {
    setCurrentBooking(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.includes(seatId)
        ? prev.selectedSeats.filter(s => s !== seatId)
        : [...prev.selectedSeats, seatId],
    }));
  };

  const clearSelection = () => {
    setCurrentBooking(prev => ({ ...prev, selectedSeats: [] }));
  };

  const submitPayment = (transactionId: string): Booking | null => {
    if (!user || !currentBooking.game || currentBooking.selectedSeats.length === 0) {
      return null;
    }

    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      gameId: currentBooking.game.id,
      game: currentBooking.game,
      seats: currentBooking.selectedSeats,
      totalPrice: currentBooking.selectedSeats.length * currentBooking.game.ticketPrice,
      transactionId,
      status: 'pending',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [...prev, newBooking]);
    setCurrentBooking({ game: null, selectedSeats: [] });
    return newBooking;
  };

  const verifyPayment = (bookingId: string, approved: boolean) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: approved ? 'approved' : 'rejected' } : b
      )
    );
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter(b => b.userId === user.id);
  };

  const getAllBookings = () => bookings;

  return (
    <BookingContext.Provider
      value={{
        user,
        bookings,
        currentBooking,
        login,
        logout,
        register,
        selectGame,
        toggleSeat,
        clearSelection,
        submitPayment,
        verifyPayment,
        getUserBookings,
        getAllBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
