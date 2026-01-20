import React, { useState, useEffect } from 'react';
import { getDocuments } from '../lib/firestore';

const SignalsFeed = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        // Placeholder - replace with actual Firestore query
        const mockSignals = [
          { id: 1, type: 'contribution', description: 'Shared a helpful resource', timestamp: new Date() },
          { id: 2, type: 'interaction', description: 'Engaged in meaningful discussion', timestamp: new Date() },
          { id: 3, type: 'achievement', description: 'Reached milestone', timestamp: new Date() }
        ];
        setSignals(mockSignals);
      } catch (error) {
        console.error('Error fetching signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  if (loading) return <div>Loading signals...</div>;

  return (
    <div className="signals-feed">
      {signals.length === 0 ? (
        <p>No signals yet. Start contributing to earn signals!</p>
      ) : (
        <ul className="signals-list">
          {signals.map(signal => (
            <li key={signal.id} className="signal-item">
              <div className="signal-type">{signal.type}</div>
              <div className="signal-description">{signal.description}</div>
              <div className="signal-timestamp">
                {new Date(signal.timestamp).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SignalsFeed;
