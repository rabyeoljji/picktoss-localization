import { QueryParamOptions, QueryParams, QueryParamValue } from '../model'

/**
 * URL에서 현재 쿼리 파라미터를 파싱하여 객체로 반환
 */
export const parseQueryParams = (): QueryParams => {
  if (typeof window === 'undefined') {
    return {}
  }

  const params = new URLSearchParams(window.location.search)
  const result: QueryParams = {}

  params.forEach((value, key) => {
    // 이미 존재하는 키인 경우 배열로 처리
    if (key in result) {
      const existingValue = result[key]
      if (Array.isArray(existingValue)) {
        existingValue.push(value)
      } else {
        result[key] = [existingValue as string, value]
      }
    } else {
      result[key] = value
    }
  })

  return result
}

/**
 * 특정 쿼리 파라미터의 값을 가져옴
 * @param key 쿼리 파라미터 키
 */
export const getQueryParam = (key: string): QueryParamValue => {
  const params = parseQueryParams()
  return params[key] || null
}

/**
 * 쿼리 파라미터 객체를 URL 쿼리 문자열로 변환
 * @param params 쿼리 파라미터 객체
 * @param options 옵션 (빈 값 처리 방법 등)
 */
export const stringifyQueryParams = (
  params: QueryParams, 
  options: { emptyHandling?: 'remove' | 'preserve' } = {}
): string => {
  const { emptyHandling = 'remove' } = options
  const urlParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === '') {
      if (emptyHandling === 'preserve') {
        urlParams.append(key, '')
      }
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== '' || emptyHandling === 'preserve') {
          urlParams.append(key, val)
        }
      })
    } else {
      urlParams.append(key, value)
    }
  })

  const queryString = urlParams.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 브라우저 URL을 업데이트
 * @param newParams 새 쿼리 파라미터 객체
 * @param options 옵션 (히스토리 처리 방법 등)
 */
export const updateBrowserUrl = (
  newParams: QueryParams,
  options: QueryParamOptions = {}
): void => {
  if (typeof window === 'undefined') {
    return
  }

  const { push = true, emptyHandling = 'remove' } = options
  const newUrl = `${window.location.pathname}${stringifyQueryParams(newParams, { emptyHandling })}`
  
  // 기존 URL과 동일하면 아무것도 하지 않음
  if (window.location.pathname + window.location.search === newUrl) {
    return
  }

  if (push) {
    window.history.pushState({}, '', newUrl)
  } else {
    window.history.replaceState({}, '', newUrl)
  }

  // URL 변경 이벤트 발생 (popstate는 브라우저 뒤로가기/앞으로가기 시에만 발생하므로)
  window.dispatchEvent(new Event('locationchange'))
}

/**
 * 특정 쿼리 파라미터의 값을 설정
 * @param key 쿼리 파라미터 키
 * @param value 설정할 값
 * @param options 옵션 (히스토리 처리 방법 등)
 */
export const setQueryParam = (
  key: string,
  value: QueryParamValue,
  options: QueryParamOptions = {}
): void => {
  const currentParams = parseQueryParams()
  const newParams = { ...currentParams }

  if (value === null) {
    delete newParams[key]
  } else {
    newParams[key] = value
  }

  updateBrowserUrl(newParams, options)
}

/**
 * 특정 쿼리 파라미터 제거
 * @param key 제거할 쿼리 파라미터 키
 * @param options 옵션 (히스토리 처리 방법 등)
 */
export const removeQueryParam = (
  key: string,
  options: QueryParamOptions = {}
): void => {
  setQueryParam(key, null, options)
}
