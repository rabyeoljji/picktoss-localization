import { Route, Routes, BrowserRouter } from "react-router"
import { AuthLayout } from "../layout/auth-layout"
import { LoginPage } from "@/pages/auth"
import { PWAOnlyMobileLayout } from "../layout/pwa-only-mobile-layout"
import { RootLayout } from "../layout/root-layout"
import { HomePage } from "@/pages/home-page"
import { AppRoutes } from "@/app/routes/config"
import { BombQuizPage, RandomQuizPage } from "@/pages/theme-quiz"
import {
  NoteArrangePage,
  NoteDetailPage,
  NoteEditPage,
  NoteQuizPage,
  NoteSearchPage,
  NotesPage,
  NoteUploadPage,
  NoteWritePage,
} from "@/pages/note"
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
} from "@/pages/account"
import {
  CollectionComplainPage,
  CollectionCreatePage,
  CollectionDetailPage,
  CollectionEditInfoPage,
  CollectionEditQuizPage,
  CollectionQuizPage,
  CollectionSearchPage,
  CollectionsPage,
} from "@/pages/collection"

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<AuthLayout />}>
            {/* PC에서는 항상 접근 가능하지만 모바일에서는 PWA로만 접근 가능하게 하는 Layout */}
            <Route element={<PWAOnlyMobileLayout />}>
              {/* Home */}
              <Route index element={<HomePage />} />

              {/* Note */}
              <Route path={AppRoutes.notes}>
                <Route index element={<NotesPage />} />
                <Route path={AppRoutes.noteDetail()} element={<NoteDetailPage />} />
                <Route path={AppRoutes.noteQuiz()} element={<NoteQuizPage />} />
                <Route path={AppRoutes.noteArrange()} element={<NoteArrangePage />} />
                <Route path={AppRoutes.noteSearch} element={<NoteSearchPage />} />
                <Route path={AppRoutes.noteEdit()} element={<NoteEditPage />} />
                <Route path={AppRoutes.noteWrite} element={<NoteWritePage />} />
                <Route path={AppRoutes.noteUpload} element={<NoteUploadPage />} />
              </Route>

              {/* Account */}
              <Route path={AppRoutes.account}>
                <Route index element={<AccountPage />} />
                <Route path={AppRoutes.accountInfo} element={<AccountInfoPage />} />
                <Route path={AppRoutes.dailyQuizAttendance} element={<DailyQuizAttendancePage />} />
                <Route path={AppRoutes.quizAnalysis} element={<QuizAnalysisPage />} />
                <Route path={AppRoutes.quizRecord} element={<QuizRecordPage />} />
                <Route path={AppRoutes.notificationConfig} element={<NotificationConfigPage />} />
                <Route path={AppRoutes.paymentHistory} element={<PaymentHistoryPage />} />
                <Route path={AppRoutes.notice} element={<NoticePage />} />
                <Route path={AppRoutes.contact} element={<ContactPage />} />
                <Route path={AppRoutes.faq} element={<FaQPage />} />
                <Route path={AppRoutes.policy} element={<PolicyPage />} />
                <Route path={AppRoutes.withdraw} element={<WithdrawPage />} />
              </Route>

              {/* Theme Quiz */}
              <Route>
                <Route path={AppRoutes.randomQuiz} element={<RandomQuizPage />} />
                <Route path={AppRoutes.bombQuiz} element={<BombQuizPage />} />
              </Route>
            </Route>

            {/* 컬렉션 */}
            <Route path={AppRoutes.collections}>
              <Route index element={<CollectionsPage />} />
              <Route path={AppRoutes.collectionDetail()} element={<CollectionDetailPage />} />
              <Route path={AppRoutes.collectionQuiz()} element={<CollectionQuizPage />} />
              <Route path={AppRoutes.collectionComplain()} element={<CollectionComplainPage />} />
              <Route path={AppRoutes.collectionCreate} element={<CollectionCreatePage />} />
              <Route path={AppRoutes.collectionEditInfo()} element={<CollectionEditInfoPage />} />
              <Route path={AppRoutes.collectionEditQuiz()} element={<CollectionEditQuizPage />} />
              <Route path={AppRoutes.collectionSearch} element={<CollectionSearchPage />} />
            </Route>

            {/* Auth */}
            <Route path={AppRoutes.login} element={<LoginPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
