import { Card } from '../components/Card';
import { useLocalStorage, INITIAL_PROGRESS } from '../hooks/useLocalStorage';
import type { UserProgress } from '../hooks/useLocalStorage';
import { Activity, TrendingUp, Calendar, Zap } from 'lucide-react';

const StatBox = ({ title, value, icon: Icon, unit = '' }: any) => (
  <Card className="flex items-center gap-4 p-6">
    <div className="p-4 bg-surface-color rounded-lg border border-border-color">
      <Icon className="text-accent" size={32} />
    </div>
    <div>
      <div className="text-sm text-secondary">{title}</div>
      <div className="text-3xl font-bold">
        {value} <span className="text-sm font-normal text-secondary">{unit}</span>
      </div>
    </div>
  </Card>
);

export function Progress() {
  const [progress] = useLocalStorage<UserProgress>('typesprint-progress', INITIAL_PROGRESS);
  const history = progress.history ?? [];
  const testsCompleted = progress.testsCompleted ?? 0;
  const bestWpm = progress.bestWpm ?? 0;
  const averageAccuracy = progress.averageAccuracy ?? 0;
  const streak = progress.streak ?? 0;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-accent" size={32} />
        <h1 className="text-3xl font-bold">Your Progress</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatBox title="Tests Completed" value={testsCompleted} icon={Activity} />
        <StatBox title="Best Speed" value={bestWpm} unit="WPM" icon={Zap} />
        <StatBox title="Avg Accuracy" value={averageAccuracy} unit="%" icon={TrendingUp} />
        <StatBox title="Current Streak" value={streak} unit="days" icon={Calendar} />
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-bold mb-6">Recent History</h3>
        {history.length === 0 ? (
          <p className="text-secondary text-center py-8">No tests completed yet.</p>
        ) : (
          <div className="space-y-4">
            {history.slice(-5).reverse().map((test, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-surface-color rounded-lg border border-border-color">
                <div className="text-secondary">
                  {new Date(test.date).toLocaleDateString()} at {new Date(test.date).toLocaleTimeString()}
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <span className="text-sm text-secondary block">WPM</span>
                    <span className="font-bold text-accent">{test.wpm}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-secondary block">Acc</span>
                    <span className="font-bold text-accent">{test.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
