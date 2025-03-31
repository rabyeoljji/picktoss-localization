export type CategoryEnum =
  | 'IT'
  | 'LAW'
  | 'BUSINESS_ECONOMY'
  | 'SOCIETY_POLITICS'
  | 'LANGUAGE'
  | 'MEDICINE_PHARMACY'
  | 'ART'
  | 'SCIENCE_ENGINEERING'
  | 'HISTORY_PHILOSOPHY'

type Category = {
  key: CategoryEnum
  name: string
  emoji: string
  color: string
}

export const CATEGORIES: Category[] = [
  {
    key: 'IT',
    name: 'IT·공학',
    emoji: '🤖',
    color: '#4B7FF9',
  },
  {
    key: 'BUSINESS_ECONOMY',
    name: '경영·경제',
    emoji: '💰',
    color: '#F8623F',
  },
  {
    key: 'SCIENCE_ENGINEERING',
    name: '과학',
    emoji: '🔬',
    color: '#1C49DC',
  },
  {
    key: 'HISTORY_PHILOSOPHY',
    name: '역사·철학',
    emoji: '📜',
    color: '#9B856A',
  },
  {
    key: 'SOCIETY_POLITICS',
    name: '사회·정치',
    emoji: '⚖️',
    color: '#FFC466',
  },
  {
    key: 'ART',
    name: '예술',
    emoji: '🎨',
    color: '#AC86FF',
  },
  {
    key: 'MEDICINE_PHARMACY',
    name: '의학·약학',
    emoji: '🩺',
    color: '#7DCF6E',
  },
  {
    key: 'LANGUAGE',
    name: '언어',
    emoji: '💬',
    color: '#FF81A9',
  },
  {
    key: 'LAW',
    name: '법학',
    emoji: '📖',
    color: '#464646',
  },
]
