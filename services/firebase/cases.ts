import type { CaseAnalysis } from "@/domain/analysis";
import type { CaseId, CaseRecord } from "@/domain/case";
import type { ChatMessage } from "@/domain/chat";
import type { ProblemDescription, UploadedDocument } from "@/domain/document";
import { fileToBase64, MAX_ANALYZE_BYTES, rememberCaseFile } from "@/lib/blobCache";
import { getFirebaseAuth, getFirebaseStorage, getFirestoreDb } from "@/lib/firebase/client";
import type { AnalysisService, CaseRepository, CreateCaseInput, ChatService, DocumentService } from "@/services/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function unavailable(): { ok: false; code: "unavailable"; message: string } {
  return { ok: false, code: "unavailable", message: "Firebase is not configured." };
}

export const firebaseCaseRepository: CaseRepository = {
  async listByCitizen(citizenId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDocs(
      query(collection(db, "cases"), where("citizenId", "==", citizenId)),
    );
    const rows = snap.docs
      .map((d) => d.data() as CaseRecord)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return { ok: true, data: rows };
  },
  async getById(caseId: CaseId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDoc(doc(db, "cases", caseId));
    if (!snap.exists()) {
      return { ok: false, code: "not_found", message: "This case was not found." };
    }
    return { ok: true, data: snap.data() as CaseRecord };
  },
  async createDraft(citizenId, input: CreateCaseInput) {
    const db = getFirestoreDb();
    const auth = getFirebaseAuth();
    if (!db || !auth?.currentUser) return unavailable();
    const createdAt = new Date().toISOString();
    const refDoc = doc(collection(db, "cases"));
    const record: CaseRecord = {
      id: refDoc.id,
      citizenId,
      title: input.title.trim() || "Untitled case",
      category: input.category,
      source: input.source,
      status: "processing",
      createdAt,
      updatedAt: createdAt,
      location: { city: input.city, state: input.state },
      isDemo: false,
    };
    await setDoc(refDoc, record);

    if (input.description) {
      await setDoc(doc(db, "cases", record.id, "meta", "description"), {
        ...input.description,
        caseId: record.id,
      });
    }

    if (input.document) {
      let previewUrl = input.document.previewUrl;
      let uploadStatus: UploadedDocument["uploadStatus"] = "local_only";
      const storage = getFirebaseStorage();
      if (input.document.file && storage) {
        if (input.document.file.size > MAX_ANALYZE_BYTES) {
          return { ok: false, code: "invalid", message: "Please choose a file under 4 MB." };
        }
        const path = `users/${citizenId}/cases/${record.id}/${input.document.fileName}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, input.document.file);
        previewUrl = await getDownloadURL(storageRef);
        uploadStatus = "uploaded";
        const base64 = await fileToBase64(input.document.file);
        rememberCaseFile(record.id, {
          fileName: input.document.fileName,
          mimeType: input.document.mimeType,
          byteSize: input.document.byteSize,
          base64,
        });
      } else if (input.document.file) {
        const base64 = await fileToBase64(input.document.file);
        rememberCaseFile(record.id, {
          fileName: input.document.fileName,
          mimeType: input.document.mimeType,
          byteSize: input.document.byteSize,
          base64,
        });
      }
      await setDoc(doc(db, "cases", record.id, "meta", "document"), {
        id: `doc-${record.id}`,
        caseId: record.id,
        fileName: input.document.fileName,
        mimeType: input.document.mimeType,
        byteSize: input.document.byteSize,
        kind: input.document.kind,
        previewUrl,
        uploadStatus,
      } satisfies UploadedDocument);
    }

    return { ok: true, data: record };
  },
  async updateStatus(caseId, status) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, "cases", caseId), { status, updatedAt, serverUpdatedAt: serverTimestamp() });
    const snap = await getDoc(doc(db, "cases", caseId));
    if (!snap.exists()) {
      return { ok: false, code: "not_found", message: "This case was not found." };
    }
    return { ok: true, data: snap.data() as CaseRecord };
  },
};

export const firebaseDocumentService: DocumentService = {
  async getByCaseId(caseId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDoc(doc(db, "cases", caseId, "meta", "document"));
    return { ok: true, data: snap.exists() ? (snap.data() as UploadedDocument) : null };
  },
  async getDescription(caseId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDoc(doc(db, "cases", caseId, "meta", "description"));
    return { ok: true, data: snap.exists() ? (snap.data() as ProblemDescription) : null };
  },
};

export const firebaseAnalysisService: AnalysisService = {
  async getAnalysis(caseId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDoc(doc(db, "cases", caseId, "meta", "analysis"));
    if (!snap.exists()) {
      return { ok: false, code: "not_found", message: "No explanation is ready for this case yet." };
    }
    return { ok: true, data: snap.data() as CaseAnalysis };
  },
  async startProcessing(caseId) {
    return this.getAnalysis(caseId);
  },
  async saveAnalysis(analysis) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    await setDoc(doc(db, "cases", analysis.caseId, "meta", "analysis"), analysis);
    return { ok: true, data: analysis };
  },
};

export const firebaseChatService: ChatService = {
  async list(caseId) {
    const db = getFirestoreDb();
    if (!db) return unavailable();
    const snap = await getDocs(collection(db, "cases", caseId, "messages"));
    const rows = snap.docs
      .map((d) => d.data() as ChatMessage)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return { ok: true, data: rows };
  },
  async send() {
    return { ok: false, code: "unavailable", message: "Use the Gemini chat client to send messages." };
  },
};

export async function appendFirebaseMessages(caseId: string, messages: ChatMessage[]) {
  const db = getFirestoreDb();
  if (!db) return;
  for (const message of messages) {
    await addDoc(collection(db, "cases", caseId, "messages"), message);
  }
}
