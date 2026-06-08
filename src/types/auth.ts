export type UserRole = 'admin' | 'user'

export interface AuthUser {
  username: string
  displayName: string
  role: UserRole
  roleLabel: string
}

interface DefaultUser extends AuthUser {
  password: string
}

export const DEFAULT_USERS: DefaultUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    displayName: '南京智捷物流科技有限公司',
    role: 'admin',
    roleLabel: '管理员',
  },
  {
    username: 'user',
    password: 'user123',
    displayName: '普通用户',
    role: 'user',
    roleLabel: '普通用户',
  },
]

export function authenticate(username: string, password: string): AuthUser | null {
  const account = DEFAULT_USERS.find(
    (item) => item.username === username && item.password === password,
  )
  if (!account) return null

  const { password: _, ...user } = account
  return user
}

export const AUTH_STORAGE_KEY = 'freight-auth-user'

export function loadStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function storeUser(user: AuthUser) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
