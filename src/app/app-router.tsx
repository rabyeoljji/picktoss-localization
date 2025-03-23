import { BrowserRouter, Route, Routes } from 'react-router'

import {
  AccountInfoPage,
  AccountPage,
  ContactPage,
  DailyQuizAttendancePage,
  FaQPage,
  NoticePage,
  NotificationConfigPage,
  PaymentHistoryPage,
  PolicyPage,
  QuizAnalysisPage,
  QuizRecordPage,
  WithdrawPage,
} from '@/pages/account'
import { FeedbackPage } from '@/pages/account/feedback-page'
import { LoginPage } from '@/pages/auth'
import {
  CollectionComplainPage,
  CollectionCreatePage,
  CollectionDetailPage,
  CollectionEditInfoPage,
  CollectionEditQuizPage,
  CollectionQuizPage,
  CollectionSearchPage,
  CollectionsPage,
} from '@/pages/collection'
import HomePage from '@/pages/home-page'
import { InstallGuidePage } from '@/pages/install-guide-page'
import {
  NoteArrangePage,
  NoteDetailPage,
  NoteEditPage,
  NoteQuizPage,
  NoteSearchPage,
  NoteUploadPage,
  NoteWritePage,
  NotesPage,
} from '@/pages/note'
import { SearchPage } from '@/pages/search-page'
import { BombQuizPage, RandomQuizPage } from '@/pages/theme-quiz'

import { AuthLayout } from '@/app/layout/auth-layout'
import { PWAOnlyMobileLayout } from '@/app/layout/pwa-only-mobile-layout'
import { RootLayout } from '@/app/layout/root-layout'

import { RoutePath } from '@/shared/lib/router'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
            <Route element={<PWAOnlyMobileLayout />}>
              {/* Home */}
              <Route path={RoutePath.root} element={<HomePage />} />
              <Route path={RoutePath.search} element={<SearchPage />} />

              {/* Note */}
              <Route path={RoutePath.notes}>
                <Route index element={<NotesPage />} />
                <Route path={RoutePath.noteDetail} element={<NoteDetailPage />} />
                <Route path={RoutePath.noteQuiz} element={<NoteQuizPage />} />
                <Route path={RoutePath.noteArrange} element={<NoteArrangePage />} />
                <Route path={RoutePath.noteSearch} element={<NoteSearchPage />} />
                <Route path={RoutePath.noteEdit} element={<NoteEditPage />} />
                <Route path={RoutePath.noteWrite} element={<NoteWritePage />} />
                <Route path={RoutePath.noteUpload} element={<NoteUploadPage />} />
              </Route>

              {/* Account */}
              <Route path={RoutePath.account}>
                <Route index element={<AccountPage />} />
                <Route path={RoutePath.accountInfo} element={<AccountInfoPage />} />
                <Route path={RoutePath.dailyQuizAttendance} element={<DailyQuizAttendancePage />} />
                <Route path={RoutePath.quizAnalysis} element={<QuizAnalysisPage />} />
                <Route path={RoutePath.quizRecord} element={<QuizRecordPage />} />
                <Route path={RoutePath.notificationConfig} element={<NotificationConfigPage />} />
                <Route path={RoutePath.paymentHistory} element={<PaymentHistoryPage />} />
                <Route path={RoutePath.notice} element={<NoticePage />} />
                <Route path={RoutePath.contact} element={<ContactPage />} />
                <Route path={RoutePath.faq} element={<FaQPage />} />
                <Route path={RoutePath.policy} element={<PolicyPage />} />
                <Route path={RoutePath.withdraw} element={<WithdrawPage />} />
                <Route>
                  <Route path={RoutePath.feedback} element={<FeedbackPage />} />
                </Route>
              </Route>

              {/* Theme Quiz */}
              <Route>
                <Route path={RoutePath.randomQuiz} element={<RandomQuizPage />} />
                <Route path={RoutePath.bombQuiz} element={<BombQuizPage />} />
              </Route>
            </Route>

            {/* 컬렉션 */}
            <Route path={RoutePath.collections}>
              <Route index element={<CollectionsPage />} />
              <Route path={RoutePath.collectionDetail} element={<CollectionDetailPage />} />
              <Route path={RoutePath.collectionQuiz} element={<CollectionQuizPage />} />
              <Route path={RoutePath.collectionComplain} element={<CollectionComplainPage />} />
              <Route path={RoutePath.collectionCreate} element={<CollectionCreatePage />} />
              <Route path={RoutePath.collectionEditInfo} element={<CollectionEditInfoPage />} />
              <Route path={RoutePath.collectionEditQuiz} element={<CollectionEditQuizPage />} />
              <Route path={RoutePath.collectionSearch} element={<CollectionSearchPage />} />
            </Route>
          </Route>
          {/* Auth */}
          <Route path={RoutePath.login} element={<LoginPage />} />
          {/* Install Induce */}
          <Route path={RoutePath.installGuide} element={<InstallGuidePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
