import { useEffect, useRef, useState } from 'react'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Text } from '@/shared/components/ui/text'
import { cn } from '@/shared/lib/utils'

const 하단_영역_높이 = 40

// Simple HTML to Markdown conversion utility
const htmlToMarkdown = (html: string): string => {
  // This is a simplified conversion - you may want to use a more robust solution in production
  let markdown = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<ul>(.*?)<\/ul>/g, '$1\n')
    .replace(/<ol>(.*?)<\/ol>/g, '$1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<img src="(.*?)".*?>/g, '![]($1)')
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")

  return markdown.trim()
}

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

    const updateHeight = () => {
      if (!containerRef.current) return

      // 전체 뷰포트 높이 가져오기
      const viewportHeight = window.innerHeight

      // 컨테이너의 위치 정보 가져오기
      const containerRect = containerRef.current.getBoundingClientRect()
      const containerTop = containerRect.top

      // 사용 가능한 높이 계산 (뷰포트 높이 - 컨테이너 상단 위치 - 하단 영역 높이 - 여유 공간)
      const availableHeight = viewportHeight - containerTop - 하단_영역_높이 - 50

      // ProseMirror 요소에 직접 높이 적용
      const proseMirror = containerRef.current.querySelector('.ProseMirror')
      if (proseMirror) {
        ;(proseMirror as HTMLElement).style.height = `${availableHeight}px`
        ;(proseMirror as HTMLElement).style.overflowY = 'auto'
      }
    }

    // 초기 높이 계산
    updateHeight()

    // 윈도우 크기 변경 시 높이 재계산
    window.addEventListener('resize', updateHeight)

    // 클린업 함수
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={cn('relative w-full flex flex-col h-full', className)}>
      {editor.isEmpty && !isFocused && (
        <div className="absolute left-4 top-5 text-gray-400 pointer-events-none">{placeholder}</div>
      )}
      <div ref={containerRef} className="flex-grow flex flex-col">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none w-full py-5 px-4 flex-grow [&_.ProseMirror]:outline-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror:focus]:shadow-none"
        />
      </div>

      <div className="flex justify-between items-center h-10 px-[16px] py-[10px] bg-white border-t border-gray-100">
        <div className="flex items-center">
          <Text typo="body-2-medium">최소 {minLength}자 이상 입력해주세요</Text>
        </div>
        <div>
          <Text typo="body-2-medium">
            {charCount} / {maxLength}
          </Text>
        </div>
      </div>
    </div>
  )
}
