import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  id?: string;
}

interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={twMerge("p-6", className)}>
      {children}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={twMerge("p-6", className)}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={twMerge("p-6 border-t border-grey-200 dark:border-grey-700", className)}>
      {children}
    </div>
  );
};

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
}

const Card = ({
  children,
  className,
  title,
  subtitle,
  headerActions,
  footer,
  noPadding = false,
  variant = 'default',
  isLoading = false,
  ...props
}: CardProps) => {
  const cardVariants = {
    default: 'bg-white dark:bg-grey-800 shadow-sm',
    outline: 'bg-white dark:bg-grey-800/50 border border-grey-200 dark:border-grey-700',
    ghost: 'bg-white/50 dark:bg-grey-800/30 backdrop-blur-sm',
  };

  const cardClasses = twMerge(
    'rounded-xl',
    cardVariants[variant],
    className
  );

  const contentClasses = noPadding ? '' : 'p-6';

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || headerActions) && (
        <div className={`${noPadding ? '' : 'p-6 pb-0'} ${title && subtitle ? 'mb-4' : title ? 'mb-2' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              {title && typeof title === 'string' ? (
                <h3 className="text-lg font-semibold text-grey-900 dark:text-white">{title}</h3>
              ) : title}
              
              {subtitle && typeof subtitle === 'string' ? (
                <p className="text-sm text-grey-500 dark:text-grey-400 mt-1">{subtitle}</p>
              ) : subtitle}
            </div>
            
            {headerActions && (
              <div className="flex items-center space-x-3 space-x-reverse">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {!noPadding && (
        <div className={contentClasses}>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            children
          )}
        </div>
      )}
      
      {noPadding && children}
      
      {footer && (
        <div className={`${noPadding ? '' : 'px-6 py-4'} border-t border-grey-200 dark:border-grey-700`}>
          {footer}
        </div>
      )}
    </div>
  );
};

(Card as CardComponent).Header = CardHeader;
(Card as CardComponent).Body = CardBody;
(Card as CardComponent).Footer = CardFooter;

export { Card }; 