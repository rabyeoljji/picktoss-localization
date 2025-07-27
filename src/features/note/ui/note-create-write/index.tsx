import { useEffect, useRef, useState } from 'react'

import { useKeyboard } from '@/app/keyboard-detector'

import { IcCopy, IcInfo } from '@/shared/assets/icon'
import { Button } from '@/shared/components/ui/button'
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

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [canPaste, setCanPaste] = useState(false)
  const [clipboardPermissionRequested, setClipboardPermissionRequested] = useState(false)
  const [clipboardPermissionDenied, setClipboardPermissionDenied] = useState(false)

  // 클립보드 권한 요청 함수
  const requestClipboardPermission = async () => {
    if (!navigator.permissions || !navigator.clipboard) return false

    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })

      if (permission.state === 'granted') {
        return true
      } else if (permission.state === 'prompt') {
        // 권한 요청을 위해 실제 clipboard 접근 시도
        await navigator.clipboard.readText()
        return true
      } else if (permission.state === 'denied') {
        setClipboardPermissionDenied(true)
        return false
      }

      return false
    } catch {
      setClipboardPermissionDenied(true)
      return false
    }
  }

  // PWA 환경에서 클립보드 권한 확인 및 요청
  useEffect(() => {
    handlePointerDown()

    if (isPWA && !clipboardPermissionRequested) {
      requestClipboardPermission().then((granted) => {
        setClipboardPermissionRequested(true)
        if (granted) {
          // 권한이 허용되면 클립보드 내용 확인
          handlePointerDown()
        }
      })
    }
  }, [isPWA, clipboardPermissionRequested])

  const handlePointerDown = async () => {
    if (!navigator.clipboard) return
    try {
      const text = await navigator.clipboard.readText() // 동기(=제스처) 컨텍스트 유지
      setCanPaste(!!text)
    } catch {
      setCanPaste(false)
    }
  }

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handlePasteClick = async () => {
    if (!textAreaRef.current) return
    const text = await navigator.clipboard.readText()
    textAreaRef.current.value = text
    setContent(text)
  }

  const handleTextareaChange = (content: string) => {
    setContent(content)
  }

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
      <Textarea
        ref={textAreaRef}
        placeholder="여기를 탭하여 입력을 시작하세요"
        className={cn('border-none px-4', isPWA && 'pb-[env(safe-area-inset-top)]')}
        onChange={(e) => handleTextareaChange(e.target.value)}
        style={{
          height: textareaHeight,
        }}
      />
      {canPaste && content.length === 0 && !clipboardPermissionDenied && (
        <Button
          variant="secondary2"
          size="sm"
          left={<IcCopy />}
          onClick={handlePasteClick}
          className="absolute left-[16px] top-[77px]"
        >
          복사한 텍스트 붙여넣기
        </Button>
      )}

      {isKeyboardVisible && (
        <div className="flex justify-between bg-base-1 items-center px-4 h-[40px] border-t border-divider absolute bottom-0 w-full max-w-xl">
          <div className="flex items-center gap-1">
            <IcInfo className="size-4 text-icon-sub" />
            <Text typo="body-1-medium" color="caption">
              최소 {DOCUMENT_CONSTRAINTS.CONTENT.MIN}자 이상 입력해주세요
            </Text>
          </div>
          <Text typo="body-1-medium" color="sub">
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
