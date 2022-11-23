import clsx from 'clsx';
import './Button.css';

interface ButtonProps {
  children?: React.ReactNode,
  onClick?: (...args: any) => any,
  /**
   * Allow text within the button to be highlighted
   */
  allowHighlight?: boolean,
  style?: React.CSSProperties | undefined;
}

export const Button = ({children, onClick, allowHighlight = false, style}: ButtonProps) => {


  return (
    <div style={style} className={clsx('ui-button', {'noselect': !allowHighlight})} onClick={onClick}>
      <p>{children}</p>
    </div>
  );
}