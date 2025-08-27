// src/pages/Dashboards/AddWidgetModal.jsx

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import styles from './AddWidgetModal.module.css';

const AddWidgetModal = ({ onClose, onAddWidget }) => {
  const navigate = useNavigate();
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);

  // ESC 키 핸들링
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // 모달이 열릴 때 포커스 관리
  useEffect(() => {
    const modalContent = document.querySelector(`.${styles.modalContent}`);
    if (modalContent) {
      modalContent.focus();
    }
  }, []);

  const handleCreateNew = () => {
    navigate('/dashboards/widgets/new');
    onClose();
  };

  const handleAddSelected = () => {
    if (selectedWidgetId) {
      onAddWidget(selectedWidgetId);
      onClose();
    }
  };

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            Select widget to add
          </h2>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.emptyState}>
            <p>No widgets found. Create a new widget to get started.</p>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={handleCreateNew}>
            <Plus size={16} /> Create New Widget
          </button>
          <div className={styles.footerActions}>
            <button className={styles.secondaryButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.primaryButton}
              onClick={handleAddSelected}
              disabled={true}
            >
              Add Selected Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Portal을 사용하여 body에 모달 렌더링
  return createPortal(modalContent, document.body);
};

export default AddWidgetModal;