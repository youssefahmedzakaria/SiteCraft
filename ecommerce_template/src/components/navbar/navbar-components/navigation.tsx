import React from 'react';
import Link from 'next/link';

export interface NavigationProps {
  menuItems: Array<{ label: string; href: string }>;
  textColor?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  menuItems, 
  textColor, 
  orientation = 'horizontal',
  className = '',
  onClick
}) => {
  return (
    <div className={`
      ${orientation === 'horizontal' ? 'flex space-x-6' : 'flex flex-col space-y-4'}
      ${className}
    `}>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`text-sm hover:underline transition-all ${textColor}`}
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};