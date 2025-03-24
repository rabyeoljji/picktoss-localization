import React, { useState } from 'react'

interface ProductImageGalleryProps {
  imageUrl: string
  productName: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ imageUrl, productName }) => {
  // 실제 환경에서는 여러 이미지를 표시할 수 있도록 확장
  const [selectedImage, setSelectedImage] = useState(imageUrl)
  
  // 목업 이미지 목록 생성 (실제로는 API에서 받아와야 함)
  const generateThumbnails = () => {
    const seed = imageUrl.split('/seed/')[1]?.split('/')[0] || 'product-1'
    return [
      imageUrl,
      `https://picsum.photos/seed/${seed}-angle1/800/600`,
      `https://picsum.photos/seed/${seed}-angle2/800/600`,
      `https://picsum.photos/seed/${seed}-detail/800/600`,
    ]
  }
  
  const thumbnails = generateThumbnails()

  return (
    <div>
      {/* 메인 이미지 */}
      <div className="border rounded-lg overflow-hidden bg-gray-50 mb-4">
        <img 
          src={selectedImage} 
          alt={productName} 
          className="w-full h-auto object-contain aspect-square"
        />
      </div>
      
      {/* 썸네일 목록 */}
      <div className="grid grid-cols-4 gap-2">
        {thumbnails.map((thumb, index) => (
          <button
            key={index}
            className={`border rounded-md overflow-hidden ${
              selectedImage === thumb ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(thumb)}
          >
            <img 
              src={thumb} 
              alt={`${productName} 이미지 ${index + 1}`} 
              className="w-full h-auto aspect-square object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
