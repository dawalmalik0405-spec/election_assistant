import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2 } from 'lucide-react';

const CivicPoll = () => {
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = [
    { id: 1, text: 'Digital Voting Security', votes: 45 },
    { id: 2, text: 'Youth Engagement', votes: 32 },
    { id: 3, text: 'Climate Policy', votes: 23 }
  ];

  const handleVote = (id) => {
    setSelected(id);
    setVoted(true);
    // In a real app, we would use Firestore here:
    // addDoc(collection(db, 'votes'), { optionId: id, timestamp: new Date() });
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <BarChart3 className="text-primary" size={24} />
        <h3 style={{ margin: 0 }}>Community Priority Poll</h3>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Which civic issue should be the focus of the next Command Center update?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => !voted && handleVote(opt.id)}
            disabled={voted}
            style={{
              width: '100%',
              padding: '1rem',
              background: selected === opt.id ? 'rgba(59, 130, 246, 0.1)' : 'var(--glass-highlight)',
              border: `1px solid ${selected === opt.id ? 'var(--primary)' : 'var(--glass-border)'}`,
              borderRadius: '12px',
              color: 'var(--text-primary)',
              cursor: voted ? 'default' : 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontWeight: voted && selected === opt.id ? '700' : '400' }}>{opt.text}</span>
            {voted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{opt.votes}%</span>
                {selected === opt.id && <CheckCircle2 size={18} className="text-primary" />}
              </div>
            )}
          </button>
        ))}
      </div>

      {voted && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600', textAlign: 'center' }}
        >
          Your voice has been recorded in the Firestore live feed!
        </motion.p>
      )}
    </div>
  );
};

export default CivicPoll;
