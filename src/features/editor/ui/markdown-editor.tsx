import { useEffect, useRef, useState } from 'react'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { IcInfo } from '@/shared/assets/icon'
import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

import { htmlToMarkdown } from '../lib'

const 하단_영역_높이 = 40

interface MarkdownEditorProps {
  initialContent?: string
  onChange?: (html: string, markdown: string) => void
  placeholder?: string
  className?: string
  maxLength?: number
  minLength?: number
}

export const MarkdownEditor = ({
  initialContent = '',
  onChange,
  placeholder = '여기를 탭하여 입력을 시작하세요',
  className,
  maxLength = 50000,
  minLength = 1000,
}: MarkdownEditorProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML()
        const markdown = htmlToMarkdown(html)
        onChange(html, markdown)

        const text = editor.getText()
        setCharCount(text.length)
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  })

  // 컨테이너 높이에서 패딩을 제외한 높이 계산
  useEffect(() => {
    if (!containerRef.current || !editor) return

    // 디바운스 처리를 위한 타이머 ID
    let resizeTimeoutId: NodeJS.Timeout | null = null

    const updateHeight = () => {
      if (!containerRef.current) return

      // 이전 타이머가 있으면 취소
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId)
      }

      // 키패드 애니메이션 시간을 고려하여 약간의 지연 후 높이 계산 (300ms)
      resizeTimeoutId = setTimeout(() => {
        if (!containerRef.current) return

        // visualViewport API를 사용하여 현재 보이는 영역의 높이를 가져옴
        const viewportHeight = window.visualViewport?.height || window.innerHeight
        
        // 컨테이너의 위치 정보 가져오기
        const containerRect = containerRef.current.getBoundingClientRect()
        const containerTop = containerRect.top
        
        // 사용 가능한 높이 계산 (뷰포트 높이 - 컨테이너 상단 위치 - 하단 영역 높이)
        const availableHeight = viewportHeight - containerTop - 하단_영역_높이
        
        console.log('Height calculation:', {
          viewportHeight,
          containerTop,
          하단_영역_높이,
          availableHeight
        })
        
        // ProseMirror 요소에 직접 높이 적용
        const proseMirror = containerRef.current.querySelector('.ProseMirror')
        if (proseMirror) {
          // 부드러운 전환을 위한 트랜지션 추가
          ;(proseMirror as HTMLElement).style.transition = 'height 0.2s ease-out'
          ;(proseMirror as HTMLElement).style.height = `${availableHeight}px`
          ;(proseMirror as HTMLElement).style.overflowY = 'auto'
        }
      }, 300)
    }

    // 초기 높이 계산
    updateHeight()

    // visualViewport API를 사용하여 키패드 상태 변화 감지
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight)
      window.visualViewport.addEventListener('scroll', updateHeight)
    } else {
      // visualViewport API가 지원되지 않는 브라우저를 위한 대체 이벤트
      window.addEventListener('resize', updateHeight)
    }

    // 클린업 함수
    return () => {
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId)
      }
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateHeight)
        window.visualViewport.removeEventListener('scroll', updateHeight)
      } else {
        window.removeEventListener('resize', updateHeight)
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('relative w-full flex flex-col h-full bg-surface-1', className)}>
      {editor.isEmpty && !isFocused && (
        <div className="absolute left-4 top-5 text-gray-400 pointer-events-none">{placeholder}</div>
      )}
      <div ref={containerRef} className="flex-grow flex flex-col">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none w-full py-5 px-4 flex-grow [&_.ProseMirror]:outline-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror:focus]:shadow-none"
        />
      </div>

      <div className="flex justify-between items-center sticky bottom-0 h-10 px-[16px] py-[10px]">
        <div className="flex items-center gap-1">
          <IcInfo className="size-4 text-caption" />
          <Text typo="body-2-medium" color="caption">
            최소 {minLength}자 이상 입력해주세요
          </Text>
        </div>
        <div>
          <Text typo="body-2-medium">
            {charCount} <span className="text-sub">/ {maxLength}</span>
          </Text>
        </div>
      </div>
    </div>
  )
}
