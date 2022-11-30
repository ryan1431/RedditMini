import clsx from 'clsx';
import { useAppSelector } from '../../app/hooks/hooks';
import { selectTheme } from '../../app/reducers/savedSlice';
import { getRGBA } from '../../utility/getRGBA';
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

  const theme = useAppSelector(selectTheme);
  const borderColor = getRGBA(theme.border);
  const background = getRGBA(theme.front_alt, 0.1);

  return (
    <div style={{...style, borderColor, background}} className={clsx('ui-button', {'noselect': !allowHighlight})} onClick={onClick}>
      <p>{children}</p>
    </div>
  );
}