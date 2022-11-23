import clsx from 'clsx';
import './Button.css';

interface ButtonProps {
  children?: React.ReactNode,
  onClick?: (...args: any) => any,
  /**
   * Allow text within the button to be highlighted
   */
  allowHighlight?: boolean,
}

export const Button = ({children, onClick, allowHighlight = false}: ButtonProps) => {


  return (
    <div className={clsx('ui-button', {'noselect': !allowHighlight})} onClick={onClick}>
      <p>{children}</p>
    </div>
  );
}