import React, { useCallback, useEffect, useRef } from 'react';
import './Modal.css';
import { IoMdClose } from 'react-icons/io';
import { useAppSelector } from '../../app/hooks/hooks';
import { selectTheme } from '../../app/reducers/savedSlice';
import { getRGBA } from '../../utility/getRGBA';

interface ModalProps {
  open: boolean,
  onClose?: (...args: any) => any,
  children?: React.ReactNode,
  /**
   * Fit height to content instead of full window
   */
  fitHeight?: boolean,
}

const Modal = ({open, onClose, children, fitHeight = false}: ModalProps) => {
  const header = React.Children.map(children, (child: any) => child?.type?.displayName === 'Header' ? child : null);
  const actions = React.Children.map(children, (child: any) => child?.type?.displayName === 'Actions' ? child : null);
  const content = React.Children.map(children, (child: any) => {
    return !['Header', 'Actions'].includes(child?.type?.displayName) ? child : null
  });

  const modalRef = useRef<HTMLDivElement>(undefined!);
  const forceClose = useRef<boolean>(false);
  
  const theme = useAppSelector(selectTheme);
  const backgroundBase = getRGBA(theme.back);
  const background = getRGBA(theme.front, 0.6);
  const borderColor = getRGBA(theme.border);
  
  const close = useCallback(() => {
    if (onClose) onClose();
    else forceClose.current = true;
  }, [onClose]);

  const onClick = useCallback((e: any) => {
    if (modalRef.current.contains(e.target) 
      || !!e.target.closest('.post')
      || e.target.classList.contains('darkmode')
      || e.target.closest('.settings-button')
      || e.target.closest('.settings')
      || e.target.closest('.other-settings')) return;
    close();
  }, [close]);

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener('click', onClick);
    }, 100);
    return () => window.removeEventListener('click', onClick);
  }, [onClick]);
  
  return (
    <div className='ui-modal' style={{ display: forceClose.current ? 'none' : open ? 'flex' : 'none'}}>
      <div style={{background: backgroundBase, maxWidth: '100%'}}>
        <div className='ui-modal-content' 
          ref={modalRef} 
          style={{
            maxWidth: '100%', 
            overflow: 'auto',
            height: fitHeight ? 'fit-content' : 'calc(100vh - 3.5rem)',
            borderTop: fitHeight ? '' : 'none',
            borderBottom: fitHeight ? '' : 'none',
            borderRadius: fitHeight ? '' : '0px',
            background: background,
            borderColor,
          }}
        >
          <header className='ui-modal-header'>
            <div onClick={close} className='ui-modal-close icon-button'><p>Close</p><IoMdClose /></div>
            <div className='ui-modal-header-content'>
              {header}
            </div>
          </header>
          <main style={{maxHeight: 'fit-content'}}>
            {content}
          </main>
          {actions && <footer className='ui-modal-actions'>
            {actions}  
          </footer>}
        </div>
      </div>
    </div>
  )
}

const Header = ({children, style}:any) => children;
Header.displayName = 'Header';
Modal.Header = Header;

const Actions = ({children}: any) => children;
Actions.displayName = 'Actions';
Modal.Actions = Actions;


export default Modal;