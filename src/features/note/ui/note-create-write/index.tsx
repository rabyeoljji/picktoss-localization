import { useEffect, useRef, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { Textarea } from '@/shared/components/ui/textarea'
import { usePWA } from '@/shared/hooks/use-pwa'
import { cn } from '@/shared/lib/utils'

import { DOCUMENT_CONSTRAINTS } from '../../config'
import { useCreateNoteContext } from '../../model/create-note-context'
import './style.css'

export const NoteCreateWrite = () => {
  const { content, setContent } = useCreateNoteContext()
  const { isKeyboardVisible } = useKeyboard()
  const [textareaHeight, setTextareaHeight] = useState(300)
  const { isPWA } = usePWA()
  const viewportWrapRef = useRef<HTMLDivElement>(null)

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

  // 포커스/블러 이벤트는 추가적인 처리가 필요하면 넣으시면 됩니다.
  const handleFocus = () => {}
  const handleBlur = () => {}

  // window scroll 이벤트 핸들러:
  // visualViewport의 pageTop과 offsetTop 차이를 이용해 translateY를 계산하고,
  // 문서의 끝을 넘지 않도록 scroll을 클램핑합니다.
  const handleWindowScroll = () => {
    if (!window.visualViewport || !viewportWrapRef.current) return
    const viewport = window.visualViewport
    const viewportTopGap = viewport.pageTop - viewport.offsetTop
    const translateY = window.scrollY - viewportTopGap
    viewportWrapRef.current.style.transform = `translateY(${translateY}px)`

    // 가상 영역까지 스크롤 내려가는 것을 방지
    if (window.scrollY + viewport.height > document.body.offsetHeight - 2) {
      window.scrollTo(0, document.body.offsetHeight - viewport.height - 1)
    }
  }

  // visualViewport scroll 이벤트 (추가 로직이 필요할 경우 사용)
  const handleViewportScroll = (e: Event) => {
    // 현재는 디버깅 또는 추가 처리를 위한 용도로 남겨둡니다.
  }

  // keyboard on/off 상태에 따라 scroll 이벤트 핸들러 등록/해제
  useEffect(() => {
    if (window.visualViewport) {
      const viewportHeight = window.visualViewport.height
      if (window.innerHeight > viewportHeight) {
        // 키보드 ON: viewportwrap 높이를 고정하고 scroll 이벤트 등록
        if (viewportWrapRef.current) {
          viewportWrapRef.current.style.height = `${viewportHeight}px`
        }
        window.addEventListener('scroll', handleWindowScroll)
        window.visualViewport.addEventListener('scroll', handleViewportScroll)
      } else {
        // 키보드 OFF: 원래 높이(100%)로 복원하고 scroll 이벤트 해제
        if (viewportWrapRef.current) {
          viewportWrapRef.current.style.height = '100%'
          viewportWrapRef.current.style.transform = ''
        }
        window.removeEventListener('scroll', handleWindowScroll)
        window.visualViewport.removeEventListener('scroll', handleViewportScroll)
      }
    }

    return () => {
      window.removeEventListener('scroll', handleWindowScroll)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('scroll', handleViewportScroll)
      }
    }
  }, [isKeyboardVisible])

  // 텍스트 에리아 높이를 계산 (고정영역 높이 고려)
  useEffect(() => {
    const updateHeight = () => {
      const availableHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
      const topFixedAreaHeight = 114
      const bottomFixedAreaHeight = isKeyboardVisible ? 40 : 96
      setTextareaHeight(availableHeight - topFixedAreaHeight - bottomFixedAreaHeight)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
    }

    return () => {
      window.removeEventListener('resize', updateHeight)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
      }
    }
  }, [isKeyboardVisible])

  return (
    <div className="flex-1 relative">
      {/* viewportwrap: scroll translate 및 높이 고정을 위한 div */}
      <div
        ref={viewportWrapRef}
        style={{
          height: `calc(100% - ${isKeyboardVisible ? 50 : 96}px + 1px)`,
          backgroundColor: 'red',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Textarea
          placeholder="여기를 탭하여 입력을 시작하세요"
          className={cn('border-none px-4', isPWA && 'pb-[env(safe-area-inset-top)]')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleTextareaChange(e.target.value)}
          style={{
            height: textareaHeight,
          }}
        />
      </div>

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider absolute bottom-0 w-full max-w-xl">
          <div className="flex items-center gap-1">
            <IcInfo className="size-4 text-icon-sub" />
            <Text typo="body-1-regular" color="caption">
              최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
            </Text>
          </div>
          <Text typo="body-1-medium" color="secondary">
            <span
              className={cn(
                content.length < DOCUMENT_CONSTRAINTS.CONTENT.MIN || content.length > DOCUMENT_CONSTRAINTS.CONTENT.MAX
                  ? 'text-critical'
                  : 'text-success',
              )}
            >
              {content.length}
            </span>{' '}
            / {DOCUMENT_CONSTRAINTS.CONTENT.MAX}
          </Text>
        </div>
      )}
    </div>
  )
}
