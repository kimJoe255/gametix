import { useParams, useNavigate } from 'react-router-dom';
import { games } from '@/lib/mockData';
import { useBooking } from '@/context/BookingContext';
import SeatingChart from '@/components/SeatingChart';
import { Calendar, MapPin, Clock, Ticket, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, currentBooking, selectGame, toggleSeat, clearSelection } = useBooking();

  const game = games.find(g => g.id === id);

  useEffect(() => {
    if (game) {
      selectGame(game);
    }
    return () => clearSelection();
  }, [game?.id]);

  if (!game) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Ticket className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Game Not Found</h1>
          <p className="text-muted-foreground mb-6">The match you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('/games')} className="gradient-primary text-primary-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const totalPrice = currentBooking.selectedSeats.length * game.ticketPrice;

  const handleProceedToPayment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login or register to book tickets.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (currentBooking.selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }

    navigate('/payment');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/games')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Games
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Game Info & Seating */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game Header */}
            <div className="rounded-xl overflow-hidden gradient-card border border-border">
              <div className="relative h-48 md:h-64">
                <img
                  src={game.image}
                  alt={`${game.homeTeam} vs ${game.awayTeam}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-center gap-6">
                    <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">{game.homeTeam}</h1>
                    <span className="font-display text-3xl md:text-5xl font-bold text-primary">VS</span>
                    <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">{game.awayTeam}</h1>
                  </div>
                </div>
              </div>

              <div className="p-6 grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Date</p>
                    <p className="font-semibold text-foreground">{formatDate(game.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Kick-off</p>
                    <p className="font-semibold text-foreground">{game.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Venue</p>
                    <p className="font-semibold text-foreground">{game.venue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seating Chart */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">SELECT YOUR SEATS</h2>
              <SeatingChart
                game={game}
                selectedSeats={currentBooking.selectedSeats}
                onSeatToggle={toggleSeat}
              />
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl gradient-card border border-border shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6">BOOKING SUMMARY</h2>

              {/* Ticket Price */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Ticket Price</span>
                <span className="font-semibold text-foreground">${game.ticketPrice} each</span>
              </div>

              {/* Selected Seats */}
              <div className="py-4 border-b border-border">
                <p className="text-muted-foreground mb-3">Selected Seats ({currentBooking.selectedSeats.length})</p>
                {currentBooking.selectedSeats.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentBooking.selectedSeats.map(seat => (
                      <span
                        key={seat}
                        className="px-3 py-1.5 rounded-md gradient-primary font-display font-bold text-primary-foreground text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No seats selected</p>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4">
                <span className="font-display text-lg font-bold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-primary">${totalPrice}</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleProceedToPayment}
                  disabled={currentBooking.selectedSeats.length === 0}
                  className="w-full gradient-primary text-primary-foreground font-semibold disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>

                {currentBooking.selectedSeats.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearSelection}
                    className="w-full border-border text-muted-foreground hover:text-foreground"
                  >
                    Clear Selection
                  </Button>
                )}
              </div>

              {/* Info */}
              <div className="mt-6 p-4 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> Seats are held for 10 minutes once you proceed to payment. Complete your payment within this time to confirm your booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
