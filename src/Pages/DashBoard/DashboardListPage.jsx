import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, utils } from './services/index.js';
import { Bot, MoreHorizontal } from 'lucide-react';
import styles from './Dashboards.module.css';

// 편집 다이얼로그 컴포넌트
function EditDashboardDialog({ 
  open, 
  onClose, 
  dashboard, 
  onSave 
}) {
  const [name, setName] = useState(dashboard?.name || '');
  const [description, setDescription] = useState(dashboard?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dashboard) {
      setName(dashboard.name || '');
      setDescription(dashboard.description || '');
    }
  }, [dashboard]);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Dashboard name is required');
      return;
    }
    
    setLoading(true);
    try {
      const result = dashboard?.id 
        ? await onSave('update', dashboard.id, name, description)
        : await onSave('create', null, name, description);
        
      if (result.success) {
        onClose();
      } else {
        alert(result.error || 'Failed to save dashboard');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90vw',
        color: '#f8fafc'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#f1f5f9' }}>
          {dashboard?.id ? 'Edit Dashboard' : 'Create Dashboard'}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Dashboard Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New Dashboard"
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #1e293b',
              borderRadius: '4px',
              backgroundColor: '#020817',
              color: '#f8fafc'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the purpose of this dashboard. Optional, but very helpful."
            rows={4}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #1e293b',
              borderRadius: '4px',
              backgroundColor: '#020817',
              color: '#f8fafc',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              border: '1px solid #1e293b',
              backgroundColor: '#334155',
              color: '#f8fafc',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: loading ? '#64748b' : '#f8fafc',
              color: loading ? '#f8fafc' : '#020817',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : (dashboard?.id ? 'Save Changes' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}

// 액션 드롭다운 컴포넌트
function ActionsDropdown({ dashboard, onEdit, onClone, onDelete, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    setIsOpen(false);
    if (disabled) return;
    
    switch (action) {
      case 'edit':
        onEdit(dashboard);
        break;
      case 'clone':
        onClone(dashboard);
        break;
      case 'delete':
        onDelete(dashboard);
        break;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={styles.iconButton}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <MoreHorizontal size={16} />
      </button>
      
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 100,
          minWidth: '120px'
        }}>
          {utils.isDashboardEditable(dashboard) && (
            <button
              onClick={() => handleAction('edit')}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              ✏️ Edit
            </button>
          )}
          <button
            onClick={() => handleAction('clone')}
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#cbd5e1',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            📋 Clone
          </button>
          {utils.isDashboardEditable(dashboard) && (
            <button
              onClick={() => handleAction('delete')}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#ef4444'
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// 메인 DashboardTable 컴포넌트 (헤더 제거된 버전)
function DashboardListPage() {
  const [dashboards, setDashboards] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초기 데이터 로딩
  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('대시보드 목록 로딩 시작...');
      const result = await dashboardAPI.getAllDashboards();
      
      if (result.success && Array.isArray(result.data)) {
        console.log('대시보드 데이터 수신:', result.data.length, '개');
        setDashboards(result.data);
      } else {
        console.warn('데이터 형식 오류:', result);
        setDashboards([]);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('대시보드 로딩 실패:', err);
      setError(`Failed to load dashboards: ${err.message}`);
      setDashboards([]);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 함수
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 정렬된 데이터
  const sortedDashboards = [...dashboards].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  // 액션 핸들러들
  const handleEdit = (dashboard) => {
    setEditingDashboard(dashboard);
  };

  const handleSave = async (action, dashboardId, name, description) => {
    try {
      let result;
      
      if (action === 'create') {
        console.log('새 대시보드 생성:', { name, description });
        result = await dashboardAPI.createDashboard(name, description);
        
        if (result) {
          console.log('대시보드 생성 성공:', result);
          await loadDashboards();
          return { success: true };
        }
      } else if (action === 'update') {
        console.log('대시보드 수정:', { dashboardId, name, description });
        result = await dashboardAPI.updateDashboard(dashboardId, name, description);
        
        if (result) {
          console.log('대시보드 수정 성공:', result);
          await loadDashboards();
          return { success: true };
        }
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('대시보드 저장 실패:', error);
      return { success: false, error: error.message };
    }
  };

  const handleClone = async (dashboard) => {
    try {
      console.log('대시보드 복제:', dashboard.id);
      const result = await dashboardAPI.cloneDashboard(dashboard.id);
      
      if (result) {
        console.log('대시보드 복제 성공:', result);
        alert('Dashboard cloned successfully!');
        await loadDashboards();
      }
    } catch (error) {
      console.error('대시보드 복제 실패:', error);
      alert(`Failed to clone dashboard: ${error.message}`);
    }
  };

  const handleDelete = async (dashboard) => {
    if (!confirm(`Are you sure you want to delete "${dashboard.name}"?`)) {
      return;
    }
    
    try {
      console.log('대시보드 삭제:', dashboard.id);
      const result = await dashboardAPI.deleteDashboard(dashboard.id);
      
      if (result) {
        console.log('대시보드 삭제 성공');
        alert('Dashboard deleted successfully!');
        await loadDashboards();
      }
    } catch (error) {
      console.error('대시보드 삭제 실패:', error);
      alert(`Failed to delete dashboard: ${error.message}`);
    }
  };

  const handleCreateNew = () => {
    setEditingDashboard({});
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#cbd5e1' }}>
        <div>Loading dashboards...</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>
          Connecting to Langfuse API...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#cbd5e1' }}>
        <div style={{ color: '#ef4444', marginBottom: '20px' }}>
          ❌ {error}
        </div>
        <button
          onClick={loadDashboards}
          className={styles.primaryButton}
        >
          재시도
        </button>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '20px' }}>
          💡 Langfuse 서버 (localhost:3000)가 실행 중인지 확인하세요
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 테이블 */}
      {dashboards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          📋 아직 생성된 대시보드가 없습니다.
          <br />
          <br />
          <button
            onClick={handleCreateNew}
            className={styles.primaryButton}
          >
            첫 번째 대시보드 생성하기
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Description</th>
                <th>Owner</th>
                <th 
                  onClick={() => handleSort('createdAt')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Created At {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('updatedAt')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Updated At {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedDashboards.map(dashboard => (
                <tr key={dashboard.id}>
                  <td>
                    <Link 
                      to={`/dashboards/${dashboard.id}`}
                      className={styles.dashboardLink}
                    >
                      {dashboard.name}
                    </Link>
                  </td>
                  <td>{dashboard.description || <em style={{ color: '#64748b' }}>No description</em>}</td>
                  <td>
                    <div className={styles.ownerCell}>
                      <Bot size={16} />
                      <span>{dashboard.owner === 'LANGFUSE' ? 'Langfuse' : 'Project'}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>
                    {utils.formatDate(dashboard.createdAt)}
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>
                    {utils.formatDate(dashboard.updatedAt)}
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <ActionsDropdown
                        dashboard={dashboard}
                        onEdit={handleEdit}
                        onClone={handleClone}
                        onDelete={handleDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 편집 다이얼로그 */}
      <EditDashboardDialog
        open={!!editingDashboard}
        onClose={() => setEditingDashboard(null)}
        dashboard={editingDashboard}
        onSave={handleSave}
      />
    </div>
  );
}

export default DashboardListPage;