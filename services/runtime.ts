import { firebaseReady } from "@/lib/features";
import { firebaseAuthService } from "@/services/firebase/auth";
import {
  firebaseAnalysisService,
  firebaseCaseRepository,
  firebaseChatService,
  firebaseDocumentService,
} from "@/services/firebase/cases";
import { mockAnalysisService } from "@/services/mock/analysis";
import { mockAuthService } from "@/services/mock/auth";
import { mockCaseRepository, mockDocumentService } from "@/services/mock/cases";
import { mockChatService } from "@/services/mock/chat";
import { mockLawyerRepository } from "@/services/mock/lawyers";

export function authImpl() {
  return firebaseReady() ? firebaseAuthService : mockAuthService;
}

export function caseRepo() {
  return firebaseReady() ? firebaseCaseRepository : mockCaseRepository;
}

export function documentRepo() {
  return firebaseReady() ? firebaseDocumentService : mockDocumentService;
}

export function analysisPersistence() {
  return firebaseReady() ? firebaseAnalysisService : mockAnalysisService;
}

export function chatPersistence() {
  return firebaseReady() ? firebaseChatService : mockChatService;
}

export function lawyerRepo() {
  return mockLawyerRepository;
}
