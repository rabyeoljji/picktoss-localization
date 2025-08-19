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
  QuizRecordDailyDetailPage,
  QuizRecordPage,
  QuizRecordSetDetailPage,
  WithdrawPage,
} from '@/pages/account'
import { FeedbackCompletePage } from '@/pages/account/feedback-complete-page'
import FeedbackPage from '@/pages/account/feedback-page'
import MyStarPage from '@/pages/account/my-star-page'
import StarHistoryPage from '@/pages/account/star-history-page'
import { LoginPage } from '@/pages/auth'
import { ExploreComplainPage, ExplorePage, ExploreSearchPage } from '@/pages/explore'
import ExploreReleasePage from '@/pages/explore/explore-release-page'
import HomePage from '@/pages/home-page'
import { InstallGuidePage } from '@/pages/install-guide-page'
import InviteLoginPage from '@/pages/invite/invite-login-page'
import InvitePage from '@/pages/invite/invite-page'
import { LibraryPage, NoteEditPage, NoteQuizPage } from '@/pages/library'
import { NoteCreatePage } from '@/pages/note-create'
import { ProgressQuizPage } from '@/pages/progress-quiz-page'
import QuizDetailEditPage from '@/pages/quiz-detail/quiz-detail-edit-page'
import QuizDetailListPage from '@/pages/quiz-detail/quiz-detail-list-page'
import QuizDetailPage from '@/pages/quiz-detail/quiz-detail-page'
import SearchPage from '@/pages/search-page'

import { AuthLayout } from '@/app/layout/auth-layout'
import { PWAOnlyMobileLayout } from '@/app/layout/pwa-only-mobile-layout'
import { RewardLayout } from '@/app/layout/reward-layout'
import { RootLayout } from '@/app/layout/root-layout'
import NotFound from '@/app/not-found'

import { RoutePath } from '@/shared/lib/router'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<RewardLayout />}>
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
                  <Route path={RoutePath.accountQuizRecordDailyDetail} element={<QuizRecordDailyDetailPage />} />
                  <Route path={RoutePath.accountQuizRecordSetDetail} element={<QuizRecordSetDetailPage />} />
                  <Route path={RoutePath.accountNotificationConfig} element={<NotificationConfigPage />} />
                  <Route path={RoutePath.accountMyStar} element={<MyStarPage />} />
                  <Route path={RoutePath.accountStarHistory} element={<StarHistoryPage />} />
                  <Route path={RoutePath.accountPaymentHistory} element={<PaymentHistoryPage />} />
                  <Route path={RoutePath.accountNotice} element={<NoticePage />} />
                  <Route path={RoutePath.accountContact} element={<ContactPage />} />
                  <Route path={RoutePath.accountFaq} element={<FaQPage />} />
                  <Route path={RoutePath.accountPolicy} element={<PolicyPage />} />
                  <Route path={RoutePath.accountWithdraw} element={<WithdrawPage />} />
                  <Route path={RoutePath.accountFeedback} element={<FeedbackPage />} />
                  <Route path={RoutePath.accountFeedbackComplete} element={<FeedbackCompletePage />} />
                </Route>
              </Route>
            </Route>

            {/* Theme Quiz */}
            <Route>
              <Route path={RoutePath.progressQuiz} element={<ProgressQuizPage />} />
            </Route>

            {/* Explore */}
            <Route path={RoutePath.explore}>
              <Route index element={<ExplorePage />} />
              <Route path={RoutePath.exploreSearch} element={<ExploreSearchPage />} />

              <Route element={<AuthLayout />}>
                <Route element={<PWAOnlyMobileLayout />}>
                  <Route path={RoutePath.exploreComplain} element={<ExploreComplainPage />} />
                  <Route path={RoutePath.exploreRelease} element={<ExploreReleasePage />} />
                </Route>
              </Route>
            </Route>

            <Route path={RoutePath.quizDetail} element={<QuizDetailPage />} />
            <Route path={RoutePath.quizDetailEdit} element={<QuizDetailEditPage />} />
            <Route path={RoutePath.quizDetailList} element={<QuizDetailListPage />} />

            {/* Invite */}
            <Route path={RoutePath.invite} element={<InvitePage />} />
            <Route path={RoutePath.inviteLogin} element={<InviteLoginPage />} />

            {/* Install Induce */}
            <Route path={RoutePath.installGuide} element={<InstallGuidePage />} />

            {/* Auth */}
            <Route path={RoutePath.login} element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
