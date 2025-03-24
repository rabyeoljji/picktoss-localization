import { useEffect, useRef, useState } from 'react'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { cn } from '@/shared/lib/utils'

import { htmlToMarkdown } from '../lib'

// 에디터 기본 스타일 정의
const editorStyles = `
.ProseMirror {
  outline: none !important;
  min-height: 100% !important;
  width: 100% !important;
  box-sizing: border-box !important;
  padding: 20px 16px !important;
  margin: 0 !important;
}

.ProseMirror p {
  margin: 0 0 1em 0 !important;
}

.ProseMirror p:last-child {
  margin-bottom: 0 !important;
}
`

interface MarkdownEditorProps {
  initialContent?: string
  onChange?: (html: string, markdown: string) => void
  placeholder?: string
  className?: string
}

export const MarkdownEditor = ({
  initialContent = '',
  onChange,
  placeholder = '여기를 탭하여 입력을 시작하세요',
  className,
}: MarkdownEditorProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

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
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  })

  // 커스텀 스타일 적용
  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style')
      style.textContent = editorStyles
      document.head.appendChild(style)
      styleRef.current = style
    }

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
    }
  }, [])

  // PWA 환경 대응을 위한 visualViewport API 활용
  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const handleViewportChange = () => {
      // 키보드가 올라왔을 때 뷰포트 높이 변화 감지
      document.documentElement.style.setProperty(
        '--viewport-height', 
        `${visualViewport.height}px`
      )
    }

    visualViewport.addEventListener('resize', handleViewportChange)
    visualViewport.addEventListener('scroll', handleViewportChange)

    // 초기 실행
    handleViewportChange()

    return () => {
      visualViewport.removeEventListener('resize', handleViewportChange)
      visualViewport.removeEventListener('scroll', handleViewportChange)
    }
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('w-full h-full', className)}>
      <div ref={editorWrapperRef} className="relative w-full h-full overflow-auto">
        {editor.isEmpty && !isFocused && (
          <div className="absolute left-4 top-5 text-gray-400 pointer-events-none z-10">{placeholder}</div>
        )}

        <EditorContent editor={editor} className="w-full h-full" />
      </div>
    </div>
  )
}
