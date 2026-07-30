export interface InternshipPosting {
  id: string;
  title: string;
  department: string;
  type: "Attachment" | "Internship" | "Apprenticeship";
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  slots: number;
  deadline: string;
  isOpen: boolean;
  postedAt: string;
}

export interface AttachmentApplication {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  fieldOfStudy: string;
  qualificationLevel: "Certificate" | "Diploma" | "Bachelor Degree" | "Master Degree" | "Self Taught / Other";
  positionId: string;
  positionTitle: string;
  type: "Attachment" | "Internship" | "Apprenticeship";
  preferredStartDate: string;
  durationMonths: number;
  resumeUrl: string;
  recommendationLetterUrl?: string;
  portfolioUrl?: string;
  coverNote: string;
  status: "Received" | "Under Review" | "Shortlisted" | "Interview Scheduled" | "Offered" | "Rejected";
  adminNotes?: string;
  appliedAt: string;
  updatedAt: string;
}

const STORAGE_POSTINGS_KEY = "ztech_internship_postings_v2";
const STORAGE_APPLICATIONS_KEY = "ztech_attachment_applications_v2";

export function getStoredPostings(): InternshipPosting[] {
  try {
    const raw = localStorage.getItem(STORAGE_POSTINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePostings(postings: InternshipPosting[]) {
  localStorage.setItem(STORAGE_POSTINGS_KEY, JSON.stringify(postings));
}

export function getStoredApplications(): AttachmentApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplications(applications: AttachmentApplication[]) {
  localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(applications));
}

export function addPosting(data: Omit<InternshipPosting, "id" | "postedAt">): InternshipPosting {
  const current = getStoredPostings();
  const newPosting: InternshipPosting = {
    ...data,
    id: `post-${Date.now()}`,
    postedAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newPosting, ...current];
  savePostings(updated);
  return newPosting;
}

export function editPosting(id: string, changes: Partial<InternshipPosting>): InternshipPosting | null {
  const current = getStoredPostings();
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...current[idx], ...changes };
  current[idx] = updated;
  savePostings(current);
  return updated;
}

export function deletePosting(id: string): boolean {
  const current = getStoredPostings();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length === current.length) return false;
  savePostings(filtered);
  return true;
}

export function submitApplication(data: Omit<AttachmentApplication, "id" | "referenceId" | "appliedAt" | "updatedAt" | "status">): AttachmentApplication {
  const currentApps = getStoredApplications();
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const prefix = data.type === "Attachment" ? "ZTECH-ATT" : data.type === "Internship" ? "ZTECH-INT" : "ZTECH-APR";
  const referenceId = `${prefix}-${randNum}`;

  const newApp: AttachmentApplication = {
    ...data,
    id: `app-${Date.now()}`,
    referenceId,
    status: "Received",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newApp, ...currentApps];
  saveApplications(updated);
  return newApp;
}

export function updateApplicationStatus(id: string, status: AttachmentApplication["status"], adminNotes?: string): AttachmentApplication | null {
  const currentApps = getStoredApplications();
  const index = currentApps.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updatedApp: AttachmentApplication = {
    ...currentApps[index],
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : currentApps[index].adminNotes,
    updatedAt: new Date().toISOString(),
  };

  currentApps[index] = updatedApp;
  saveApplications(currentApps);
  return updatedApp;
}

export function deleteApplication(id: string): boolean {
  const current = getStoredApplications();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;
  saveApplications(filtered);
  return true;
}
