import React, { useState } from 'react'
import { tournaments, races } from '../../../data/adminMockData'
import { StatusBadge } from '../../../utils/adminHelpers'
import './SpectatorDashboard.css'

export default function SpectatorDashboard() {
  const [selectedRace, setSelectedRace] = useState(null)
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  // Filtered races
  const filteredRaces = races.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        r.tournament.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus
    return matchSearch && matchStatus
  })

  // Simulated lanes for detailed view
  const getSimulatedLanes = (raceId) => {
    return [
      { lane: 1, horse: 'Aurelius', jockey: 'L. Anderson', odds: 2.5 },
      { lane: 2, horse: 'Midnight Star', jockey: 'M. Rodriguez', odds: 3.1 },
      { lane: 3, horse: 'Velvet Thunder', jockey: 'S. Nakamura', odds: 4.2 },
      { lane: 4, horse: 'Golden Eagle', jockey: 'K. McEvoy', odds: 5.0 },
      { lane: 5, horse: 'Pegasus', jockey: 'Michael Brown', odds: 6.5 },
      { lane: 6, horse: 'Starlight', jockey: 'Sarah Chen', odds: 8.0 }
    ]
  }

  return (
    <div className="spectator-dashboard">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Giải Đấu & Lịch Đua</h1>
          <p className="admin-page-sub">Theo dõi lịch trình các sự kiện, vòng đua trực tiếp và thông tin chi tiết</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Side: Schedule and Races */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-card">
            <div className="admin-card-head">
              <h3>Lịch Thi Đấu (Races Schedule)</h3>
            </div>
            <div className="admin-card-body" style={{ padding: '16px' }}>
              <div className="admin-filter-bar" style={{ marginBottom: '16px' }}>
                <input 
                  className="admin-input" 
                  placeholder="Tìm cuộc đua, giải đấu..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1 }}
                />
                <select 
                  className="admin-select" 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">Tất cả lịch đua</option>
                  <option value="scheduled">Đã lên lịch (Scheduled)</option>
                  <option value="ongoing">Đang diễn ra (Ongoing)</option>
                  <option value="completed">Đã kết thúc (Completed)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRaces.map(r => (
                  <div 
                    key={r.id} 
                    className="race-schedule-item"
                    onClick={() => setSelectedRace(r)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fff', fontSize: '14px', display: 'block' }}>{r.name}</strong>
                      <span style={{ fontSize: '12px', color: '#d4af37' }}>🏆 {r.tournament}</span>
                      <span style={{ fontSize: '11px', color: '#666', marginLeft: '10px' }}>📏 {r.distance}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>
                        <div>📅 {r.date}</div>
                        <div>⏰ {r.time}</div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tournaments Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-card">
            <div className="admin-card-head">
              <h3>Giải Đấu Đang Diễn Ra (Tournaments)</h3>
            </div>
            <div className="admin-card-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tournaments.map(t => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTournament(t)}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(18, 18, 18, 0.5)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  className="tourney-item-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>{t.name}</h4>
                    <StatusBadge status={t.status} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>📍 Địa điểm: {t.venue}</span>
                    <span>📅 Thời gian: {t.startDate} đến {t.endDate}</span>
                    <span>💰 Tổng giải thưởng: <strong style={{ color: '#d4af37' }}>{t.prize}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Race Details Modal */}
      {selectedRace && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="admin-card-head">
              <div>
                <h3>Chi tiết Vòng chạy & Làn thi đấu</h3>
                <span style={{ fontSize: '11px', color: '#d4af37' }}>Mã cuộc đua: {selectedRace.id}</span>
              </div>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setSelectedRace(null)}>✕</button>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <div><span style={{ color: '#666' }}>Tên cuộc đua:</span> <strong style={{ color: '#fff' }}>{selectedRace.name}</strong></div>
                <div><span style={{ color: '#666' }}>Trạng thái:</span> <StatusBadge status={selectedRace.status} /></div>
                <div><span style={{ color: '#666' }}>Giải đấu:</span> <strong style={{ color: '#fff' }}>{selectedRace.tournament}</strong></div>
                <div><span style={{ color: '#666' }}>Cự ly:</span> <strong style={{ color: '#d4af37' }}>{selectedRace.distance}</strong></div>
                <div><span style={{ color: '#666' }}>Ngày đua:</span> <strong style={{ color: '#fff' }}>{selectedRace.date}</strong></div>
                <div><span style={{ color: '#666' }}>Giờ xuất phát:</span> <strong style={{ color: '#fff' }}>{selectedRace.time}</strong></div>
              </div>

              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '10px', letterSpacing: '0.05em' }}>Danh Sách Đua Đề Xuất (Làn Chạy)</h4>
              
              <div className="admin-table-wrap" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '16px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>Làn</th>
                      <th>Ngựa Đua</th>
                      <th>Jockey</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSimulatedLanes(selectedRace.id).map(l => (
                      <tr key={l.lane}>
                        <td style={{ fontWeight: 'bold', color: '#d4af37' }}>#{l.lane}</td>
                        <td style={{ color: '#fff', fontWeight: '500' }}>{l.horse}</td>
                        <td>{l.jockey}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn--gold" onClick={() => setSelectedRace(null)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="admin-card-head">
              <h3>Thông tin Giải Đấu</h3>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setSelectedTournament(null)}>✕</button>
            </div>
            <div className="admin-card-body">
              <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 4px 0' }}>{selectedTournament.name}</h3>
              <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '16px' }}>Mã sự kiện: {selectedTournament.id}</span>
              
              <dl className="user-detail-dl" style={{ fontSize: '13px', marginBottom: '20px' }}>
                <dt>Địa điểm tổ chức</dt>
                <dd>{selectedTournament.venue}</dd>
                
                <dt>Thời gian giải chạy</dt>
                <dd>{selectedTournament.startDate} đến {selectedTournament.endDate}</dd>
                
                <dt>Tổng cơ cấu giải thưởng</dt>
                <dd style={{ color: '#d4af37', fontWeight: 'bold', fontSize: '16px' }}>{selectedTournament.prize}</dd>

                <dt>Trạng thái</dt>
                <dd><StatusBadge status={selectedTournament.status} /></dd>
              </dl>

              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#d4af37', marginBottom: '10px', marginTop: '20px', letterSpacing: '0.05em' }}>Danh sách cuộc đua thuộc giải</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '20px' }}>
                {races.filter(r => 
                  selectedTournament.name.toLowerCase().includes(r.tournament.toLowerCase()) ||
                  r.tournament.toLowerCase().includes(selectedTournament.name.toLowerCase())
                ).map(r => (
                  <div 
                    key={r.id}
                    onClick={() => {
                      setSelectedRace(r)
                      setSelectedTournament(null)
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="race-item-hover"
                  >
                    <div>
                      <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>{r.name}</strong>
                      <span style={{ fontSize: '11px', color: '#888' }}>📏 {r.distance} | 📅 {r.date}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="admin-btn admin-btn--gold" onClick={() => setSelectedTournament(null)}>Đóng thông tin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
