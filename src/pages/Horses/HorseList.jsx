import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { StatusBadge } from '../../utils/adminHelpers'
import './HorseList.css'

const DEFAULT_HORSES = [
  { id: 1, name: 'Aurelius', age: 5, breed: 'Thoroughbred', owner: 'Stable Alpha', status: 'active', wins: 12, races: 18, points: 2450 },
  { id: 2, name: 'Midnight Star', age: 4, breed: 'Arabian', owner: 'Blue Ridge Farm', status: 'active', wins: 9, races: 16, points: 2280 },
  { id: 3, name: 'Velvet Thunder', age: 6, breed: 'Quarter Horse', owner: 'Golden Hooves', status: 'active', wins: 15, races: 22, points: 2150 },
  { id: 4, name: 'Storm Rider', age: 5, breed: 'Thoroughbred', owner: 'Wind Valley', status: 'injured', wins: 5, races: 11, points: 1240 },
  { id: 5, name: 'Thunder Bolt', age: 3, breed: 'Appaloosa', owner: 'Silver Mane', status: 'retired', wins: 2, races: 8, points: 670 },
  { id: 6, name: 'Golden Eagle', age: 5, breed: 'Thoroughbred', owner: 'Stable Alpha', status: 'active', wins: 8, races: 14, points: 1890 },
  { id: 7, name: 'Shadow Dancer', age: 4, breed: 'Arabian', owner: 'Blue Ridge Farm', status: 'injured', wins: 3, races: 7, points: 920 },
  { id: 8, name: 'Pegasus', age: 6, breed: 'Thoroughbred', owner: 'Wind Valley', status: 'active', wins: 10, races: 15, points: 2010 },
  { id: 9, name: 'Starlight', age: 3, breed: 'Mustang', owner: 'Golden Hooves', status: 'active', wins: 1, races: 4, points: 450 },
  { id: 10, name: 'Iron Hoof', age: 5, breed: 'Quarter Horse', owner: 'Silver Mane', status: 'retired', wins: 4, races: 12, points: 1120 },
  { id: 11, name: 'Royal Flash', age: 4, breed: 'Thoroughbred', owner: 'Royal Stables', status: 'active', wins: 7, races: 10, points: 1600 },
  { id: 12, name: 'Blazing Wind', age: 5, breed: 'Appaloosa', owner: 'Windy Plains', status: 'active', wins: 6, races: 13, points: 1450 }
]

