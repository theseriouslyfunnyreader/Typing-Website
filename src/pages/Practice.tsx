import { Card } from '../components/Card';
import { Button } from '../components/Button.tsx';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Practice() {
  const practiceModes = [
    { title: 'Common Words', desc: 'Top 200 most frequent English words.' },
    { title: 'Numbers & Symbols', desc: 'Practice row 4 keys and shift characters.' },
    { title: 'Programmer', desc: 'Code snippets in JavaScript and Python.' },
    { title: 'Custom Text', desc: 'Paste your own text to practice.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="text-accent" size={32} />
        <h1 className="text-3xl font-bold">Practice</h1>
      </div>
      
      <p className="text-secondary text-lg mb-8">
        Hone your skills with specialized typing modes.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {practiceModes.map((mode) => (
          <Card key={mode.title} className="flex flex-col justify-between p-6">
            <div>
              <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
              <p className="text-secondary mb-6">{mode.desc}</p>
            </div>
            <Link to={`/test?mode=${mode.title.toLowerCase().replace(/ /g, '-')}`}>
              <Button className="w-full">Start Practice</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
