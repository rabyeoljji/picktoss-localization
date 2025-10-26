import { useRef, useState } from 'react'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { marked } from 'marked'
import { toast } from 'sonner'
import styled from 'styled-components'

import { DOCUMENT_CONSTRAINTS } from '@/features/note/config'

import { IcWarningFilled } from '@/shared/assets/icon'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from '@/shared/locales/use-translation'

interface MarkdownEditorProps {
  initialMarkdown?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
  isKeyboardVisible?: boolean
}

export const MarkdownEditor = (props: MarkdownEditorProps) => {
  const { t } = useTranslation()

  const {
    initialMarkdown = '',
    onChange,
    placeholder = t('createQuiz.note_create_write.placeholder'),
    className,
    editable,
    isKeyboardVisible,
  } = props

  const [isFocused, setIsFocused] = useState(false)
  const editorWrapperRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      Image,
      Link.configure({
        openOnClick: false,
      }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'pl-4 list-disc',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'pl-4 list-decimal',
          },
        },
      }),
    ],
    content: marked(initialMarkdown, { gfm: true, breaks: true }),
    editable: editable,
    onUpdate: async ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML()
        const markdown = await marked.parse(html)

        if (markdown.length <= DOCUMENT_CONSTRAINTS.CONTENT.MAX) {
          onChange(markdown)
        } else {
          toast(t('createQuiz.toast.content_max_chars'), {
            icon: <IcWarningFilled className="size-4 text-icon-critical" />,
          })

          const truncatedMarkdown = markdown.slice(0, DOCUMENT_CONSTRAINTS.CONTENT.MAX)
          const truncatedHTML = marked(truncatedMarkdown, { gfm: true, breaks: true })

          editor.commands.setContent(truncatedHTML, false)
          onChange(truncatedMarkdown)
        }
      }
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  })

  if (!editor) {
    return null
  }

  return (
    <div
      className={cn('w-full h-full', className)}
      style={{
        height: 'calc(100% + 1px)',
      }}
    >
      <ProseMirrorWrapper>
        <div ref={editorWrapperRef} className="relative w-full h-full">
          {editor.isEmpty && !isFocused && (
            <div className="absolute left-4 top-5 text-gray-400 pointer-events-none z-10">{placeholder}</div>
          )}

          <EditorContent editor={editor} className={cn('w-full', isKeyboardVisible ? 'pb-[40px]' : 'pb-[96px]')} />
        </div>
      </ProseMirrorWrapper>
    </div>
  )
}

/** 커스텀 스타일 적용 */
const ProseMirrorWrapper = styled.div`
  .ProseMirror {
    outline: none !important;
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box !important;
    padding: 20px 16px !important;
    margin: 0 !important;
    overflow-y: auto !important;

    p {
      margin: 0 0 1em 0 !important;
    }

    p:last-child {
      margin-bottom: 0 !important;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: bold;
      margin: 1.2em 0;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1em 0;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: bold;
    }

    h4 {
      font-size: 1.15rem;
      font-weight: bold;
    }

    h3,
    h4,
    ul,
    ol {
      margin: 0.8em 0;
    }

    blockquote {
      margin: 1em 0;
    }
  }
`
