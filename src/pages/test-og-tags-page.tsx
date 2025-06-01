import { useState } from 'react'

import { withHOC } from '@/app/hoc/with-page-config'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Text } from '@/shared/components/ui/text'

/**
 * Open Graph 메타 태그 테스트 페이지
 * 이 페이지를 사용하여 카카오톡 등에서 공유될 때 어떻게 보이는지 테스트할 수 있습니다.
 */
const TestOgTagsPage = () => {
  const [title, setTitle] = useState('PickToss - 잠깐의 퀴즈로 만드는 시험 합격 루틴')
  const [description, setDescription] = useState('Description')
  const [url, setUrl] = useState(`${window.location.origin.slice(0, -1)}`)
  const [image, setImage] = useState(`${window.location.origin}images/share-thumbnail.png`)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        console.log('공유 성공')
      } catch (error) {
        console.error('공유 실패', error)
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Text typo="h2" className="mb-4">
        Open Graph 메타 태그 테스트
      </Text>

      <div className="space-y-4 mb-6">
        <div>
          <Text typo="body-2-medium" className="mb-1">
            제목
          </Text>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Text typo="body-2-medium" className="mb-1">
            URL
          </Text>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div>
          <Text typo="body-2-medium" className="mb-1">
            설명
          </Text>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Text typo="body-2-medium" className="mb-1">
            이미지 URL
          </Text>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleShare} className="w-full">
        공유하기
      </Button>

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <Text typo="subtitle-1-bold" className="mb-2">
          미리보기
        </Text>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <div className="aspect-w-16 aspect-h-9 mb-2 bg-gray-200 overflow-hidden rounded">
            <img src={image} alt="Preview" className="object-cover w-full h-full" />
          </div>
          <Text typo="subtitle-2-medium" className="line-clamp-1">
            {title}
          </Text>
          <Text typo="body-2-medium" className="text-gray-400 mt-1 text-xs">
            {description}
          </Text>
          <Text typo="body-2-medium" className="text-gray-400 mt-1 text-xs">
            {url}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default withHOC(TestOgTagsPage, {})
