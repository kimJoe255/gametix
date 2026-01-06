import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { games, teams, venues } from '@/lib/mockData';
import GameCard from '@/components/GameCard';
import { Search, ChevronDown, Ticket, Trophy, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [searchTeam, setSearchTeam] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [showTeamSuggestions, setShowTeamSuggestions] = useState(false);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 animate-fade-in">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premier League 2026</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              BOOK YOUR
              <span className="block text-gradient">MATCH TICKETS</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Experience the thrill live. Secure your seats for the most exciting matches of the season.
            </p>

            {/* Search Section */}
            <div className="max-w-3xl mx-auto p-6 rounded-2xl gradient-card border border-border shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Team Search with Autocomplete */}
                <div className="relative">
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">Team Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search team..."
                      value={searchTeam}
                      onChange={(e) => {
                        setSearchTeam(e.target.value);
                        setShowTeamSuggestions(true);
                      }}
                      onFocus={() => setShowTeamSuggestions(true)}
                      className="pl-10 bg-secondary border-border focus:border-primary"
                    />
                  </div>
                  
                  {/* Autocomplete Dropdown */}
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2 text-left">Venue</label>
                  <div className="relative">
                    <select
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-md bg-secondary border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">All Venues</option>
                      {venues.map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button className="w-full gradient-primary text-primary-foreground font-semibold h-10">
                    <Search className="w-4 h-4 mr-2" />
                    Search Games
                  </Button>
                </div>
              </div>

              {searchTeam || selectedVenue ? (
                <p className="text-sm text-muted-foreground mt-4 text-left">
                  Found {filteredGames.length} match{filteredGames.length !== 1 ? 'es' : ''}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Ticket, value: '50K+', label: 'Tickets Sold' },
              { icon: Trophy, value: '120+', label: 'Matches' },
              { icon: Users, value: '25K+', label: 'Happy Fans' },
              { icon: Shield, value: '100%', label: 'Secure Payments' },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-16" id="games">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                UPCOMING <span className="text-primary">MATCHES</span>
              </h2>
              <p className="text-muted-foreground mt-2">Don&apos;t miss out on the action</p>
            </div>
            <Link to="/games">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All
              </Button>
            </Link>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">No Matches Found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            READY TO EXPERIENCE
            <span className="block text-gradient">THE THRILL?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of fans and book your tickets today. Easy booking, secure payments, unforgettable moments.
          </p>
          <Link to="/games">
            <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-lg px-8 animate-pulse-glow">
              <Ticket className="w-5 h-5 mr-2" />
              Book Your Tickets Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">
                GAME<span className="text-primary">TIX</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GameTix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
