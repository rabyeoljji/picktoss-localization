import { Route, Routes, BrowserRouter } from "react-router"
import { AuthLayout } from "../layout/auth-layout"
import { LoginPage } from "@/pages/auth/login-page"
import { PWAOnlyMobileLayout } from "../layout/pwa-only-mobile-layout"
import { RootLayout } from "../layout/root-layout"
import { HomePage } from "@/pages/home-page"
import { AppRoutes } from "@/app/routes/config"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
            <Route element={<PWAOnlyMobileLayout />}>
              {/* 홈 */}
              <Route index element={<HomePage />} />

              {/* 퀴즈 노트 */}
              <Route path={AppRoutes.notes}>
                <Route index element={<div>노트 리스트</div>} />
                <Route
                  path={AppRoutes.noteDetail()}
                  element={<div>노트 상세</div>}
                />
                <Route
                  path={AppRoutes.noteQuiz()}
                  element={<div>노트 퀴즈</div>}
                />
                <Route
                  path={AppRoutes.noteArrange()}
                  element={<div>노트 목록 정리</div>}
                />
                <Route
                  path={AppRoutes.noteSearch}
                  element={<div>노트 검색</div>}
                />
                <Route
                  path={AppRoutes.noteEdit()}
                  element={<div>노트 수정</div>}
                />
                <Route
                  path={AppRoutes.noteWrite}
                  element={<div>노트 작성</div>}
                />
                <Route
                  path={AppRoutes.noteUpload}
                  element={<div>노트 업로드</div>}
                />
              </Route>

              {/* 마이 */}
              <Route path={AppRoutes.account}>
                <Route index element={<div>마이 메인</div>} />
                <Route
                  path={AppRoutes.accountInfo}
                  element={<div>계정 정보</div>}
                />
                <Route
                  path={AppRoutes.dailyQuizAttendance}
                  element={<div>오늘의 퀴즈 출석 현황</div>}
                />
                <Route
                  path={AppRoutes.quizAnalysis}
                  element={<div>퀴즈 분석</div>}
                />
                <Route
                  path={AppRoutes.quizRecord}
                  element={<div>퀴즈 기록</div>}
                />
                <Route
                  path={AppRoutes.notificationConfig}
                  element={<div>알림 설정</div>}
                />
                <Route
                  path={AppRoutes.paymentHistory}
                  element={<div>구독/결제 내역</div>}
                />
                <Route path={AppRoutes.notice} element={<div>공지사항</div>} />
                <Route path={AppRoutes.contact} element={<div>문의하기</div>} />
                <Route
                  path={AppRoutes.faq}
                  element={<div>자주 묻는 질문</div>}
                />
                <Route
                  path={AppRoutes.policy}
                  element={<div>정책 및 이용약관</div>}
                />
                <Route
                  path={AppRoutes.withdraw}
                  element={<div>탈퇴하기</div>}
                />
              </Route>

              <Route path={AppRoutes.randomQuiz}>
                <Route index element={<div>랜덤 퀴즈</div>} />
              </Route>

              <Route path={AppRoutes.bombQuiz}>
                <Route index element={<div>오답 터뜨리기</div>} />
              </Route>
            </Route>

            {/* 컬렉션 */}
            <Route path={AppRoutes.collections}>
              <Route index element={<div>Collection</div>} />
              <Route
                path={AppRoutes.collectionDetail()}
                element={<div>Collection 상세</div>}
              />
              <Route
                path={AppRoutes.collectionQuiz()}
                element={<div>Collection 퀴즈</div>}
              />
              <Route
                path={AppRoutes.collectionComplain()}
                element={<div>Collection 신고</div>}
              />
              <Route
                path={AppRoutes.collectionCreate}
                element={<div>Collection 생성</div>}
              />
              <Route
                path={AppRoutes.collectionEditInfo()}
                element={<div>Collection 정보 수정</div>}
              />
              <Route
                path={AppRoutes.collectionEditQuiz()}
                element={<div>Collection 문저 편집 & 추가</div>}
              />
              <Route
                path={AppRoutes.collectionSearch}
                element={<div>Collection 검색</div>}
              />
            </Route>
          </Route>

          <Route path={AppRoutes.login} element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
