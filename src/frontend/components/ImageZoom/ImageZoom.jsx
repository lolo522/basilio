import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImageZoom.module.css';
import { AiOutlineClose, AiOutlineZoomIn } from 'react-icons/ai';

const ImageZoom = ({ src, alt, className = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);

  const handleImageClick = () => {
    setIsLoading(true);
    setIsZoomed(true);
  };

  const handleClose = () => {
    setIsZoomed(false);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (isZoomed) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  const ZoomModal = () => (
    <div className={styles.zoomOverlay} onClick={handleClose}>
      <div className={styles.zoomContainer}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Cerrar zoom"
        >
          <AiOutlineClose />
        </button>
        
        {isLoading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          className={`${styles.zoomedImage} ${isLoading ? styles.loading : ''}`}
          onClick={(e) => e.stopPropagation()}
          onLoad={handleImageLoad}
        />
        
        <div className={styles.zoomHint}>
          <p>Presiona ESC o haz clic fuera de la imagen para cerrar</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`${styles.imageContainer} ${className}`}>
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={styles.productImage}
          onClick={handleImageClick}
        />
        <div className={styles.zoomIcon}>
          <AiOutlineZoomIn />
        </div>
        <div className={styles.zoomHintOverlay}>
          <span>Haz clic para ampliar</span>
        </div>
      </div>
      
      {isZoomed && createPortal(
        <ZoomModal />,
        document.getElementById('modal-root')
      )}
    </>
  );
};

export default ImageZoom;