import { useEffect, useState } from 'react';

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Create snowflakes
    const flakes = [];
    const numFlakes = 50;

    for (let i = 0; i < numFlakes; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        size: 4 + Math.random() * 8,
        opacity: 0.4 + Math.random() * 0.6,
      });
    }

    setSnowflakes(flakes);

    // Auto-disable after January 7th
    const now = new Date();
    const endDate = new Date(now.getFullYear(), 0, 7); // January 7th
    if (now.getMonth() === 0 && now.getDate() > 7) {
      setSnowflakes([]);
    }
  }, []);

  if (snowflakes.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        .snowflake {
          position: fixed;
          top: -20px;
          color: #6366f1;
          text-shadow: 0 0 8px rgba(99, 102, 241, 0.6), 0 0 15px rgba(99, 102, 241, 0.4);
          pointer-events: none;
          z-index: 9999;
          animation: snowfall linear infinite;
        }

        .snowflake::before {
          content: '❄';
          display: block;
          animation: sway 3s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
              animationDuration: `${flake.animationDuration}s`,
              animationDelay: `${flake.animationDelay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default Snowfall;
