import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dob, setDob] = useState('')
  const [role, setRole] = useState('SPECTATOR')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showRoleForm, setShowRoleForm] = useState(false)

  // Jockey specific states
  const [jockeyExp, setJockeyExp] = useState('')
  const [jockeyWeight, setJockeyWeight] = useState('')
  const [jockeyHeight, setJockeyHeight] = useState('')
  const [jockeyLicense, setJockeyLicense] = useState('')

  // Referee specific states
  const [refereeCert, setRefereeCert] = useState('Quốc gia')
  const [refereeExp, setRefereeExp] = useState('')
  const [refereeAssoc, setRefereeAssoc] = useState('')

  // Spectator specific states
  const [specFavHorse, setSpecFavHorse] = useState('')
  const [specFavJockey, setSpecFavJockey] = useState('')
  const [specBudget, setSpecBudget] = useState('')
  const [specNotify, setSpecNotify] = useState('Email')

  // Horse Owner specific states
  const [ownerStableName, setOwnerStableName] = useState('')
  const [ownerHorseCount, setOwnerHorseCount] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')

  const validateAge = (birthdateString) => {
    const birthDate = new Date(birthdateString)
    if (isNaN(birthDate.getTime())) {
      return 'Ngày sinh không hợp lệ.'
    }

    // Calculate age (today's year is 2026 as per metadata)
    const today = new Date('2026-06-07')
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      return `Bạn chưa đủ tuổi tham gia thi đấu/dự đoán (Hiện tại ${age} tuổi, yêu cầu từ 18 tuổi trở lên).`
    }

    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !username || !email || !password || !dob || !role) {
      setError('Vui lòng nhập đầy đủ tất cả thông tin đăng ký!')
      return
    }

    const validationError = validateAge(dob)
    if (validationError) {
      setError(validationError)
      return
    }

    setShowRoleForm(true)
  }

  function handleRoleSubmit(e) {
    e.preventDefault()
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="auth-shell" style={{ height: '620px', alignItems: 'stretch' }}>
        <div className="auth-panel auth-image-panel" style={{ height: '100%' }}>
          <img
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80"
            alt="Ngựa đang phi"
            style={{ height: '100%', objectFit: 'cover' }}
          />
          <div className="auth-image-overlay">
            <span className="hero-label">HORSIE</span>
            <h2>Gia nhập cộng đồng đua ngựa</h2>
            <p>Tạo tài khoản để theo dõi giải đấu, xếp hạng và dự đoán</p>
          </div>
        </div>

        <div className="auth-panel auth-admin" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#4ade80', marginBottom: '12px' }}>Đăng ký tài khoản thành công!</h2>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
            Tài khoản với tên đăng nhập <strong>{username}</strong> và vai trò <strong>{role === 'JOCKEY' ? 'Kỵ Sĩ' : role === 'REFEREE' ? 'Trọng tài' : (role === 'HORSE_OWNER' || role === 'HORSE OWNER') ? 'Chủ ngựa' : 'Khán giả'}</strong> đã được thiết lập thành công cùng thông tin hồ sơ chi tiết.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block', lineHeight: '38px', height: '38px', width: '200px', alignSelf: 'center', marginBottom: '20px' }}>
            Đăng nhập ngay
          </Link>
          <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  if (showRoleForm) {
    return (
      <div className="auth-shell" style={{ height: '620px', alignItems: 'stretch' }}>
        <div className="auth-panel auth-image-panel" style={{ height: '100%' }}>
          <img
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80"
            alt="Ngựa đang phi"
            style={{ height: '100%', objectFit: 'cover' }}
          />
          <div className="auth-image-overlay">
            <span className="hero-label">HORSIE</span>
            <h2>Thông tin vai trò</h2>
            <p>Bổ sung thông tin chi tiết cho vai trò bạn đã chọn để hoàn tất thủ tục đăng ký.</p>
          </div>
        </div>

        <div className="auth-panel auth-admin" style={{ height: '100%', overflowY: 'auto' }}>
          <div className="auth-panel-head">
            <span className="hero-label">
              {role === 'JOCKEY' ? 'Kỵ Sĩ' : role === 'REFEREE' ? 'Trọng Tài' : (role === 'HORSE_OWNER' || role === 'HORSE OWNER') ? 'Chủ Ngựa' : 'Khán Giả'}
            </span>
            <h2>Thông tin chức vụ</h2>
            <p>Vui lòng điền các thông tin dành riêng cho vai trò của bạn.</p>
          </div>

          <form onSubmit={handleRoleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {role === 'JOCKEY' && (
              <>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Số năm kinh nghiệm</label>
                  <input
                    type="number"
                    value={jockeyExp}
                    onChange={e => setJockeyExp(e.target.value)}
                    placeholder="Ví dụ: 3"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Cân nặng (kg)</label>
                  <input
                    type="number"
                    value={jockeyWeight}
                    onChange={e => setJockeyWeight(e.target.value)}
                    placeholder="Ví dụ: 55"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Chiều cao (cm)</label>
                  <input
                    type="number"
                    value={jockeyHeight}
                    onChange={e => setJockeyHeight(e.target.value)}
                    placeholder="Ví dụ: 165"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Số giấy phép hành nghề</label>
                  <input
                    type="text"
                    value={jockeyLicense}
                    onChange={e => setJockeyLicense(e.target.value)}
                    placeholder="Ví dụ: LIC-12345"
                    className="input-field"
                    required
                  />
                </div>
              </>
            )}

            {role === 'REFEREE' && (
              <>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Cấp bậc chứng chỉ</label>
                  <select
                    value={refereeCert}
                    onChange={e => setRefereeCert(e.target.value)}
                    className="input-field"
                    style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#f5f5f5', border: '1px solid rgba(255, 255, 255, 0.18)' }}
                    required
                  >
                    <option value="Quốc tế" style={{ background: '#1c1c1e', color: '#fff' }}>Quốc tế (International)</option>
                    <option value="Quốc gia" style={{ background: '#1c1c1e', color: '#fff' }}>Quốc gia (National)</option>
                    <option value="Cấp tỉnh" style={{ background: '#1c1c1e', color: '#fff' }}>Cấp tỉnh (Provincial)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Số năm kinh nghiệm trọng tài</label>
                  <input
                    type="number"
                    value={refereeExp}
                    onChange={e => setRefereeExp(e.target.value)}
                    placeholder="Ví dụ: 5"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Hiệp hội trọng tài thành viên</label>
                  <input
                    type="text"
                    value={refereeAssoc}
                    onChange={e => setRefereeAssoc(e.target.value)}
                    placeholder="Ví dụ: Hiệp hội Trọng tài Việt Nam"
                    className="input-field"
                    required
                  />
                </div>
              </>
            )}

            {(role === 'HORSE_OWNER' || role === 'HORSE OWNER') && (
              <>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Tên trang trại / Chuồng ngựa</label>
                  <input
                    type="text"
                    value={ownerStableName}
                    onChange={e => setOwnerStableName(e.target.value)}
                    placeholder="Ví dụ: Golden Stable"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Số lượng ngựa đang sở hữu</label>
                  <input
                    type="number"
                    value={ownerHorseCount}
                    onChange={e => setOwnerHorseCount(e.target.value)}
                    placeholder="Ví dụ: 5"
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Địa chỉ liên hệ</label>
                  <input
                    type="text"
                    value={ownerAddress}
                    onChange={e => setOwnerAddress(e.target.value)}
                    placeholder="Ví dụ: Quận 9, TP. Hồ Chí Minh"
                    className="input-field"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Hoàn tất đăng ký
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '5px', background: 'rgba(255,255,255,0.05)', color: '#ccc', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => setShowRoleForm(false)}
            >
              Quay lại bước trước
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell" style={{ height: '620px', alignItems: 'stretch' }}>
      <div className="auth-panel auth-image-panel" style={{ height: '100%' }}>
        <img
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80"
          alt="Ngựa đang phi"
          style={{ height: '100%', objectFit: 'cover' }}
        />
        <div className="auth-image-overlay">
          <span className="hero-label">HORSIE</span>
          <h2>Gia nhập cộng đồng đua ngựa</h2>
          <p>Tạo tài khoản để theo dõi giải đấu, xếp hạng và dự đoán</p>
        </div>
      </div>

      <div className="auth-panel auth-admin" style={{ height: '100%', overflowY: 'auto' }}>
        <div className="auth-panel-head">
          <span className="hero-label">Đăng ký</span>
          <h2>Tạo tài khoản mới</h2>
          <p>Điền thông tin để hệ thống xác minh độ tuổi tham gia.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {error && <p className="auth-error" style={{ color: '#f87171', fontSize: '13px', background: 'rgba(248,113,113,0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(248,113,113,0.15)', margin: '0 0 10px 0' }}>{error}</p>}

          <div className="form-group">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Họ và tên"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Tên đăng nhập (Username)"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              type="password"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = 'text'
              }}
              value={dob}
              onChange={e => setDob(e.target.value)}
              placeholder="Ngày sinh (Đủ 18 tuổi trở lên)"
              className="input-field"
              required
            />
          </div>

          <div className="form-group">
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="input-field"
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#f5f5f5', border: '1px solid rgba(255, 255, 255, 0.18)' }}
              required
            >
              <option value="SPECTATOR" style={{ background: '#1c1c1e', color: '#fff' }}>Khán giả (Spectator)</option>
              <option value="JOCKEY" style={{ background: '#1c1c1e', color: '#fff' }}>Kỵ sĩ (Jockey)</option>
              <option value="REFEREE" style={{ background: '#1c1c1e', color: '#fff' }}>Trọng tài (Referee)</option>
              <option value="HORSE_OWNER" style={{ background: '#1c1c1e', color: '#fff' }}>Chủ ngựa (Horse Owner)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Đăng ký tài khoản
          </button>

          <p className="help-text" style={{ marginTop: 14, textAlign: 'center', fontSize: '13px' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" className="help-link" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: '500' }}>
              Đăng nhập
            </Link>
          </p>

          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '13px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
            <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: '500' }}>
              ← Quay về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
