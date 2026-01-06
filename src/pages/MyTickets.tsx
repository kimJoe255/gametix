import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import TicketReceipt from '@/components/TicketReceipt';
import { Ticket, Calendar, MapPin, Clock, Download, AlertCircle, CheckCircle, XCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, getUserBookings } = useBooking();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6">Please login to view your tickets.</p>
          <Button onClick={() => navigate('/auth')} className="gradient-primary text-primary-foreground">
            Login / Register
          </Button>
        </div>
      </div>
    );
  }

  const bookings = getUserBookings();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' };
      default:
        return { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Verification' };
    }
  };

  const selectedBookingData = bookings.find(b => b.id === selectedBooking);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          MY <span className="text-primary">TICKETS</span>
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <Ticket className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">No Tickets Yet</h2>
            <p className="text-muted-foreground mb-6">You haven&apos;t booked any tickets yet. Start exploring matches!</p>
            <Button onClick={() => navigate('/games')} className="gradient-primary text-primary-foreground">
              Browse Games
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tickets List */}
            <div className="space-y-4">
              {bookings.map((booking, index) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div
                    key={booking.id}
                    className={`rounded-xl gradient-card border transition-all duration-300 cursor-pointer animate-fade-in ${
                      selectedBooking === booking.id ? 'border-primary shadow-glow' : 'border-border hover:border-primary/50'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedBooking(booking.id)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">
                            {booking.game.homeTeam} vs {booking.game.awayTeam}
                          </h3>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${statusConfig.bg} mt-2`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                            <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                          </div>
                        </div>
                        <span className="font-display text-xl font-bold text-primary">${booking.totalPrice}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{formatDate(booking.game.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{booking.game.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{booking.game.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Seats</p>
                          <div className="flex flex-wrap gap-1">
                            {booking.seats.map(seat => (
                              <span key={seat} className="px-2 py-0.5 rounded text-xs font-semibold bg-secondary text-foreground">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>
                        {booking.status === 'approved' && (
                          <Button
                            size="sm"
                            className="gradient-primary text-primary-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking.id);
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            View Ticket
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ticket Preview */}
            <div className="hidden lg:block">
              {selectedBookingData ? (
                selectedBookingData.status === 'approved' ? (
                  <div className="sticky top-24">
                    <h2 className="font-display text-xl font-bold text-foreground mb-4">TICKET PREVIEW</h2>
                    <TicketReceipt booking={selectedBookingData} />
                  </div>
                ) : selectedBookingData.status === 'rejected' ? (
                  <div className="sticky top-24 p-8 rounded-xl gradient-card border border-destructive/30 text-center">
                    <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">Payment Not Verified</h3>
                    <p className="text-muted-foreground mb-4">
                      Your payment could not be verified. Please contact support for assistance.
                    </p>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                      Contact Support
                    </Button>
                  </div>
                ) : (
                  <div className="sticky top-24 p-8 rounded-xl gradient-card border border-warning/30 text-center">
                    <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">Pending Verification</h3>
                    <p className="text-muted-foreground">
                      Your payment is being verified. Your ticket will be available for download once approved.
                    </p>
                  </div>
                )
              ) : (
                <div className="sticky top-24 p-8 rounded-xl gradient-card border border-border text-center">
                  <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">Select a Ticket</h3>
                  <p className="text-muted-foreground">Click on a booking to view ticket details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
