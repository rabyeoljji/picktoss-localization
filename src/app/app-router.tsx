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
import { FeedbackCompletePage } from '@/pages/account/feedback-complete-page'
import FeedbackPage from '@/pages/account/feedback-page'
import { LoginPage } from '@/pages/auth'
import {
  ExploreComplainPage,
  ExploreDetailPage,
  ExplorePage,
  ExploreQuizPage,
  ExploreSearchPage,
} from '@/pages/explore'
import ExploreReleasePage from '@/pages/explore/explore-release-page'
import HomePage from '@/pages/home-page'
import { InstallGuidePage } from '@/pages/install-guide-page'
import InviteLoginPage from '@/pages/invite/invite-login-page'
import InvitePage from '@/pages/invite/invite-page'
import { LibraryPage, LibrarySearchPage, NoteDetailPage, NoteEditPage, NoteQuizPage } from '@/pages/library'
import { NoteCreatePage } from '@/pages/note-create'
import { ProgressQuizPage } from '@/pages/progress-quiz-page'
import QuizLoadingPage from '@/pages/quiz-loading-page'
import QuizResultPage from '@/pages/quiz-result-page'
import SearchPage from '@/pages/search-page'
import { BombQuizPage, RandomQuizPage } from '@/pages/theme-quiz'

import { AuthLayout } from '@/app/layout/auth-layout'
import { PWAOnlyMobileLayout } from '@/app/layout/pwa-only-mobile-layout'
import { RootLayout } from '@/app/layout/root-layout'
import NotFound from '@/app/not-found'

import { RoutePath } from '@/shared/lib/router'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            {/* 404 */}
            <Route path="*" element={<NotFound />} />

            {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
            <Route element={<PWAOnlyMobileLayout />}>
              {/* Home */}
              <Route path={RoutePath.root} element={<HomePage />} />
              <Route path={RoutePath.search} element={<SearchPage />} />

              {/* Note Create 노트 생성 */}
              <Route path={RoutePath.noteCreate} element={<NoteCreatePage />} />

              {/* Library */}
              <Route path={RoutePath.library}>
                <Route index element={<LibraryPage />} />
                <Route path={RoutePath.librarySearch} element={<LibrarySearchPage />} />
                <Route path={RoutePath.libraryNoteDetail} element={<NoteDetailPage />} />
                <Route path={RoutePath.libraryNoteQuiz} element={<NoteQuizPage />} />
                <Route path={RoutePath.libraryNoteEdit} element={<NoteEditPage />} />
              </Route>

              {/* Account */}
              <Route path={RoutePath.account}>
                <Route index element={<AccountPage />} />
                <Route path={RoutePath.accountInfo} element={<AccountInfoPage />} />
                <Route path={RoutePath.accountDailyQuizAttendance} element={<DailyQuizAttendancePage />} />
                <Route path={RoutePath.accountQuizAnalysis} element={<QuizAnalysisPage />} />
                <Route path={RoutePath.accountQuizRecord} element={<QuizRecordPage />} />
                <Route path={RoutePath.accountNotificationConfig} element={<NotificationConfigPage />} />
                <Route path={RoutePath.accountPaymentHistory} element={<PaymentHistoryPage />} />
                <Route path={RoutePath.accountNotice} element={<NoticePage />} />
                <Route path={RoutePath.accountContact} element={<ContactPage />} />
                <Route path={RoutePath.accountFaq} element={<FaQPage />} />
                <Route path={RoutePath.accountPolicy} element={<PolicyPage />} />
                <Route path={RoutePath.accountWithdraw} element={<WithdrawPage />} />
                <Route path={RoutePath.accountFeedback} element={<FeedbackPage />} />
                <Route path={RoutePath.accountFeedbackComplete} element={<FeedbackCompletePage />} />
              </Route>

              {/* Theme Quiz */}
              <Route>
                <Route path={RoutePath.progressQuiz} element={<ProgressQuizPage />} />
                <Route path={RoutePath.randomQuiz} element={<RandomQuizPage />} />
                <Route path={RoutePath.bombQuiz} element={<BombQuizPage />} />
                <Route path={RoutePath.quizResult} element={<QuizResultPage />} />
              </Route>
            </Route>

            {/* Explore */}
            <Route path={RoutePath.explore}>
              <Route index element={<ExplorePage />} />
              <Route path={RoutePath.exploreQuiz} element={<ExploreQuizPage />} />
              <Route path={RoutePath.exploreQuizDetail} element={<ExploreDetailPage />} />
              <Route path={RoutePath.exploreQuizComplain} element={<ExploreComplainPage />} />
              <Route path={RoutePath.exploreRelease} element={<ExploreReleasePage />} />
              <Route path={RoutePath.exploreSearch} element={<ExploreSearchPage />} />
            </Route>
          </Route>

          {/* Invite */}
          <Route path={RoutePath.invite} element={<InvitePage />} />
          <Route path={RoutePath.inviteLogin} element={<InviteLoginPage />} />

          {/* Auth */}
          <Route path={RoutePath.login} element={<LoginPage />} />
          {/* Install Induce */}
          <Route path={RoutePath.installGuide} element={<InstallGuidePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
