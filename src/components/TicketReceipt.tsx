import { Booking } from '@/lib/mockData';
import { QrCode, Calendar, MapPin, Clock, Ticket, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketReceiptProps {
  booking: Booking;
}

const TicketReceipt = ({ booking }: TicketReceiptProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Ticket download started! (Demo)');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="relative rounded-2xl overflow-hidden gradient-card border-2 border-primary/30 shadow-glow">
        {/* Header */}
        <div className="gradient-primary p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Ticket className="w-6 h-6 text-primary-foreground" />
            <span className="font-display text-xl font-bold text-primary-foreground">GAMETIX</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-primary-foreground">MATCH TICKET</h2>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* Teams */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4">
              <span className="font-display text-xl font-bold text-foreground">{booking.game.homeTeam}</span>
              <span className="font-display text-2xl font-bold text-primary">VS</span>
              <span className="font-display text-xl font-bold text-foreground">{booking.game.awayTeam}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase">Date</span>
              </div>
              <p className="font-semibold text-foreground text-sm">{formatDate(booking.game.date)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase">Time</span>
              </div>
              <p className="font-semibold text-foreground text-sm">{booking.game.time}</p>
            </div>
            <div className="col-span-2 p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase">Venue</span>
              </div>
              <p className="font-semibold text-foreground">{booking.game.venue}</p>
            </div>
          </div>

          {/* Seats */}
          <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 mb-6">
            <p className="text-xs text-muted-foreground uppercase mb-2">Seat(s)</p>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map(seat => (
                <span
                  key={seat}
                  className="px-3 py-1.5 rounded-md gradient-primary font-display font-bold text-primary-foreground"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-foreground/5">
            <div className="w-32 h-32 rounded-lg bg-foreground flex items-center justify-center">
              <QrCode className="w-24 h-24 text-background" />
            </div>
            <p className="text-xs text-muted-foreground">Scan for entry</p>
            <p className="text-xs font-mono text-muted-foreground">{booking.id}</p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute -left-10 top-1/2 w-8 h-8 rounded-full bg-background" />
            <div className="absolute -right-10 top-1/2 w-8 h-8 rounded-full bg-background" />
            <div className="border-t-2 border-dashed border-border" />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Paid</span>
            <span className="font-display text-2xl font-bold text-primary">${booking.totalPrice}</span>
          </div>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            className="w-full gradient-primary text-primary-foreground font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketReceipt;
