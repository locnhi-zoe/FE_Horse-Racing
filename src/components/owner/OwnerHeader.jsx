import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ownerBreadcrumbLabels, ownerRaces } from '../../data/ownerMockData'

function useClickOutside(ref, handler) {
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [ref, handler])
}

export default function OwnerHeader() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [query, setQuery] = useState('')
  const notifRef = useRef(null)
  const userRef = useRef(null)

  useClickOutside(notifRef, () => setNotifOpen(false))
  useClickOutside(userRef, () => setUserOpen(false))

  const pageLabel = ownerBreadcrumbLabels[location.pathname] || 'Chủ ngựa'
  const pendingNotifications = ownerRaces.filter(r => r.status === 'pending_confirmation')

  return (
    <header className="owner-header">
      <nav className="owner-breadcrumb" aria-label="Breadcrumb">
        <Link to="/owner">Chủ ngựa</Link>
        <span className="owner-breadcrumb-sep">›</span>
        <span>{pageLabel}</span>
      </nav>

      <div className="owner-search">
        <span className="owner-search-icon">⌕</span>
        <input
          className="owner-search-input"
          placeholder="Tìm kiếm ngựa, jockey, giải đấu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="owner-header-actions">
        {/* notifications */}
        <div className="owner-dropdown" ref={notifRef}>
          <button
            type="button"
            className="owner-icon-btn"
            aria-label="Thông báo"
            onClick={() => { setNotifOpen((v) => !v); setUserOpen(false) }}
          >
            🔔
            {pendingNotifications.length > 0 && <span className="owner-notif-badge" />}
          </button>
          {notifOpen && (
            <div className="owner-dropdown-menu owner-dropdown-menu--wide">
              <div className="owner-dropdown-head">Thông báo mới</div>
              {pendingNotifications.length > 0 ? (
                pendingNotifications.map((n) => (
                  <div key={n.id} className="owner-notif-item">
                    <span className="owner-notif-dot" />
                    <div>
                      <strong>Xác nhận thi đấu</strong>
                      <span style={{ color: '#ccc' }}>Ngựa {n.registeredHorse} cần xác nhận tham gia {n.name}.</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px 20px', color: '#666', fontSize: 13, textAlign: 'center' }}>
                  Không có thông báo mới
                </div>
              )}
              <Link to="/owner/races" className="owner-dropdown-item" onClick={() => setNotifOpen(false)}>
                Xem tất cả lịch thi đấu →
              </Link>
            </div>
          )}
        </div>

        {/* user menu */}
        <div className="owner-dropdown" ref={userRef}>
          <button
            type="button"
            className="owner-user-btn"
            onClick={() => { setUserOpen((v) => !v); setNotifOpen(false) }}
          >
            <span className="owner-user-avatar">
              {(user?.name || 'V').charAt(0).toUpperCase()}
            </span>
            <div className="owner-user-info">
              <strong>{user?.name || 'Trần Thế Vinh'}</strong>
              <span>{user?.role || 'OWNER'}</span>
            </div>
          </button>
          {userOpen && (
            <div className="owner-dropdown-menu">
              <div className="owner-dropdown-head">Tài khoản</div>
              <Link to="/owner/profile" className="owner-dropdown-item" onClick={() => setUserOpen(false)}>Hồ sơ Trang trại</Link>
              <Link to="/" className="owner-dropdown-item" onClick={() => setUserOpen(false)}>Về trang chủ</Link>
              <button type="button" className="owner-dropdown-item" onClick={() => { setUserOpen(false); logout(); }}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
