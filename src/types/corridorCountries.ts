export type CorridorCountryId =
  | 'china'
  | 'kazakhstan'
  | 'azerbaijan'
  | 'georgia'
  | 'turkey'
  | 'hungary'
  | 'poland'
  | 'germany'
  | 'romania'

/** 各国铁路线 JSON（相对 public/railwayLineJson/） */
export const RAILWAY_LINE_FILES: Partial<Record<CorridorCountryId, string>> = {
  kazakhstan: '13ee60a9-fda1-4ad6-b263-60105e1a168f-kazakhstan-260615_railways.json',
  azerbaijan: 'db667121-4739-4ff3-b513-aa897338ee91-azerbaijan-260623_railways.json',
  georgia: '502fd158-592b-424d-a697-6dded5910bfb-georgia-260623_railways.json',
}

export const CORRIDOR_COUNTRY_LABELS: Record<CorridorCountryId, { zh: string; en: string }> = {
  china: { zh: '中国', en: 'China' },
  kazakhstan: { zh: '哈萨克斯坦', en: 'Kazakhstan' },
  azerbaijan: { zh: '阿塞拜疆', en: 'Azerbaijan' },
  georgia: { zh: '格鲁吉亚', en: 'Georgia' },
  turkey: { zh: '土耳其', en: 'Turkey' },
  hungary: { zh: '匈牙利', en: 'Hungary' },
  poland: { zh: '波兰', en: 'Poland' },
  germany: { zh: '德国', en: 'Germany' },
  romania: { zh: '罗马尼亚', en: 'Romania' },
}

export function getCorridorCountryLabel(country: CorridorCountryId, locale: string): string {
  const labels = CORRIDOR_COUNTRY_LABELS[country]
  return locale === 'en' ? labels.en : labels.zh
}
