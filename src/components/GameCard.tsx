import { Link } from 'react-router-dom';
import { Game } from '@/lib/mockData';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameCardProps {
  game: Game;
  index?: number;
}

const GameCard = ({ game, index = 0 }: GameCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="group relative rounded-xl overflow-hidden gradient-card border border-border shadow-card hover:shadow-card-hover transition-all duration-500 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.image}
          alt={`${game.homeTeam} vs ${game.awayTeam}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full gradient-primary">
          <span className="font-display font-bold text-primary-foreground">${game.ticketPrice}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <h3 className="font-display text-lg font-bold text-foreground leading-tight">
              {game.homeTeam}
            </h3>
          </div>
          <div className="px-3">
            <span className="font-display text-2xl font-bold text-primary">VS</span>
          </div>
          <div className="text-center flex-1">
            <h3 className="font-display text-lg font-bold text-foreground leading-tight">
              {game.awayTeam}
            </h3>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm">{formatDate(game.date)}</span>
            <Clock className="w-4 h-4 text-primary ml-2" />
            <span className="text-sm">{game.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{game.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ticket className="w-4 h-4 text-primary" />
            <span className="text-sm">{game.availableSeats} seats available</span>
          </div>
        </div>

        {/* Button */}
        <Link to={`/game/${game.id}`}>
          <Button className="w-full gradient-primary text-primary-foreground font-semibold group-hover:animate-pulse-glow transition-all">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
