import type React from 'react';

interface GradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className = '' }: GradientBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Main gradient background */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_20%,#e0f7fa_45%,#67e8f9_75%,#22d3ee_100%)]
          dark:bg-[linear-gradient(180deg,#020617_0%,#07111f_20%,#0f172a_40%,#083344_70%,#155e75_100%)]
        "
      />

      {/* Noise texture */}
      <div
        className="
          absolute inset-0 bg-repeat
          opacity-[0.03]
          dark:opacity-[0.05]
        "
        style={{
          backgroundImage:
            'url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png")',
          backgroundSize: '149.76px',
        }}
      />

      {/* Geometric grid overlay */}
      <div
        className="
          absolute inset-0
          opacity-20
          dark:opacity-20
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Dark mode grid */}
      <div
        className="
          absolute inset-0 hidden
          dark:block
          opacity-20
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diagonal texture */}
      <div
        className="
          absolute inset-0
          opacity-5
          dark:opacity-10
        "
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Dark mode diagonal texture */}
      <div
        className="
          absolute inset-0 hidden
          dark:block
          opacity-10
        "
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
