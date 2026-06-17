import React from 'react';
import logoIcon from '../img/logo-icon.webp';

interface LogoProps {
  className?: string;
}

/**
 * Logotipo da JMS Jetski: ícone oficial (piloto de jetski, extraído do site)
 * + wordmark "JMS Jetski". O `className` controla o tamanho do texto.
 */
const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img src={logoIcon} alt="" aria-hidden="true" width={49} height={36}
        className="h-8 sm:h-9 w-auto" />
      <span className={`font-display font-black tracking-wide uppercase ${className}`}>
        JMS <span className="font-semibold text-muted">Jetski</span>
      </span>
    </span>
  );
};

export default Logo;
