import { generateSeats, Game } from '@/lib/mockData';
import { useMemo } from 'react';

interface SeatingChartProps {
  game: Game;
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

const SeatingChart = ({ game, selectedSeats, onSeatToggle }: SeatingChartProps) => {
  const seats = useMemo(() => {
    const unavailableCount = game.totalSeats - game.availableSeats;
    return generateSeats(game.totalSeats, unavailableCount);
  }, [game]);

  const groupedSeats = useMemo(() => {
    const groups: Record<string, typeof seats> = {};
    seats.forEach(seat => {
      if (!groups[seat.row]) groups[seat.row] = [];
      groups[seat.row].push(seat);
    });
    return groups;
  }, [seats]);

  return (
    <div className="p-6 rounded-xl gradient-card border border-border">
      {/* Stage/Field indicator */}
      <div className="mb-8 text-center">
        <div className="inline-block px-16 py-3 rounded-t-3xl bg-gradient-to-b from-primary/30 to-transparent border-t-2 border-x-2 border-primary/50">
          <span className="font-display text-lg font-bold text-primary">PITCH</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-seat-available" />
          <span className="text-sm text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-seat-selected animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-seat-unavailable" />
          <span className="text-sm text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {/* Seating Grid */}
      <div className="space-y-2 max-w-3xl mx-auto">
        {Object.entries(groupedSeats).map(([row, rowSeats]) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-center font-display font-bold text-primary">{row}</span>
            <div className="flex gap-1.5 flex-wrap justify-center flex-1">
              {rowSeats.map(seat => {
                const isSelected = selectedSeats.includes(seat.id);
                return (
                  <button
                    key={seat.id}
                    onClick={() => seat.available && onSeatToggle(seat.id)}
                    disabled={!seat.available}
                    className={`
                      w-8 h-8 rounded-md text-xs font-semibold transition-all duration-200
                      ${
                        !seat.available
                          ? 'bg-seat-unavailable cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-seat-selected text-primary-foreground shadow-glow scale-110'
                          : 'bg-seat-available text-success-foreground hover:scale-105 hover:brightness-110'
                      }
                    `}
                    title={seat.available ? `Seat ${seat.id}` : 'Unavailable'}
                  >
                    {seat.number}
                  </button>
                );
              })}
            </div>
            <span className="w-6 text-center font-display font-bold text-primary">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatingChart;
