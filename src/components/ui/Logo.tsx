import type { SVGProps } from 'react'

interface LogoProps extends SVGProps<SVGSVGElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g fill="currentColor" opacity="0.15">
        <circle cx="15" cy="15" r="1.5" /><circle cx="25" cy="15" r="1.5" /><circle cx="35" cy="15" r="1.5" /><circle cx="45" cy="15" r="1.5" /><circle cx="55" cy="15" r="1.5" /><circle cx="65" cy="15" r="1.5" /><circle cx="75" cy="15" r="1.5" /><circle cx="85" cy="15" r="1.5" />
        <circle cx="15" cy="25" r="1.5" /><circle cx="25" cy="25" r="1.5" /><circle cx="35" cy="25" r="1.5" /><circle cx="45" cy="25" r="1.5" /><circle cx="55" cy="25" r="1.5" /><circle cx="65" cy="25" r="1.5" /><circle cx="75" cy="25" r="1.5" /><circle cx="85" cy="25" r="1.5" />
        <circle cx="15" cy="35" r="1.5" /><circle cx="25" cy="35" r="1.5" /><circle cx="35" cy="35" r="1.5" /><circle cx="45" cy="35" r="1.5" /><circle cx="55" cy="35" r="1.5" /><circle cx="65" cy="35" r="1.5" /><circle cx="75" cy="35" r="1.5" /><circle cx="85" cy="35" r="1.5" />
        <circle cx="15" cy="45" r="1.5" /><circle cx="25" cy="45" r="1.5" /><circle cx="35" cy="45" r="1.5" /><circle cx="45" cy="45" r="1.5" /><circle cx="55" cy="45" r="1.5" /><circle cx="65" cy="45" r="1.5" /><circle cx="75" cy="45" r="1.5" /><circle cx="85" cy="45" r="1.5" />
        <circle cx="15" cy="55" r="1.5" /><circle cx="25" cy="55" r="1.5" /><circle cx="35" cy="55" r="1.5" /><circle cx="45" cy="55" r="1.5" /><circle cx="55" cy="55" r="1.5" /><circle cx="65" cy="55" r="1.5" /><circle cx="75" cy="55" r="1.5" /><circle cx="85" cy="55" r="1.5" />
        <circle cx="15" cy="65" r="1.5" /><circle cx="25" cy="65" r="1.5" /><circle cx="35" cy="65" r="1.5" /><circle cx="45" cy="65" r="1.5" /><circle cx="55" cy="65" r="1.5" /><circle cx="65" cy="65" r="1.5" /><circle cx="75" cy="65" r="1.5" /><circle cx="85" cy="65" r="1.5" />
        <circle cx="15" cy="75" r="1.5" /><circle cx="25" cy="75" r="1.5" /><circle cx="35" cy="75" r="1.5" /><circle cx="45" cy="75" r="1.5" /><circle cx="55" cy="75" r="1.5" /><circle cx="65" cy="75" r="1.5" /><circle cx="75" cy="75" r="1.5" /><circle cx="85" cy="75" r="1.5" />
        <circle cx="15" cy="85" r="1.5" /><circle cx="25" cy="85" r="1.5" /><circle cx="35" cy="85" r="1.5" /><circle cx="45" cy="85" r="1.5" /><circle cx="55" cy="85" r="1.5" /><circle cx="65" cy="85" r="1.5" /><circle cx="75" cy="85" r="1.5" /><circle cx="85" cy="85" r="1.5" />
      </g>
      <g transform="translate(50, 50)">
        <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
        <line x1="-26" y1="-15" x2="26" y2="15" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
        <line x1="26" y1="-15" x2="-26" y2="15" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
        <circle cx="0" cy="0" r="6" fill="var(--accent)" />
      </g>
    </svg>
  );
};
