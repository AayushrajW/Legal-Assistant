import { geminiAnalysisService, geminiChatService } from "@/services/gemini/client";
import { fallbackAnalysisService } from "@/services/analysis/fallback";
import { geminiReady } from "@/lib/features";
import { mockChatService } from "@/services/mock/chat";
import {
  authImpl,
  caseRepo,
  documentRepo,
  lawyerRepo,
} from "@/services/runtime";
import type {
  AnalysisService,
  AuthService,
  CaseRepository,
  ChatService,
  DocumentService,
  LawyerRepository,
} from "@/services/types";

export const authService: AuthService = authImpl();
export const caseRepository: CaseRepository = caseRepo();
export const documentService: DocumentService = documentRepo();
export const lawyerRepository: LawyerRepository = lawyerRepo();

export const analysisService: AnalysisService = geminiReady()
  ? geminiAnalysisService
  : fallbackAnalysisService;

export const chatService: ChatService = geminiReady() ? geminiChatService : mockChatService;
