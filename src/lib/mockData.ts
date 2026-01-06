export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  image: string;
  availableSeats: number;
  totalSeats: number;
}

export interface Booking {
  id: string;
  gameId: string;
  game: Game;
  seats: string[];
  totalPrice: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export const teams = [
  "Manchester United",
  "Liverpool FC",
  "Arsenal",
  "Chelsea",
  "Manchester City",
  "Tottenham Hotspur",
  "Newcastle United",
  "Brighton & Hove",
  "Aston Villa",
  "West Ham United",
];

export const venues = [
  "Old Trafford",
  "Anfield",
  "Emirates Stadium",
  "Stamford Bridge",
  "Etihad Stadium",
  "Tottenham Hotspur Stadium",
  "St. James' Park",
  "American Express Stadium",
  "Villa Park",
  "London Stadium",
];

export const games: Game[] = [
  {
    id: "1",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool FC",
    date: "2026-01-15",
    time: "15:00",
    venue: "Old Trafford",
    ticketPrice: 85,
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
    availableSeats: 156,
    totalSeats: 200,
  },
  {
    id: "2",
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    date: "2026-01-18",
    time: "17:30",
    venue: "Emirates Stadium",
    ticketPrice: 95,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    availableSeats: 89,
    totalSeats: 180,
  },
  {
    id: "3",
    homeTeam: "Manchester City",
    awayTeam: "Tottenham Hotspur",
    date: "2026-01-20",
    time: "20:00",
    venue: "Etihad Stadium",
    ticketPrice: 110,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    availableSeats: 203,
    totalSeats: 250,
  },
  {
    id: "4",
    homeTeam: "Newcastle United",
    awayTeam: "Aston Villa",
    date: "2026-01-22",
    time: "14:00",
    venue: "St. James' Park",
    ticketPrice: 65,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
    availableSeats: 178,
    totalSeats: 200,
  },
  {
    id: "5",
    homeTeam: "West Ham United",
    awayTeam: "Brighton & Hove",
    date: "2026-01-25",
    time: "19:45",
    venue: "London Stadium",
    ticketPrice: 55,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
    availableSeats: 220,
    totalSeats: 280,
  },
  {
    id: "6",
    homeTeam: "Liverpool FC",
    awayTeam: "Manchester City",
    date: "2026-01-28",
    time: "16:30",
    venue: "Anfield",
    ticketPrice: 125,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800",
    availableSeats: 45,
    totalSeats: 180,
  },
];

// Generate seat layout
export const generateSeats = (totalSeats: number, unavailableCount: number) => {
  const seats: { id: string; row: string; number: number; available: boolean }[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = Math.ceil(totalSeats / rows.length);
  
  let seatCount = 0;
  const unavailableIndices = new Set<number>();
  
  while (unavailableIndices.size < unavailableCount) {
    unavailableIndices.add(Math.floor(Math.random() * totalSeats));
  }
  
  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow && seatCount < totalSeats; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        available: !unavailableIndices.has(seatCount),
      });
      seatCount++;
    }
  }
  
  return seats;
};

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: "b1",
    gameId: "1",
    game: games[0],
    seats: ["A1", "A2"],
    totalPrice: 170,
    transactionId: "TXN123456789",
    status: "approved",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    createdAt: "2026-01-10T10:30:00Z",
  },
  {
    id: "b2",
    gameId: "3",
    game: games[2],
    seats: ["C5", "C6", "C7"],
    totalPrice: 330,
    transactionId: "TXN987654321",
    status: "pending",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    createdAt: "2026-01-12T14:20:00Z",
  },
  {
    id: "b3",
    gameId: "2",
    game: games[1],
    seats: ["B3"],
    totalPrice: 95,
    transactionId: "TXN555555555",
    status: "rejected",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    createdAt: "2026-01-11T09:15:00Z",
  },
];
