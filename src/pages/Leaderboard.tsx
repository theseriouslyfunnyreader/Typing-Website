import { Card } from '../components/Card';
import { Trophy, Medal, Star } from 'lucide-react';

export function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'Alex T.', wpm: 125, accuracy: 98, time: '1:00' },
    { rank: 2, name: 'Sarah J.', wpm: 118, accuracy: 99, time: '3:00' },
    { rank: 3, name: 'Mike R.', wpm: 112, accuracy: 97, time: '1:00' },
    { rank: 4, name: 'Emma W.', wpm: 105, accuracy: 100, time: '1:00' },
    { rank: 5, name: 'You', wpm: 85, accuracy: 96, time: '1:00', isCurrentUser: true },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="text-accent" size={32} />
        <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-color text-secondary border-b border-border-color">
            <tr>
              <th className="p-4 font-medium">Rank</th>
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium text-right">WPM</th>
              <th className="p-4 font-medium text-right">Accuracy</th>
              <th className="p-4 font-medium text-right">Time Mode</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user) => (
              <tr 
                key={user.rank} 
                className={`border-b border-border-color last:border-0 ${user.isCurrentUser ? 'bg-accent-primary/10' : ''}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {user.rank === 1 && <Trophy size={18} className="text-yellow-500" />}
                    {user.rank === 2 && <Medal size={18} className="text-gray-400" />}
                    {user.rank === 3 && <Medal size={18} className="text-amber-600" />}
                    {user.rank > 3 && <Star size={18} className="text-transparent" />}
                    <span className="font-bold">{user.rank}</span>
                  </div>
                </td>
                <td className="p-4 font-medium">
                  {user.name} {user.isCurrentUser && <span className="text-xs text-accent ml-2">(You)</span>}
                </td>
                <td className="p-4 text-right font-bold text-accent">{user.wpm}</td>
                <td className="p-4 text-right">{user.accuracy}%</td>
                <td className="p-4 text-right text-secondary">{user.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
