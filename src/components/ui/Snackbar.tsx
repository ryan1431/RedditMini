import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks/hooks';
import { selectTheme } from '../../app/reducers/savedSlice';
import { getRGBA } from '../../utility/getRGBA';
import './Snackbar.css';

interface SnackbarProps {
  text: string,
  onClose?: (...args: any) => any,
  actionText?: string,
  /**
   * Callback when clicking on the action
   */
  onAction?: (...args: any) => any,
  /**
   * If specified, will smoothly close snackbar first before calling onAction()
   */
  actionCloses?: boolean,
  closeDelay?: number,
}

export const Snackbar = ({text, actionText, onClose, onAction, actionCloses = false, closeDelay}: SnackbarProps) => {

  const [hidden, setHidden] = useState<boolean>(true);
  const closeTimeout = useRef<NodeJS.Timeout>();

  const theme = useAppSelector(selectTheme);
  const background = getRGBA(theme.back_alt);
  const borderColor = getRGBA(theme.border);
  
  const t = hidden ? '0' : '';

  const onClick = useCallback(() => {
    if (actionCloses && onAction) {
      setHidden(true);
      setTimeout(() => {
        onAction();
        onClose && onClose();
      }, 200)
    } else {
      onAction && onAction();
    }
  }, [actionCloses, onAction, onClose]);

  useEffect(() => {
    setHidden(false);
    
    clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setHidden(true);
      onClose && onClose();
    }, closeDelay || 4000);
  }, [closeDelay, onClose]);

  const onMouseEnter = useCallback(() => {
    clearTimeout(closeTimeout.current);
  }, [])

  const onMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setHidden(true);
      onClose && onClose();
    }, closeDelay || 4000)
  }, [closeDelay, onClose])
  
  return (
    <div className='ui-snackbar' 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave} 
      style={{
        width: t, 
        height: t, 
        marginTop: t,
        opacity: t,
        background,
        borderColor
      }}
    >
      <p>{text}</p>
      {actionText && <p className='ui-snackbar-action noselect' onClick={onClick}>{actionText}</p>}
    </div>
  )
}