export default function HorseList() {
  const { searchQuery, isAddModalOpen, setIsAddModalOpen } = useOutletContext()
  
  // Load initial list from localStorage or seed defaults
  const [horses, setHorses] = useState(() => {
    const stored = localStorage.getItem('mock_horses')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('Lỗi phân tích localStorage:', e)
      }
    }
    localStorage.setItem('mock_horses', JSON.stringify(DEFAULT_HORSES))
    return DEFAULT_HORSES
  })

  // Selected horse for details sidebar
  const [selectedHorse, setSelectedHorse] = useState(null)
  
  // Modal configurations
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHorse, setEditingHorse] = useState(null)
  const [formData, setFormData] = useState({ name: '', age: '', breed: '', owner: '', status: 'active' })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Listen to quick action button click in header
  useEffect(() => {
    if (isAddModalOpen) {
      setEditingHorse(null)
      setFormData({ name: '', age: '', breed: '', owner: '', status: 'active' })
      setModalOpen(true)
      setIsAddModalOpen(false) // reset state in layout
    }
  }, [isAddModalOpen, setIsAddModalOpen])

  // Reset pagination to page 1 on search filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Helper to persist list
  const saveHorses = (updatedList) => {
    setHorses(updatedList)
    localStorage.setItem('mock_horses', JSON.stringify(updatedList))
  }

  // Filter list by search query
  const filtered = horses.filter((horse) => {
    const query = searchQuery?.toLowerCase() || ''
    return (
      horse.name.toLowerCase().includes(query) ||
      horse.breed.toLowerCase().includes(query) ||
      horse.owner.toLowerCase().includes(query)
    )
  })

  // Calculate pages
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedHorses = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Actions
  const handleOpenAdd = () => {
    setEditingHorse(null)
    setFormData({ name: '', age: '', breed: '', owner: '', status: 'active' })
    setModalOpen(true)
  }

  const handleEdit = (horse) => {
    setEditingHorse(horse)
    setFormData({
      name: horse.name,
      age: horse.age,
      breed: horse.breed,
      owner: horse.owner,
      status: horse.status
    })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngựa đua này không?')) {
      const updated = horses.filter(h => h.id !== id)
      saveHorses(updated)
      if (selectedHorse && selectedHorse.id === id) {
        setSelectedHorse(null)
      }
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    if (editingHorse) {
      // Edit mode
      const updated = horses.map(h => 
        h.id === editingHorse.id 
          ? { ...h, ...formData, age: parseInt(formData.age) || 0 } 
          : h
      )
      saveHorses(updated)
      if (selectedHorse && selectedHorse.id === editingHorse.id) {
        setSelectedHorse({ ...selectedHorse, ...formData, age: parseInt(formData.age) || 0 })
      }
    } else {
      // Add mode
      const newHorse = {
        id: Date.now(),
        ...formData,
        age: parseInt(formData.age) || 0,
        wins: 0,
        races: 0,
        points: 0
      }
      saveHorses([newHorse, ...horses])
    }
    
    setModalOpen(false)
  }

  return (
    <div className="horse-mgmt-page">
      {/* Top Header Row for Page Context */}
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Horse Management</h1>
          <p className="admin-page-sub">Danh sách ngựa đua và thông số phong độ thi đấu</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--gold"
          onClick={handleOpenAdd}
        >
          + Add New Horse
        </button>
      </div>

      {/* Main Grid: Left is Table List, Right is Details Sidebar Panel if selected */}
      <div className="horse-mgmt-layout">
        <div className="admin-card user-mgmt-table-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên ngựa</th>
                  <th>Tuổi</th>
                  <th>Giống</th>
                  <th>Chủ sở hữu</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHorses.length > 0 ? (
                  paginatedHorses.map((horse) => (
                    <tr key={horse.id}>
                      <td style={{ fontWeight: '600', color: '#fff' }}>{horse.name}</td>
                      <td>{horse.age} tuổi</td>
                      <td>{horse.breed}</td>
                      <td>{horse.owner}</td>
                      <td>
                        <StatusBadge status={horse.status} />
                      </td>
                      <td>
                        <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost admin-btn--sm"
                            onClick={() => setSelectedHorse(horse)}
                          >
                            Chi tiết
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--outline admin-btn--sm"
                            onClick={() => handleEdit(horse)}
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger admin-btn--sm"
                            onClick={() => handleDelete(horse.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px 16px', color: '#666' }}>
                      Không tìm thấy kết quả phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div
              className="admin-pagination"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 22px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <span className="text-muted" style={{ fontSize: '12px' }}>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(filtered.length, currentPage * itemsPerPage)} trong tổng số {filtered.length} con ngựa
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Trang trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`admin-btn admin-btn--sm ${currentPage === page ? 'admin-btn--gold' : 'admin-btn--ghost'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Horse Details Side Panel (Slides/shows on the right side) */}
        {selectedHorse && (
          <div className="admin-card user-detail-panel" style={{ width: '100%' }}>
            <div className="admin-card-head">
              <h3>Chi tiết Ngựa</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setSelectedHorse(null)}
              >
                ✕
              </button>
            </div>
            <div className="admin-card-body user-detail-body">
              <div className="user-detail-avatar" style={{ fontSize: '24px', background: 'linear-gradient(135deg, #d4af37, #8b7355)', color: '#0d0d0d' }}>
                ♞
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{selectedHorse.name}</h4>
              <p style={{ margin: '0 0 20px', color: '#d4af37', fontSize: '13px', letterSpacing: '0.05em' }}>{selectedHorse.breed}</p>
              
              <dl className="user-detail-dl" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                <dt>Tuổi</dt>
                <dd>{selectedHorse.age} tuổi</dd>
                
                <dt>Chủ sở hữu</dt>
                <dd>{selectedHorse.owner}</dd>
                
                <dt>Trạng thái</dt>
                <dd>
                  <StatusBadge status={selectedHorse.status} />
                </dd>
                
                <dt>Điểm phong độ</dt>
                <dd style={{ color: '#d4af37', fontWeight: '700' }}>{selectedHorse.points || 0} PTS</dd>
                
                <dt>Chiến tích (Wins/Races)</dt>
                <dd style={{ color: '#4ade80', fontWeight: '500' }}>
                  {selectedHorse.wins || 0} thắng / {selectedHorse.races || 0} trận
                </dd>
              </dl>
              
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--outline admin-btn--sm"
                  style={{ flex: 1 }}
                  onClick={() => handleEdit(selectedHorse)}
                >
                  Sửa
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--sm"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(selectedHorse.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Horse Modal */}
      {modalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000
          }}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)'
            }}
          >
            <div className="admin-card-head">
              <h3>{editingHorse ? `Sửa thông tin: ${editingHorse.name}` : 'Thêm ngựa đua mới'}</h3>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="admin-card-body form-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tên Ngựa</label>
                <input
                  required
                  className="admin-input"
                  placeholder="Nhập tên ngựa đua..."
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tuổi</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="30"
                    className="admin-input"
                    placeholder="Tuổi..."
                    value={formData.age}
                    onChange={(e) => setFormData(f => ({ ...f, age: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Giống loài</label>
                  <input
                    required
                    className="admin-input"
                    placeholder="Ví dụ: Thoroughbred..."
                    value={formData.breed}
                    onChange={(e) => setFormData(f => ({ ...f, breed: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Chủ sở hữu</label>
                <input
                  required
                  className="admin-input"
                  placeholder="Ví dụ: Stable Alpha..."
                  value={formData.owner}
                  onChange={(e) => setFormData(f => ({ ...f, owner: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trạng thái</label>
                <select
                  className="admin-select"
                  value={formData.status}
                  onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
                  style={{ width: '100%' }}
                >
                  <option value="active">Hoạt động (Active)</option>
                  <option value="retired">Giải nghệ (Retired)</option>
                  <option value="injured">Chấn thương (Injured)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--gold"
                >
                  {editingHorse ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
