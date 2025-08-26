# i18n (Internationalization) 시스템

이 프로젝트는 `i18next`와 `react-i18next`를 사용하여 다국어 지원을 구현합니다.

## 지원 언어

- **한국어 (ko-KR)**: 기본 언어
- **영어 (en-US)**: 보조 언어

## 번역 키 컨벤션

### 1. 네임스페이스 기반 키 분류

번역 키는 파일 경로에 따라 자동으로 네임스페이스가 추가됩니다:

- `src/pages/home-page.tsx` → `daily.*`
- `src/pages/account/*` → `profile.*`
- `src/pages/invite/*` → `profile.*`
- `src/pages/explore/*` → `explore.*`
- `src/pages/library/*` → `library.*`
- `src/pages/note-create/*` → `createQuiz.*`
- `src/pages/quiz-detail/*` → `quizDetail.*`
- `src/pages/progress-quiz-page.tsx` → `progressQuiz.*`
- 기타 `src/pages/*` → `etc.*`

### 2. 번역 키 세분화 규칙

복합적인 텍스트는 가능한 한 작은 단위로 분리하여 재사용성을 높입니다:

```tsx
// ❌ 좋지 않은 예
{t('daily.consecutive_days_complete', { days: 5 })}

// ✅ 좋은 예
{t('daily.consecutive')} <span>{days}</span> {t('daily.day')} {t('daily.complete')}
```

### 3. 한국어 번역 규칙

- **한국어 번역 파일**: 프로젝트에서 사용된 기존 한국어 텍스트를 변형 없이 그대로 사용
- **영어 번역 파일**: 한국어 텍스트를 영어로 번역

### 4. 번역 함수 사용

```tsx
import { useTranslation } from '@/shared/locales/use-translation'

const MyComponent = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation()

  return (
    <div>
      <h1>{t('daily.title')}</h1>
      <p>
        {t('daily.consecutive')} <span>{days}</span> {t('daily.day')} {t('daily.complete')}
      </p>
      <button onClick={() => changeLanguage('en-US')}>{t('common.switch_to_english')}</button>
    </div>
  )
}
```

## 스크립트 명령어

### 1. 번역 키 스캔

```bash
# 수동 스캔 (권장)
pnpm scan:i18n:manual

# i18next-scanner 사용 (파싱 이슈로 권장하지 않음)
pnpm scan:i18n
```

### 2. 구글 스프레드시트 업로드/다운로드

```bash
# 스캔한 키를 구글 스프레드시트에 업로드
pnpm upload:i18n

# 구글 스프레드시트에서 번역 데이터 다운로드
pnpm download:i18n
```

## 구글 스프레드시트 구조

하나의 Google Sheets 문서 안에서 여러 시트로 번역 데이터를 관리합니다:

### 문서 구조

- **문서 ID**: `VITE_SPREAD_SHEET_DOC_ID` (URL의 `/d/` 다음 부분)
- **시트 ID**: 각 카테고리별 시트 ID (URL의 `#gid=` 다음 부분)

### 시트별 분류

- **Daily 시트**: `VITE_SPREAD_SHEET_DAILY_ID` - 홈페이지 관련 번역
- **Profile 시트**: `VITE_SPREAD_SHEET_PROFILE_ID` - 계정/초대 관련 번역
- **Explore 시트**: `VITE_SPREAD_SHEET_EXPLORE_ID` - 탐색 관련 번역
- **Library 시트**: `VITE_SPREAD_SHEET_LIBRARY_ID` - 도서관 관련 번역
- **CreateQuiz 시트**: `VITE_SPREAD_SHEET_CREATE_QUIZ_ID` - 퀴즈 생성 관련 번역
- **QuizDetail 시트**: `VITE_SPREAD_SHEET_QUIZ_DETAIL_ID` - 퀴즈 상세 관련 번역
- **ProgressQuiz 시트**: `VITE_SPREAD_SHEET_PROGRESS_QUIZ_ID` - 진행 퀴즈 관련 번역
- **Etc 시트**: `VITE_SPREAD_SHEET_ETC_ID` - 기타 번역

### 각 시트의 형식

| Key               | ko-KR       | en-US       |
| ----------------- | ----------- | ----------- |
| daily.title       | 데일리 퀴즈 | Daily Quiz  |
| daily.consecutive | 연속        | Consecutive |
| daily.day         | 일          | day         |
| daily.complete    | 완료        | Complete    |

## 환경 변수

다음 환경 변수들이 필요합니다:

```env
# 메인 문서 ID (하나의 Google Sheets 문서)
VITE_SPREAD_SHEET_DOC_ID=your_main_document_id

# 각 시트의 ID (문서 내 시트 구분)
VITE_SPREAD_SHEET_DAILY_ID=daily_sheet_id
VITE_SPREAD_SHEET_PROFILE_ID=profile_sheet_id
VITE_SPREAD_SHEET_EXPLORE_ID=explore_sheet_id
VITE_SPREAD_SHEET_LIBRARY_ID=library_sheet_id
VITE_SPREAD_SHEET_CREATE_QUIZ_ID=create_quiz_sheet_id
VITE_SPREAD_SHEET_QUIZ_DETAIL_ID=quiz_detail_sheet_id
VITE_SPREAD_SHEET_PROGRESS_QUIZ_ID=progress_quiz_sheet_id
VITE_SPREAD_SHEET_ETC_ID=etc_sheet_id
```

## 파일 구조

```
src/shared/locales/
├── i18n.ts                    # i18next 설정
├── use-translation.ts         # 커스텀 훅
├── ko-KR/
│   └── translation.json       # 한국어 번역
├── en-US/
│   └── translation.json       # 영어 번역
└── scripts/
    ├── manual-scan.cjs        # 수동 스캔 스크립트
    ├── upload.cjs             # 구글 스프레드시트 업로드
    ├── download.cjs           # 구글 스프레드시트 다운로드
    └── utils.ts               # 유틸리티 함수
```
