import { useState, useMemo } from 'react';
import { games, teams, venues } from '@/lib/mockData';
import GameCard from '@/components/GameCard';
import { Search, ChevronDown, Ticket, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Games = () => {
  const [searchTeam, setSearchTeam] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTeams = useMemo(() => {
    if (!searchTeam) return [];
    return teams.filter(team =>
      team.toLowerCase().includes(searchTeam.toLowerCase())
    );
  }, [searchTeam]);

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const teamMatch = !searchTeam || 
        game.homeTeam.toLowerCase().includes(searchTeam.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchTeam.toLowerCase());
      const venueMatch = !selectedVenue || game.venue === selectedVenue;
      return teamMatch && venueMatch;
    });
  }, [searchTeam, selectedVenue]);

  const handleTeamSelect = (team: string) => {
    setSearchTeam(team);
    setShowTeamSuggestions(false);
  };

  const clearFilters = () => {
    setSearchTeam('');
    setSelectedVenue('');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            ALL <span className="text-primary">MATCHES</span>
          </h1>
          <p className="text-muted-foreground text-lg">Browse and book tickets for upcoming games</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full mb-4 border-border"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          <div className={`grid md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            {/* Team Search */}
            <div className="relative md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Search by Team</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter team name..."
                  value={searchTeam}
                  onChange={(e) => {
                    setSearchTeam(e.target.value);
                    setShowTeamSuggestions(true);
                  }}
                  onFocus={() => setShowTeamSuggestions(true)}
                  className="pl-10 bg-card border-border focus:border-primary"
                />
              </div>
              
              {showTeamSuggestions && filteredTeams.length > 0 && (
                <div className="absolute z-20 w-full mt-1 rounded-lg bg-card border border-border shadow-lg max-h-48 overflow-y-auto">
                  {filteredTeams.map(team => (
                    <button
                      key={team}
                      onClick={() => handleTeamSelect(team)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors text-foreground"
                    >
                      {team}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Venue Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Filter by Venue</label>
              <div className="relative">
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full h-10 px-3 pr-10 rounded-md bg-card border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">All Venues</option>
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full border-border text-muted-foreground hover:text-foreground"
                disabled={!searchTeam && !selectedVenue}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {(searchTeam || selectedVenue) && (
            <p className="text-sm text-muted-foreground mt-4">
              Showing {filteredGames.length} match{filteredGames.length !== 1 ? 'es' : ''}
              {searchTeam && ` for "${searchTeam}"`}
              {selectedVenue && ` at ${selectedVenue}`}
            </p>
          )}
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Ticket className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">No Matches Found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search filters to find available games</p>
            <Button onClick={clearFilters} className="gradient-primary text-primary-foreground">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
