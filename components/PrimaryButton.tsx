    'use client';

    import { FC, ButtonHTMLAttributes } from 'react';

    interface Props extends ButtonEvent extends ButtonHTMLAttributes<HTMLButtonElement> {
      variant?: 'solid' | 'outline' | 'disabled';
    }

    const PrimaryButton: FC<Props> = ({ children, variant = 'solid', disabled, ...props }) => {
      const base = 'px-[--space-md] py-[--space-sm] rounded-[--radius-md] transition duration-fast ease-custom';
      const styles = {
        solid: `${base} bg-primary text-bg hover:bg-opacity-90`,
        outline: `${base} border border-primary text-primary hover:bg-primary hover:text-bg`,
        disabled: `${base} bg-muted text-bg cursor-not-allowed`,
      };

      return (
        <button {...props} className={styles[disabled ? 'disabled' : variant]} disabled={disabled}>
          {children}
        </button>
      );
    };

    export default PrimaryButton;
  