import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cccd, setCccd] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateCCCDAndAge = (cccdNumber, birthdateString) => {
    if (!/^\d{12}$/.test(cccdNumber)) {
      return 'Số Căn cước công dân (CCCD) phải bao gồm đúng 12 chữ số.'
    }

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

    // Extract year from CCCD (4th, 5th, 6th digit)
    const genderCentury = parseInt(cccdNumber.charAt(3))
    const shortYear = cccdNumber.substring(4, 6)
    let cccdBirthYear = 0

    if (genderCentury === 0 || genderCentury === 1) {
      cccdBirthYear = 1900 + parseInt(shortYear)
    } else if (genderCentury === 2 || genderCentury === 3) {
      cccdBirthYear = 2000 + parseInt(shortYear)
    } else if (genderCentury === 4 || genderCentury === 5) {
      cccdBirthYear = 2100 + parseInt(shortYear)
    } else {
      return 'Số CCCD không hợp lệ (mã thế kỷ sinh ở vị trí thứ 4 phải từ 0 đến 5).'
    }

    const selectedYear = birthDate.getFullYear()
    if (cccdBirthYear !== selectedYear) {
      return `Năm sinh được giải mã từ CCCD (${cccdBirthYear}) không khớp với năm sinh chọn ở lịch (${selectedYear}).`
    }

    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !cccd || !dob) {
      setError('Vui lòng nhập đầy đủ tất cả thông tin đăng ký!')
      return
    }

    const validationError = validateCCCDAndAge(cccd, dob)
    if (validationError) {
      setError(validationError)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="auth-shell" style={{ height: '580px', alignItems: 'stretch' }}>
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
            Thông tin căn cước công dân và ngày sinh đã được xác thực (Đủ 18 tuổi). Bạn có thể đăng nhập ngay lúc này.
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

  return (
    <div className="auth-shell" style={{ height: '580px', alignItems: 'stretch' }}>
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
          <p>Điền thông tin và CCCD để hệ thống xác minh độ tuổi tham gia.</p>
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
              value={cccd}
              onChange={e => setCccd(e.target.value)}
              placeholder="Số Căn cước công dân (CCCD)"
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

