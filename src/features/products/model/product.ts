/**
 * 상품 타입 정의
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  rating: number
  isOnSale: boolean
  inStock: boolean
  imageUrl: string
  discount?: number
  createdAt: string
  popularity: number
}

/**
 * 목업 상품 데이터
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '프리미엄 무선 헤드폰',
    description: '고품질 사운드와 노이즈 캔슬링 기능을 갖춘 프리미엄 헤드폰',
    price: 299000,
    category: '전자제품',
    brand: '소닉',
    rating: 4.5,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/0/300/300',
    discount: 15,
    createdAt: '2025-02-15T09:00:00Z',
    popularity: 850
  },
  {
    id: '2',
    name: '스마트 워치 프로',
    description: '건강 모니터링과 앱 알림 기능을 갖춘 스마트 워치',
    price: 189000,
    category: '전자제품',
    brand: '테크웨어',
    rating: 4,
    isOnSale: false,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/1/300/300',
    createdAt: '2025-03-01T09:00:00Z',
    popularity: 720
  },
  {
    id: '3',
    name: '캐주얼 데님 자켓',
    description: '모든 계절에 어울리는 클래식 데님 자켓',
    price: 89000,
    category: '의류',
    brand: '패션스타',
    rating: 4.2,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/20/300/300',
    discount: 20,
    createdAt: '2025-01-20T09:00:00Z',
    popularity: 650
  },
  {
    id: '4',
    name: '울트라 슬림 노트북',
    description: '초경량 디자인과 강력한 성능을 갖춘 비즈니스 노트북',
    price: 1490000,
    category: '전자제품',
    brand: '테크웨어',
    rating: 5,
    isOnSale: false,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/2/300/300',
    createdAt: '2025-03-10T09:00:00Z',
    popularity: 920
  },
  {
    id: '5',
    name: '유기농 그래놀라 세트',
    description: '100% 유기농 재료로 만든 건강한 그래놀라 6종 세트',
    price: 42000,
    category: '식품',
    brand: '네이처푸드',
    rating: 4.8,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/10/300/300',
    discount: 10,
    createdAt: '2025-02-25T09:00:00Z',
    popularity: 480
  },
  {
    id: '6',
    name: '베스트셀러 소설 컬렉션',
    description: '올해의 베스트셀러 소설 5권 세트',
    price: 65000,
    category: '도서',
    brand: '북하우스',
    rating: 4.6,
    isOnSale: false,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/24/300/300',
    createdAt: '2025-01-05T09:00:00Z',
    popularity: 570
  },
  {
    id: '7',
    name: '에코 친화적 세탁 세제',
    description: '환경에 해가 없는 성분으로 만든 고농축 세탁 세제',
    price: 18000,
    category: '생활용품',
    brand: '에코클린',
    rating: 4.3,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/26/300/300',
    discount: 5,
    createdAt: '2025-03-05T09:00:00Z',
    popularity: 320
  },
  {
    id: '8',
    name: '프리미엄 요가 매트',
    description: '미끄럼 방지와 쿠션감이 우수한 고급 요가 매트',
    price: 78000,
    category: '생활용품',
    brand: '요가라이프',
    rating: 4.7,
    isOnSale: true,
    inStock: false,
    imageUrl: 'https://picsum.photos/id/28/300/300',
    discount: 25,
    createdAt: '2025-02-10T09:00:00Z',
    popularity: 420
  },
  {
    id: '9',
    name: '하이킹 방수 자켓',
    description: '모든 날씨에 적합한 경량 방수 하이킹 자켓',
    price: 125000,
    category: '의류',
    brand: '아웃도어프로',
    rating: 4.4,
    isOnSale: false,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/21/300/300',
    createdAt: '2025-01-15T09:00:00Z',
    popularity: 680
  },
  {
    id: '10',
    name: '스마트 홈 스피커',
    description: '음성 인식과 스마트홈 제어 기능을 갖춘 인공지능 스피커',
    price: 149000,
    category: '전자제품',
    brand: '소닉',
    rating: 4.1,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/3/300/300',
    discount: 12,
    createdAt: '2025-02-20T09:00:00Z',
    popularity: 780
  },
  {
    id: '11',
    name: '프로페셔널 카메라',
    description: '전문가용 DSLR 카메라 바디',
    price: 1890000,
    category: '전자제품',
    brand: '옵티카',
    rating: 4.9,
    isOnSale: false,
    inStock: false,
    imageUrl: 'https://picsum.photos/id/250/300/300',
    createdAt: '2025-01-10T09:00:00Z',
    popularity: 890
  },
  {
    id: '12',
    name: '유기농 면 침구 세트',
    description: '친환경 유기농 면으로 만든 침구 풀세트',
    price: 198000,
    category: '생활용품',
    brand: '에코홈',
    rating: 4.5,
    isOnSale: true,
    inStock: true,
    imageUrl: 'https://picsum.photos/id/118/300/300',
    discount: 15,
    createdAt: '2025-02-05T09:00:00Z',
    popularity: 540
  }
]
