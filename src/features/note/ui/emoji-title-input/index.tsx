import { useEffect, useRef, useState } from 'react'

import EmojiPicker, { Theme } from 'emoji-picker-react'

import { useCreateNoteContext } from '../../model/create-note-context'

export const EmojiTitleInput = () => {
  const { emoji, setEmoji } = useCreateNoteContext()

  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="p-4 flex items-center gap-3 pt-3 pb-2">
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          // 모바일에서 키보드가 올라오지 않도록 기본 포커스 동작을 방지
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="typo-h4 flex-center size-[40px] rounded-[6px] border border-outline bg-base-2"
        >
          {emoji}
        </button>
        {showEmojiPicker && (
          <div className="absolute top-full bg-base-1 z-40 left-0 mt-1">
            <EmojiPicker
              onEmojiClick={(data) => {
                setEmoji(data.emoji)
                setShowEmojiPicker(false)
              }}
              theme={Theme.LIGHT}
              width={300}
              height={400}
            />
          </div>
        )}
      </div>

      <div className="flex-1">
        {/* <Input
          className="border-none placeholder:text-caption h-auto px-0 focus-visible:ring-0"
          typo="h3"
          placeholder="제목 입력"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        /> */}
      </div>
    </div>
  )
}
