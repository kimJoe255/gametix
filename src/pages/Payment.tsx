import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import { CreditCard, Building, Phone, Copy, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, currentBooking, submitPayment } = useBooking();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Redirect if no booking in progress
  if (!currentBooking.game || currentBooking.selectedSeats.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">No Booking in Progress</h1>
          <p className="text-muted-foreground mb-6">Please select a game and seats first.</p>
          <Button onClick={() => navigate('/games')} className="gradient-primary text-primary-foreground">
            Browse Games
          </Button>
        </div>
      </div>
    );
  }

  const { game, selectedSeats } = currentBooking;
  const totalPrice = selectedSeats.length * game.ticketPrice;

  const paymentDetails = {
    bankName: 'National Bank',
    accountNumber: '1234567890123456',
    accountName: 'GameTix Payments Ltd',
    mobileMoneyNumber: '+1 234 567 8900',
    mobileMoneyName: 'GameTix Mobile',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter your transaction ID after making the payment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const booking = submitPayment(transactionId.trim());
    
    if (booking) {
      setSubmitted(true);
      toast({
        title: "Payment Submitted!",
        description: "Your payment is pending admin verification.",
      });
    } else {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 rounded-xl gradient-card border border-border animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-warning" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Payment Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Your payment is <span className="text-warning font-semibold">pending admin verification</span>. 
            You will receive a confirmation once your payment is verified.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/my-tickets')} className="w-full gradient-primary text-primary-foreground">
              View My Tickets
            </Button>
            <Button variant="outline" onClick={() => navigate('/games')} className="w-full border-border">
              Book More Tickets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          COMPLETE YOUR <span className="text-primary">PAYMENT</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="space-y-6">
            <div className="rounded-xl gradient-card border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                Bank Transfer
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Bank Name</p>
                  <p className="font-semibold text-foreground">{paymentDetails.bankName}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Account Name</p>
                  <p className="font-semibold text-foreground">{paymentDetails.accountName}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Account Number</p>
                    <p className="font-semibold text-foreground font-mono">{paymentDetails.accountNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentDetails.accountNumber, 'Account Number')}
                    className="text-primary"
                  >
                    {copiedField === 'Account Number' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-xl gradient-card border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Mobile Money
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Account Name</p>
                  <p className="font-semibold text-foreground">{paymentDetails.mobileMoneyName}</p>
                </div>
                
                <div className="p-4 rounded-lg bg-secondary flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase mb-1">Mobile Number</p>
                    <p className="font-semibold text-foreground font-mono">{paymentDetails.mobileMoneyNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(paymentDetails.mobileMoneyNumber, 'Mobile Number')}
                    className="text-primary"
                  >
                    {copiedField === 'Mobile Number' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & TID Form */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-xl gradient-card border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Match</span>
                  <span className="text-foreground font-medium">{game.homeTeam} vs {game.awayTeam}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Seats</span>
                  <span className="text-foreground font-medium">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Quantity</span>
                  <span className="text-foreground font-medium">{selectedSeats.length} ticket(s)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Price per ticket</span>
                  <span className="text-foreground font-medium">${game.ticketPrice}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-between">
                <span className="font-display text-lg font-bold text-foreground">Total Amount</span>
                <span className="font-display text-2xl font-bold text-primary">${totalPrice}</span>
              </div>
            </div>

            {/* Transaction ID Form */}
            <form onSubmit={handleSubmit} className="rounded-xl gradient-card border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Submit Payment
              </h2>
              
              <p className="text-muted-foreground text-sm mb-4">
                After making the payment, enter your Transaction ID (TID) below to confirm your booking.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="tid" className="block text-sm font-medium text-foreground mb-2">
                    Transaction ID (TID)
                  </label>
                  <Input
                    id="tid"
                    type="text"
                    placeholder="e.g., TXN123456789"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="bg-secondary border-border focus:border-primary font-mono"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-primary text-primary-foreground font-semibold"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Transaction ID'}
                </Button>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-xs text-warning flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Your ticket will be available for download once the admin verifies your payment.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
