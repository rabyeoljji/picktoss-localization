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
import { InstallInducePage } from '@/pages/install-induce-page'
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
              <Route path={RoutePath.root.pathname} element={<HomePage />} />

              {/* Note */}
              <Route path={RoutePath.notes.pathname}>
                <Route index element={<NotesPage />} />
                <Route path={RoutePath.noteDetail.pathname} element={<NoteDetailPage />} />
                <Route path={RoutePath.noteQuiz.pathname} element={<NoteQuizPage />} />
                <Route path={RoutePath.noteArrange.pathname} element={<NoteArrangePage />} />
                <Route path={RoutePath.noteSearch.pathname} element={<NoteSearchPage />} />
                <Route path={RoutePath.noteEdit.pathname} element={<NoteEditPage />} />
                <Route path={RoutePath.noteWrite.pathname} element={<NoteWritePage />} />
                <Route path={RoutePath.noteUpload.pathname} element={<NoteUploadPage />} />
              </Route>

              {/* Account */}
              <Route path={RoutePath.account.pathname}>
                <Route index element={<AccountPage />} />
                <Route path={RoutePath.accountInfo.pathname} element={<AccountInfoPage />} />
                <Route path={RoutePath.dailyQuizAttendance.pathname} element={<DailyQuizAttendancePage />} />
                <Route path={RoutePath.quizAnalysis.pathname} element={<QuizAnalysisPage />} />
                <Route path={RoutePath.quizRecord.pathname} element={<QuizRecordPage />} />
                <Route path={RoutePath.notificationConfig.pathname} element={<NotificationConfigPage />} />
                <Route path={RoutePath.paymentHistory.pathname} element={<PaymentHistoryPage />} />
                <Route path={RoutePath.notice.pathname} element={<NoticePage />} />
                <Route path={RoutePath.contact.pathname} element={<ContactPage />} />
                <Route path={RoutePath.faq.pathname} element={<FaQPage />} />
                <Route path={RoutePath.policy.pathname} element={<PolicyPage />} />
                <Route path={RoutePath.withdraw.pathname} element={<WithdrawPage />} />
              </Route>

              {/* Theme Quiz */}
              <Route>
                <Route path={RoutePath.randomQuiz.pathname} element={<RandomQuizPage />} />
                <Route path={RoutePath.bombQuiz.pathname} element={<BombQuizPage />} />
              </Route>
            </Route>

            {/* 컬렉션 */}
            <Route path={RoutePath.collections.pathname}>
              <Route index element={<CollectionsPage />} />
              <Route path={RoutePath.collectionDetail.pathname} element={<CollectionDetailPage />} />
              <Route path={RoutePath.collectionQuiz.pathname} element={<CollectionQuizPage />} />
              <Route path={RoutePath.collectionComplain.pathname} element={<CollectionComplainPage />} />
              <Route path={RoutePath.collectionCreate.pathname} element={<CollectionCreatePage />} />
              <Route path={RoutePath.collectionEditInfo.pathname} element={<CollectionEditInfoPage />} />
              <Route path={RoutePath.collectionEditQuiz.pathname} element={<CollectionEditQuizPage />} />
              <Route path={RoutePath.collectionSearch.pathname} element={<CollectionSearchPage />} />
            </Route>

            {/* Install Induce */}
            <Route path={RoutePath.installInduce.pathname} element={<InstallInducePage />} />
          </Route>
          {/* Auth */}
          <Route path={RoutePath.login.pathname} element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
