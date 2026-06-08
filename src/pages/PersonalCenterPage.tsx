import { useState } from 'react'
import type { AuthUser } from '../types/auth'
import {
  PROFILE_TABS,
  getApiHistory,
  getDocumentsForUser,
  getProfileForUser,
  getSwitchQueryHistory,
  type ProfileTab,
} from '../types/profile'

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function ProfileHeader({ user, profile }: { user: AuthUser; profile: ReturnType<typeof getProfileForUser> }) {
  const avatarLetter = profile.companyNameCn.charAt(0)

  return (
    <div className="profile-header">
      <div className="profile-header-avatar">{avatarLetter}</div>
      <div className="profile-header-info">
        <div className="profile-header-title-row">
          <h1 className="profile-header-company">{profile.companyNameCn}</h1>
          {profile.verified && (
            <span className="profile-verified-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              已认证
            </span>
          )}
        </div>
        <div className="profile-header-meta">
          <span>{user.roleLabel}</span>
          <span className="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {profile.location}
          </span>
          <span className="profile-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {profile.email}
          </span>
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  value,
  optional,
  fullWidth,
}: {
  label: string
  value: string
  optional?: boolean
  fullWidth?: boolean
}) {
  return (
    <label className={`profile-field ${fullWidth ? 'profile-field-full' : ''}`}>
      <span className="profile-field-label">
        {label}
        {optional && <span className="profile-field-optional">（可选）</span>}
      </span>
      <input type="text" className="profile-input" value={value} readOnly />
    </label>
  )
}

function CompanyInfoTab({ user }: { user: AuthUser }) {
  const profile = getProfileForUser(user)

  return (
    <div className="profile-tab-content">
      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">个人信息</h2>
          <button type="button" className="profile-edit-btn" aria-label="编辑个人信息">
            <EditIcon />
          </button>
        </div>

        <div className="profile-logo-field">
          <span className="profile-field-label">公司Logo</span>
          <div className="profile-logo-upload">
            <div className="profile-logo-preview">{profile.companyNameCn.charAt(0)}</div>
            <div className="profile-logo-hint">
              <span className="profile-logo-hint-icon">↑</span>
              <p>支持 JPG、PNG、SVG 等格式，建议尺寸 200×200px，文件大小不超过 2MB</p>
            </div>
          </div>
        </div>

        <div className="profile-form-grid">
          <FormField label="名字" value={profile.firstName} />
          <FormField label="姓氏" value={profile.lastName} />
          <FormField label="父名" value={profile.patronymic || '—'} optional />
          <FormField label="工作电话" value={profile.workPhone} />
          <FormField label="工作邮箱" value={profile.workEmail} fullWidth />
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">公司信息</h2>
          <button type="button" className="profile-edit-btn" aria-label="编辑公司信息">
            <EditIcon />
          </button>
        </div>

        <div className="profile-form-grid">
          <FormField label="公司名称(中文)" value={profile.companyNameCn} fullWidth />
          <FormField label="公司名称(英文)" value={profile.companyNameEn} fullWidth />
          <FormField label="公司识别号 (BIN)" value={profile.bin} fullWidth />

          <div className="profile-field profile-field-full">
            <span className="profile-field-label">实际地址</span>
            <div className="profile-address-row">
              <input type="text" className="profile-input" value={profile.actualRegion} readOnly />
              <input type="text" className="profile-input profile-input-postal" value={profile.actualPostalCode} readOnly placeholder="邮编" />
            </div>
            <textarea className="profile-textarea" value={profile.actualAddress} readOnly rows={3} />
          </div>

          <label className="profile-checkbox profile-field-full">
            <input type="checkbox" checked={profile.sameAsRegistered} readOnly />
            <span>公司的注册地址与实际地址相同</span>
          </label>

          <FormField label="银行名称" value={profile.bankName} />
          <FormField label="SWIFT 代码" value={profile.swiftCode} />
        </div>
      </section>
    </div>
  )
}

function DocumentsTab({ user }: { user: AuthUser }) {
  const documents = getDocumentsForUser(user)

  return (
    <div className="profile-tab-content">
      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">公司文档</h2>
        </div>
        <div className="profile-doc-list">
          {documents.map((doc) => (
            <div key={doc.id} className="profile-doc-item">
              <div className="profile-doc-info">
                <span className="profile-doc-name">{doc.name}</span>
                {doc.uploadedAt && (
                  <span className="profile-doc-time">上传于 {doc.uploadedAt}</span>
                )}
              </div>
              <span className={`profile-doc-status profile-doc-status-${doc.status === '已上传' ? 'done' : 'pending'}`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ApiHistoryTab() {
  const records = getApiHistory()

  return (
    <div className="profile-tab-content">
      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">API 通讯历史记录</h2>
        </div>
        <div className="profile-table-wrapper">
          <table className="profile-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>接口</th>
                <th>方法</th>
                <th>状态码</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id}>
                  <td className="cell-muted cell-nowrap">{row.time}</td>
                  <td><code className="profile-api-endpoint">{row.endpoint}</code></td>
                  <td>{row.method}</td>
                  <td>
                    <span className={`profile-api-status ${row.status >= 400 ? 'error' : 'ok'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function SwitchHistoryTab() {
  const records = getSwitchQueryHistory()

  return (
    <div className="profile-tab-content">
      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">交换机查询历史记录</h2>
        </div>
        <div className="profile-table-wrapper">
          <table className="profile-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>查询类型</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              {records.map((row) => (
                <tr key={row.id}>
                  <td className="cell-muted cell-nowrap">{row.time}</td>
                  <td>{row.queryType}</td>
                  <td>
                    <span className={`profile-switch-result ${row.result === '成功' ? 'ok' : 'error'}`}>
                      {row.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

interface PersonalCenterPageProps {
  user: AuthUser
}

export function PersonalCenterPage({ user }: PersonalCenterPageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('company')
  const profile = getProfileForUser(user)

  return (
    <div className="profile-page">
      <ProfileHeader user={user} profile={profile} />

      <div className="profile-card">
        <div className="profile-tabs">
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'company' && <CompanyInfoTab user={user} />}
        {activeTab === 'documents' && <DocumentsTab user={user} />}
        {activeTab === 'apiHistory' && <ApiHistoryTab />}
        {activeTab === 'switchHistory' && <SwitchHistoryTab />}
      </div>
    </div>
  )
}
