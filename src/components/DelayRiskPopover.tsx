import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DelayRisk, DelayRiskLevel } from '../types/freight'

interface DelayRiskPopoverProps {
  risk: DelayRisk
}

function riskLevelLabel(level: DelayRiskLevel) {
  switch (level) {
    case 'None':
      return '无'
    case 'Low':
      return '低'
    case 'Medium':
      return '中'
    case 'High':
      return '高'
  }
}

function riskLevelClass(level: DelayRiskLevel) {
  switch (level) {
    case 'None':
      return 'delay-risk-none'
    case 'Low':
      return 'delay-risk-low'
    case 'Medium':
      return 'delay-risk-medium'
    case 'High':
      return 'delay-risk-high'
  }
}

const POPOVER_WIDTH = 380
const POPOVER_GAP = 6

export function DelayRiskPopover({ risk }: DelayRiskPopoverProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'bottom' | 'top' })
  const anchorRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)

  const updatePosition = () => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const popoverHeight = 320
    const spaceBelow = window.innerHeight - rect.bottom
    const placement = spaceBelow < popoverHeight && rect.top > popoverHeight ? 'top' : 'bottom'
    const top = placement === 'bottom'
      ? rect.bottom + POPOVER_GAP
      : rect.top - popoverHeight - POPOVER_GAP
    const left = Math.min(
      Math.max(12, rect.right - POPOVER_WIDTH),
      window.innerWidth - POPOVER_WIDTH - 12,
    )

    setPosition({ top, left, placement })
  }

  useEffect(() => {
    if (!open) return

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120)
  }

  const handleOpen = () => {
    clearCloseTimer()
    setOpen(true)
  }

  return (
    <div
      ref={anchorRef}
      className="delay-risk-anchor"
      onMouseEnter={handleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={`delay-risk-trigger ${riskLevelClass(risk.level)}`}
        aria-label={`延迟风险：${riskLevelLabel(risk.level)}`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          if (open) {
            setOpen(false)
          } else {
            handleOpen()
          }
        }}
      >
        <span className="delay-risk-trigger-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
        </span>
        延迟风险: {riskLevelLabel(risk.level)}
        <svg
          className={`delay-risk-chevron ${open ? 'open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {open && createPortal(
        <div
          className={`delay-risk-popover delay-risk-popover-portal delay-risk-popover-${position.placement}`}
          style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
        >
          <div className="delay-risk-popover-header">
            <span className={`delay-risk-popover-icon ${riskLevelClass(risk.level)}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </span>
            <span className="delay-risk-popover-title">
              延迟风险: {riskLevelLabel(risk.level)}
            </span>
          </div>

          <div className="delay-risk-grid">
            <div className="delay-risk-cell">
              <span className="delay-risk-label">路线</span>
              <span className="delay-risk-value">
                {risk.routeFrom}
                <span className="delay-risk-arrow">→</span>
                {risk.routeTo}
              </span>
            </div>
            <div className="delay-risk-cell">
              <span className="delay-risk-label">状态</span>
              <span className="delay-risk-value">{risk.statusMessage}</span>
            </div>
            <div className="delay-risk-cell">
              <span className="delay-risk-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                预计运输时间
              </span>
              <span className="delay-risk-value">{risk.expectedTransitTime}</span>
            </div>
            <div className="delay-risk-cell">
              <span className="delay-risk-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                下一站 ETA
              </span>
              <span className="delay-risk-value">{risk.etaToNextStation}</span>
            </div>
            <div className="delay-risk-cell">
              <span className="delay-risk-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                实际用时
              </span>
              <span className="delay-risk-value">{risk.actualTime}</span>
            </div>
            <div className="delay-risk-cell">
              <span className="delay-risk-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                预计延迟
              </span>
              <span className={`delay-risk-value delay-risk-delay ${riskLevelClass(risk.level)}`}>
                {risk.expectedDelay}
              </span>
            </div>
          </div>

          <div className="delay-risk-about">
            <span className="delay-risk-about-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
            <div>
              <p className="delay-risk-about-title">关于此结果</p>
              <p className="delay-risk-about-text">
                该结果基于 AI 对该路线历史运踪数据的分析预测。
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
