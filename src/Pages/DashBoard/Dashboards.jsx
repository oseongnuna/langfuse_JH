// src/Pages/DashBoard/Dashboards.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Dashboards.module.css';
import { Info, Plus, MoreHorizontal, Bot } from 'lucide-react';
// SearchInput 제거 - 대시보드에는 검색 기능 없음

// Dashboard API Service (tRPC 래핑 방식)
const API_CONFIG = {
  BASE_URL: '', // 프록시 사용
  PROJECT_ID: import.meta.env.VITE_LANGFUSE_PROJECT_ID || 'cmekn4eda0006r407r92i5nam',
};

class DashboardAPI {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.projectId = API_CONFIG.PROJECT_ID;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async callTRPCAsREST(endpoint, method = 'GET', data = null) {
    try {
      if (method === 'GET') {
        const params = new URLSearchParams({
          batch: '1',
          input: JSON.stringify({
            0: { json: data }
          })
        });
        
        const response = await fetch(
          `${this.baseURL}/api/trpc/${endpoint}?${params}`,
          {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        return result[0]?.result?.data?.json || null;
        
      } else {
        const response = await fetch(
          `${this.baseURL}/api/trpc/${endpoint}`,
          {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ json: data }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
        return result?.result?.data?.json || null;
      }
    } catch (error) {
      console.error(`TRPC API 호출 오류 (${endpoint}):`, error);
      throw error;
    }
  }

  async getAllDashboards(page = 0, limit = 50) {
    try {
      const data = await this.callTRPCAsREST('dashboard.allDashboards', 'GET', {
        projectId: this.projectId,
        page,
        limit,
        orderBy: { column: 'updatedAt', order: 'DESC' }
      });

      return {
        success: true,
        data: data?.dashboards || [],
        totalCount: data?.totalCount || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  async createDashboard(name, description) {
    try {
      const data = await this.callTRPCAsREST('dashboard.createDashboard', 'POST', {
        projectId: this.projectId,
        name: name.trim(),
        description: description?.trim() || ''
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateDashboard(dashboardId, name, description) {
    try {
      const data = await this.callTRPCAsREST('dashboard.updateDashboardMetadata', 'POST', {
        projectId: this.projectId,
        dashboardId,
        name: name.trim(),
        description: description?.trim() || ''
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteDashboard(dashboardId) {
    try {
      await this.callTRPCAsREST('dashboard.delete', 'POST', {
        projectId: this.projectId,
        dashboardId
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async cloneDashboard(dashboardId) {
    try {
      const data = await this.callTRPCAsREST('dashboard.cloneDashboard', 'POST', {
        projectId: this.projectId,
        dashboardId
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// 유틸리티 함수들
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

const isDashboardEditable = (dashboard) => {
  return dashboard?.owner !== 'LANGFUSE';
};

// 편집 다이얼로그 컴포넌트
function EditDashboardDialog({ open, onClose, dashboard, onSave }) {
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
          {isDashboardEditable(dashboard) && (
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
          {isDashboardEditable(dashboard) && (
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

// 메인 Dashboards 컴포넌트
const Dashboards = () => {
  const [activeTab, setActiveTab] = useState('Dashboards');
  const [dashboards, setDashboards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDashboard, setEditingDashboard] = useState(null);
  const navigate = useNavigate();
  
  // 검색 관련 state 제거 - 대시보드에는 검색 기능 없음
  
  // API 인스턴스
  const [dashboardAPI] = useState(() => new DashboardAPI());

  useEffect(() => {
    if (activeTab === 'Dashboards') {
      loadDashboards();
    }
  }, [activeTab]);

  const loadDashboards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dashboardAPI.getAllDashboards();
      
      if (result.success) {
        setDashboards(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Failed to fetch dashboards:", err);
      setError("Failed to load dashboards. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (action, dashboardId, name, description) => {
    try {
      let result;
      
      if (action === 'create') {
        result = await dashboardAPI.createDashboard(name, description);
      } else if (action === 'update') {
        result = await dashboardAPI.updateDashboard(dashboardId, name, description);
      }
      
      if (result && result.success) {
        await loadDashboards();
        return { success: true };
      }
      
      return { success: false, error: result?.error || 'Unknown error occurred' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleClone = async (dashboard) => {
    try {
      const result = await dashboardAPI.cloneDashboard(dashboard.id);
      
      if (result.success) {
        alert('Dashboard cloned successfully!');
        await loadDashboards();
      } else {
        alert(`Failed to clone dashboard: ${result.error}`);
      }
    } catch (error) {
      alert(`Failed to clone dashboard: ${error.message}`);
    }
  };

  const handleDelete = async (dashboard) => {
    if (!confirm(`Are you sure you want to delete "${dashboard.name}"?`)) {
      return;
    }
    
    try {
      const result = await dashboardAPI.deleteDashboard(dashboard.id);
      
      if (result.success) {
        alert('Dashboard deleted successfully!');
        await loadDashboards();
      } else {
        alert(`Failed to delete dashboard: ${result.error}`);
      }
    } catch (error) {
      alert(`Failed to delete dashboard: ${error.message}`);
    }
  };

  const handleEdit = (dashboard) => {
    setEditingDashboard(dashboard);
  };

  const handleCreateNew = () => {
    if (activeTab === 'Dashboards') {
      setEditingDashboard({});
    } else {
      navigate('/dashboards/widgets/new');
    }
  };

  // 위젯 뷰 임시 컴포넌트
  const WidgetsView = () => (
    <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
      위젯 페이지는 팀원이 개발 중입니다...
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{activeTab}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={handleCreateNew}>
            <Plus size={16} /> New {activeTab.slice(0, -1).toLowerCase()}
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'Dashboards' ? styles.active : ''}`}
          onClick={() => setActiveTab('Dashboards')}
        >
          Dashboards
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'Widgets' ? styles.active : ''}`}
          onClick={() => setActiveTab('Widgets')}
        >
          Widgets
        </button>
      </div>

      {activeTab === 'Dashboards' ? (
        <>
          {/* 검색 바 제거 - 대시보드에는 검색 기능 없음 */}

          {/* 테이블 */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>Loading dashboards...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#ef4444' }}>{error}</td></tr>
                ) : dashboards.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center' }}>No dashboards found</td></tr>
                ) : (
                  dashboards.map((dashboard) => (
                    <tr key={dashboard.id}>
                      <td>
                        <Link to={`/dashboards/${dashboard.id}`} className={styles.dashboardLink}>
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
                        {formatDate(dashboard.createdAt)}
                      </td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>
                        {formatDate(dashboard.updatedAt)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <WidgetsView />
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
};

export default Dashboards;