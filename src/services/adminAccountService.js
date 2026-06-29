import axios from 'axios'
import { API_BASE_URL } from '../constants/api'

const client = axios.create({ baseURL: API_BASE_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Role-to-endpoint mapping
const roleEndpoint = (role) => {
  const map = {
    HORSE_OWNER: 'horse-owners',
    JOCKEY: 'jockeys',
    REFEREE: 'referees',
    SPECTATOR: 'spectators',
    ADMIN: 'admins',
  }
  return map[role] || 'accounts'
}

/**
 * Lấy tất cả tài khoản (gộp từ nhiều role)
 */
export async function getAllAccounts() {
  const roles = ['HORSE_OWNER', 'JOCKEY', 'REFEREE', 'SPECTATOR']
  const results = await Promise.allSettled(
    roles.map((role) =>
      client.get(`/admin/${roleEndpoint(role)}`).then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || res.data?.data || []
        return data.map((item) => ({ ...item, role }))
      })
    )
  )
  return results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}

/**
 * Cập nhật thông tin tài khoản (bao gồm status)
 */
export async function updateAccount(role, id, payload) {
  const res = await client.put(`/admin/${roleEndpoint(role)}/${id}`, payload)
  return res.data
}

/**
 * Xóa tài khoản
 */
export async function deleteAccount(role, id) {
  const res = await client.delete(`/admin/${roleEndpoint(role)}/${id}`)
  return res.data
}

/**
 * Gán vai trò mới cho tài khoản
 */
export async function assignRole(currentRole, id, payload) {
  const res = await client.put(`/admin/${roleEndpoint(currentRole)}/${id}/role`, payload)
  return res.data
}

/**
 * Tạo tài khoản mới
 */
export async function createAccount(payload) {
  const res = await client.post(`/admin/${roleEndpoint(payload.role)}`, payload)
  return res.data
}
