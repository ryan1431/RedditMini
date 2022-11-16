import React, { useCallback, useEffect, useRef } from 'react';
import './Modal.css';

interface ModalProps {
  open: boolean,
  onClose?: (...args: any) => any,
  children?: React.ReactNode,
  closeButton?: boolean,
}

const Modal = ({open, onClose, children, closeButton = false}: ModalProps) => {
  const header = React.Children.map(children, (child: any) => child.type.displayName === 'Header' ? child : null);
  const content = React.Children.map(children, (child: any) => child.type.displayName !== 'Header' ? child : null);

  const modalRef = useRef<HTMLDivElement>(undefined!);
  const forceClose = useRef<boolean>(false);
  
  const onClick = useCallback((e: any) => {
    if (modalRef.current.contains(e.target)
    || !!e.target.closest('.post')) return;

    if (onClose) onClose();
    else forceClose.current = true;
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener('click', onClick);
    }, 100);
    return () => window.removeEventListener('click', onClick);
  }, [onClick]);
  
  return (
    <div className='ui-modal' style={{ display: forceClose.current ? 'none' : open ? 'flex' : 'none'}}>
      <div className='ui-modal-content' ref={modalRef}>
        {header && <header>
          {header}
          {closeButton && <button></button>}
        </header>}
        <main style={{maxHeight: 'fit-content'}}>
          {content}
          
        </main>
      </div>
    </div>
  )
}

const Header = ({children}: any) => children;
Header.displayName = 'Header';
Modal.Header = Header;


export default Modal;