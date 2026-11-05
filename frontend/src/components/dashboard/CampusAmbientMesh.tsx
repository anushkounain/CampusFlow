import React from 'react';

interface CampusAmbientMeshProps {
  variant?: 'blue' | 'emerald' | 'amber' | 'purple';
}

export const CampusAmbientMesh: React.FC<CampusAmbientMeshProps> = ({ variant = 'blue' }) => {
  const getGlowColors = () => {
    switch (variant) {
      case 'emerald':
        return {
          orb1: 'bg-emerald-500/10',
          orb2: 'bg-teal-500/10',
          orb3: 'bg-blue-500/10',
        };
      case 'amber':
        return {
          orb1: 'bg-amber-500/10',
          orb2: 'bg-orange-500/10',
          orb3: 'bg-indigo-500/10',
        };
      case 'purple':
        return {
          orb1: 'bg-purple-500/10',
          orb2: 'bg-indigo-500/10',
          orb3: 'bg-blue-500/10',
        };
      case 'blue':
      default:
        return {
          orb1: 'bg-blue-500/15',
          orb2: 'bg-indigo-500/12',
          orb3: 'bg-cyan-400/12',
        };
    }
  };

  const colors = getGlowColors();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top ambient radial gradient orb */}
      <div
        className={`absolute -top-32 right-10 w-96 h-96 rounded-full ${colors.orb1} blur-[100px] animate-pulse-glow`}
      />
      {/* Mid-left secondary ambient orb */}
      <div
        className={`absolute top-96 -left-20 w-80 h-80 rounded-full ${colors.orb2} blur-[90px] animate-float`}
      />
      {/* Bottom ambient light trail */}
      <div
        className={`absolute bottom-10 right-1/4 w-72 h-72 rounded-full ${colors.orb3} blur-[110px] animate-float-delayed`}
      />
    </div>
  );
};
