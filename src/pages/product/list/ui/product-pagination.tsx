import React from 'react'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // 표시할 페이지 버튼 범위 계산
  const getPageRange = () => {
    // 항상 현재 페이지를 중심으로 좌우 2개씩, 최대 5개 표시
    const maxButtons = 5
    let start = Math.max(1, currentPage - 2)
    const end = Math.min(start + maxButtons - 1, totalPages)

    // 페이지 수가 maxButtons보다 크고, 끝에 가까울 경우 시작점 조정
    if (totalPages > maxButtons && end === totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const pageNumbers = getPageRange()

  // 모바일 환경에서 터치 이벤트 최적화를 위한 onClick 핸들러
  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="flex justify-center">
      <ul className="flex items-center">
        {/* 이전 페이지 버튼 */}
        <li>
          <button
            onClick={handlePageClick(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 mx-1 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="이전 페이지"
          >
            &laquo;
          </button>
        </li>

        {/* 첫 페이지 버튼 (현재 페이지가 4 이상일 때만 표시) */}
        {currentPage > 3 && (
          <>
            <li>
              <button
                onClick={handlePageClick(1)}
                className="px-3 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                1
              </button>
            </li>
            {currentPage > 4 && (
              <li>
                <span className="px-3 py-2 text-gray-500">...</span>
              </li>
            )}
          </>
        )}

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map((pageNum) => (
          <li key={pageNum}>
            <button
              onClick={handlePageClick(pageNum)}
              className={`px-3 py-2 mx-1 rounded-md ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          </li>
        ))}

        {/* 마지막 페이지 버튼 (현재 페이지가 마지막 페이지 - 2보다 작을 때만 표시) */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <li>
                <span className="px-3 py-2 text-gray-500">...</span>
              </li>
            )}
            <li>
              <button
                onClick={handlePageClick(totalPages)}
                className="px-3 py-2 mx-1 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* 다음 페이지 버튼 */}
        <li>
          <button
            onClick={handlePageClick(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 mx-1 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="다음 페이지"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  )
}
