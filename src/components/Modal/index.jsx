import React, { useEffect } from 'react';

import Portal from './Portal';
import { Overlay, Dialog } from './styles';

const Modal = ({ children, open, onClose }) => {
  useEffect(() => { 
    /*com essa função pode-se sair da modal
    usando a tecla 'esc'...
    */
    function onEsc(event) {
      if (event.keyCode === 27) onClose();
    }
    window.addEventListener('keydown', onEsc);//coloque o nome da função!!!

    return () => {
      window.addEventListener('keydown', onEsc);//coloque o nome da função!!!
    };
  }, [onClose]);

  if (!open) return null;

  function onOverlayClick() {
    onClose();
  }

  function onDialogClick(event) {
    event.stopPropagation();
  }

  return (
    <Portal>
      <Overlay onClick={onOverlayClick}>
        <Dialog onClick={onDialogClick}>{children}</Dialog>
      </Overlay>
    </Portal>
  );
};

export default Modal;
