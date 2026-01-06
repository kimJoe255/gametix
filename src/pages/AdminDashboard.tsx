import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { Shield, CheckCircle, XCircle, Clock, User, Mail, Ticket, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getAllBookings, verifyPayment } = useBooking();

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate('/auth')} className="gradient-primary text-primary-foreground">
            Login as Admin
          </Button>
        </div>
      </div>
    );
  }

  const allBookings = getAllBookings();
  const pendingBookings = allBookings.filter(b => b.status === 'pending');
  const approvedBookings = allBookings.filter(b => b.status === 'approved');
  const rejectedBookings = allBookings.filter(b => b.status === 'rejected');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleVerify = (bookingId: string, approved: boolean) => {
    verifyPayment(bookingId, approved);
    toast({
      title: approved ? "Payment Approved" : "Payment Rejected",
      description: approved 
        ? "The customer can now download their ticket." 
        : "The customer has been notified of the rejection.",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' };
      default:
        return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' };
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            ADMIN <span className="text-primary">DASHBOARD</span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl gradient-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{allBookings.length}</p>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl gradient-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{pendingBookings.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl gradient-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{approvedBookings.length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl gradient-card border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{rejectedBookings.length}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Verifications Section */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Pending Verifications ({pendingBookings.length})
          </h2>

          {pendingBookings.length === 0 ? (
            <div className="rounded-xl gradient-card border border-border p-8 text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">All payments have been verified!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="rounded-xl gradient-card border border-warning/30 p-5 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase">Customer</span>
                      </div>
                      <p className="font-semibold text-foreground">{booking.userName}</p>
                      <p className="text-sm text-muted-foreground">{booking.userEmail}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Ticket className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase">Match</span>
                      </div>
                      <p className="font-semibold text-foreground">{booking.game.homeTeam} vs {booking.game.awayTeam}</p>
                      <p className="text-sm text-muted-foreground">Seats: {booking.seats.join(', ')}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase">Amount</span>
                      </div>
                      <p className="font-display text-xl font-bold text-primary">${booking.totalPrice}</p>
                      <p className="text-sm text-muted-foreground font-mono">TID: {booking.transactionId}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase">Submitted</span>
                      </div>
                      <p className="text-sm text-foreground">{formatDate(booking.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleVerify(booking.id, true)}
                      className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Payment
                    </Button>
                    <Button
                      onClick={() => handleVerify(booking.id, false)}
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Bookings Table */}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-4">All Bookings</h2>
          
          <div className="rounded-xl gradient-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-4 font-display font-semibold text-foreground">Customer</th>
                    <th className="text-left p-4 font-display font-semibold text-foreground">Match</th>
                    <th className="text-left p-4 font-display font-semibold text-foreground">Seats</th>
                    <th className="text-left p-4 font-display font-semibold text-foreground">Amount</th>
                    <th className="text-left p-4 font-display font-semibold text-foreground">TID</th>
                    <th className="text-left p-4 font-display font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-foreground">{booking.userName}</p>
                          <p className="text-sm text-muted-foreground">{booking.userEmail}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-foreground">{booking.game.homeTeam} vs {booking.game.awayTeam}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {booking.seats.map(seat => (
                              <span key={seat} className="px-2 py-0.5 rounded text-xs font-semibold bg-secondary text-foreground">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-display font-bold text-primary">${booking.totalPrice}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm text-muted-foreground">{booking.transactionId}</span>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                            <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
