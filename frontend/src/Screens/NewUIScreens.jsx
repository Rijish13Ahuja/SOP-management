import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const SOPsManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'Policy',
    department: '',
    lastReview: '',
    nextReview: '',
    status: 'Active'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const API_BASE = 'http://localhost:3000';

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    },
    header: {
      backgroundColor: '#1a1a1a',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      borderBottom: '1px solid #333',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#ffffff'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'conic-gradient(from 0deg, #ff6b35, #f7931e, #ffcd3c, #ff6b35)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    backLink: {
      color: '#888888',
      textDecoration: 'none',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'color 0.2s ease',
      cursor: 'pointer'
    },
    pageTitle: {
      color: '#ff6b35',
      fontSize: '18px',
      fontWeight: '600'
    },
    mainContent: {
      flex: 1,
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100%',  
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '24px',
      marginBottom: '40px',
      width: '100%',
    },
    statCard: {
      backgroundColor: '#1e1e1e',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      padding: '32px 24px',
      transition: 'all 0.3s ease'
    },
    statTitle: {
      color: '#ff6b35',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '16px',
      textTransform: 'none',
      letterSpacing: 'normal'
    },
    statNumber: {
  fontSize: '48px',
  fontWeight: '700',
  color: '#ffffff',
  lineHeight: '1',
  marginBottom: '8px'
},
statNumberOverdue: {
  fontSize: '48px',  
  fontWeight: '700',
  color: '#ef4444',  
  lineHeight: '1',
  marginBottom: '8px'
},
    statSubtitle: {
      color: '#888888',
      fontSize: '14px',
      marginTop: '0'
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '32px',
      backgroundColor: 'transparent',
      borderRadius: '0',
      padding: '0',
      width: '100%',
      overflowX: 'auto',  
    },
    tab: {
      backgroundColor: 'transparent',
      border: '2px solid #333333',
      color: '#888888',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    },
    tabActive: {
      backgroundColor: 'transparent',
      color: '#ff6b35',
      border: '2px solid #ff6b35',
      boxShadow: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap'
    },
    controls: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      gap: '24px',
      width: '100%',
    },
    searchContainer: {
      width: '100%',  
      maxWidth: '400px',
      position: 'relative'
    },
    searchBox: {
      width: '100%',
      backgroundColor: '#1e1e1e',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '14px 16px 14px 48px',
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#666666',
      fontSize: '16px'
    },
    controlsRight: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'nowrap',
      flexShrink: 0,
    },
    filterDropdown: {
      backgroundColor: '#1e1e1e',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '14px 40px 14px 16px',
      color: '#ffffff',
      fontSize: '14px',
      cursor: 'pointer',
      minWidth: '160px',
      fontFamily: 'inherit',
      appearance: 'none',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
    uploadBtn: {
      background: '#ff6b35',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      boxShadow: 'none',
      whiteSpace: 'nowrap'
    },
    tableContainer: {
      backgroundColor: '#1e1e1e',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      overflow: 'auto',
      width: '100%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '900px',  
    },
    tableHeader: {
      backgroundColor: '#1e1e1e'
    },
    th: {
      textAlign: 'left',
      padding: '20px 24px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#888888',
      borderBottom: '1px solid #2a2a2a',
      textTransform: 'none',
      letterSpacing: 'normal'
    },
    td: {
      padding: '20px 24px',
      fontSize: '14px',
      borderBottom: '1px solid #2a2a2a',
      color: '#ffffff'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#666666',
      fontSize: '16px',
      fontWeight: '400'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      backgroundColor: '#1a1a1a',
      border: '1px solid #333333',
      padding: '40px',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      margin: '20px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    modalTitle: {
      margin: 0,
      color: '#ffffff',
      fontSize: '28px',
      fontWeight: '700'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#888888',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    formGroup: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#ffffff',
      fontSize: '14px',
      textTransform: 'none',
      letterSpacing: 'normal'
    },
    input: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#0f0f0f',
      border: '2px solid #333333',
      borderRadius: '10px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#ff6b35',
      backgroundColor: '#111111'
    },
    select: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#0f0f0f',
      border: '2px solid #333333',
      borderRadius: '10px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
      appearance: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#0f0f0f',
      border: '2px solid #333333',
      borderRadius: '10px',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
      minHeight: '120px',
      resize: 'vertical'
    },
    fileUploadArea: {
      border: '2px dashed #333333',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: '#0f0f0f'
    },
    fileUploadIcon: {
      color: '#888888',
      marginBottom: '16px'
    },
    fileUploadText: {
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '8px'
    },
    fileUploadSubtext: {
      color: '#888888',
      fontSize: '14px'
    },
    modalActions: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'flex-end',
      marginTop: '40px',
      paddingTop: '24px',
      borderTop: '1px solid #333333'
    },
    cancelBtn: {
      padding: '14px 28px',
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: '2px solid #333333',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    submitBtn: {
      padding: '14px 28px',
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
      fontFamily: 'inherit'
    }
  };

  const fetchDocuments = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.department && filters.department !== 'all') queryParams.append('department', filters.department);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);

      const response = await fetch(`${API_BASE}/documents?${queryParams.toString()}`);
      const data = await response.json();
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
      setFilteredDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByTab = (docs, tab) => {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    switch (tab) {
      case 'upcoming':
        return docs.filter(doc => {
          const nextReview = new Date(doc.nextReview);
          return nextReview > now && nextReview <= threeMonthsFromNow;
        });
      case 'overdue':
        return docs.filter(doc => {
          const nextReview = new Date(doc.nextReview);
          return nextReview < now;
        });
      default:
        return docs;
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    const totalPolicies = documents.filter(doc => doc.type === 'Policy').length;
    const totalSOPs = documents.filter(doc => doc.type === 'SOP').length;
    const upcomingReviews = documents.filter(doc => {
      const nextReview = new Date(doc.nextReview);
      return nextReview > now && nextReview <= threeMonthsFromNow;
    }).length;
    const overdueReviews = documents.filter(doc => {
      const nextReview = new Date(doc.nextReview);
      return nextReview < now;
    }).length;

    return { totalPolicies, totalSOPs, upcomingReviews, overdueReviews };
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', uploadData.name);
    formData.append('type', uploadData.type);
    formData.append('department', uploadData.department);
    formData.append('lastReview', uploadData.lastReview);
    formData.append('nextReview', uploadData.nextReview);
    formData.append('status', uploadData.status);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Document uploaded successfully!');
        setShowUploadModal(false);
        setUploadData({
          name: '',
          type: 'Policy',
          department: '',
          lastReview: '',
          nextReview: '',
          status: 'Active'
        });
        setSelectedFile(null);
        fetchDocuments();
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const filtered = filterByTab(documents, tab);
    setFilteredDocuments(filtered);
  };

  useEffect(() => {
    let filtered = [...documents];

    filtered = filterByTab(filtered, activeTab);

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(doc => doc.department === departmentFilter);
    }

    setFilteredDocuments(filtered);
  }, [searchTerm, typeFilter, departmentFilter, documents, activeTab]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uniqueDepartments = [...new Set(documents.map(doc => doc.department))];
  const uniqueTypes = [...new Set(documents.map(doc => doc.type))];

  const stats = calculateStats();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusStyle = (doc) => {
    const now = new Date();
    const nextReview = new Date(doc.nextReview);
    if (nextReview < now) return { ...styles.statusBadge, ...styles.statusOverdue };
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    if (nextReview <= threeMonthsFromNow) return { ...styles.statusBadge, ...styles.statusUpcoming };
    return { ...styles.statusBadge, ...styles.statusActive };
  };

  const getStatusText = (doc) => {
    const now = new Date();
    const nextReview = new Date(doc.nextReview);
    if (nextReview < now) return 'Overdue';
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    if (nextReview <= threeMonthsFromNow) return 'Review Due';
    return 'Active';
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}></div>
          TRIK
        </div>
        <a href="#" style={styles.backLink}>← Back to Dashboard</a>
        <h1 style={styles.pageTitle}>SOPs & Policies Management</h1>
      </header>
      
      <main style={styles.mainContent}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Total Policies</div>
            <div style={styles.statNumber}>{stats.totalPolicies}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Total SOPs</div>
            <div style={styles.statNumber}>{stats.totalSOPs}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Upcoming Reviews</div>
            <div style={styles.statSubtitle}>Next 3 months</div>
            <div style={styles.statNumber}>{stats.upcomingReviews}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statTitle}>Overdue Reviews</div>
            <div style={styles.statNumberOverdue}>{stats.overdueReviews}</div>
          </div>
        </div>

        <div style={styles.tabs}>
          {['all', 'upcoming', 'overdue'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={activeTab === tab ? styles.tabActive : styles.tab}
            >
              {tab === 'all' ? 'All Documents' : tab === 'upcoming' ? 'Upcoming Reviews' : 'Overdue'}
            </button>
          ))}
        </div>

        <div style={styles.controls}>
          <div style={styles.searchContainer}>
          <span style={styles.searchIcon}><FaSearch /></span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search policies and SOPs..."
              style={styles.searchBox}
            />
          </div>
          <div style={styles.controlsRight}>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={styles.filterDropdown}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map((type, index) => (
                <option key={`${type}-${index}`} value={type}>{type}</option>
              ))}

            </select>
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={styles.filterDropdown}
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowUploadModal(true)}
              style={styles.uploadBtn}
            >
              + Upload New
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead style={styles.tableHeader}>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Last Review</th>
                <th style={styles.th}>Next Review</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>Loading...</td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>No documents found</td>
                </tr>
              ) : (
               filteredDocuments.map((doc, index) => (
  <tr key={index}>
    <td style={styles.td}>{Array.isArray(doc.name) ? doc.name[0] : doc.name}</td>
    <td style={styles.td}>{Array.isArray(doc.type) ? doc.type[0] : doc.type}</td>
    <td style={styles.td}>{Array.isArray(doc.department) ? doc.department[0] : doc.department}</td>
    <td style={styles.td}>{formatDate(Array.isArray(doc.lastReview) ? doc.lastReview[0] : doc.lastReview)}</td>
    <td style={styles.td}>{formatDate(Array.isArray(doc.nextReview) ? doc.nextReview[0] : doc.nextReview)}</td>
    <td style={styles.td}>
      <span style={getStatusStyle(doc)}>
        {getStatusText(doc)}
      </span>
    </td>
    <td style={styles.td}>
      <button 
  onClick={() => {
    console.log('Document filename:', doc.filename);
    const fileNameToUse = Array.isArray(doc.filename) ? doc.filename[0] : doc.filename;
    console.log('Using filename:', fileNameToUse);
    const url = `${API_BASE}/files/${encodeURIComponent(fileNameToUse)}`;
    console.log('Opening file URL:', url);
    window.open(url, '_blank');
  }}
  style={styles.actionBtn}
>
  View
</button>

    </td>
  </tr>
))

              )}
            </tbody>
          </table>
        </div>
      </main>

      {showUploadModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Upload New Document</h2>
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>File:</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name:</label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type:</label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                  style={styles.select}
                >
                  <option value="Policy">Policy</option>
                  <option value="SOP">SOP</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Department:</label>
                <input
                  type="text"
                  value={uploadData.department}
                  onChange={(e) => setUploadData({...uploadData, department: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Review Date:</label>
                <input
                  type="date"
                  value={uploadData.lastReview}
                  onChange={(e) => setUploadData({...uploadData, lastReview: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Next Review Date:</label>
                <input
                  type="date"
                  value={uploadData.nextReview}
                  onChange={(e) => setUploadData({...uploadData, nextReview: e.target.value})}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  style={uploading ? styles.submitBtnDisabled : styles.submitBtn}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPsManagement;