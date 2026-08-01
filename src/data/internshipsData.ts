import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";


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

export function getLocalPostings(): InternshipPosting[] {
  try {
    const raw = localStorage.getItem(STORAGE_POSTINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalPostings(postings: InternshipPosting[]) {
  localStorage.setItem(STORAGE_POSTINGS_KEY, JSON.stringify(postings));
}

export function getLocalApplications(): AttachmentApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalApplications(applications: AttachmentApplication[]) {
  localStorage.setItem(STORAGE_APPLICATIONS_KEY, JSON.stringify(applications));
}

// Map database row to InternshipPosting model
function mapPostingRow(row: any): InternshipPosting {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    type: row.type as InternshipPosting["type"],
    location: row.location || "Nairobi, Kenya",
    duration: row.duration || "3 Months",
    description: row.description,
    requirements: row.requirements || [],
    responsibilities: row.responsibilities || [],
    slots: row.slots ?? 1,
    deadline: row.deadline,
    isOpen: row.is_open ?? true,
    postedAt: row.posted_at ? new Date(row.posted_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

// Map database row to AttachmentApplication model
function mapApplicationRow(row: any): AttachmentApplication {
  return {
    id: row.id,
    referenceId: row.reference_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    institution: row.institution,
    fieldOfStudy: row.field_of_study,
    qualificationLevel: row.qualification_level as AttachmentApplication["qualificationLevel"],
    positionId: row.position_id,
    positionTitle: row.position_title,
    type: row.type as AttachmentApplication["type"],
    preferredStartDate: row.preferred_start_date || "",
    durationMonths: row.duration_months ?? 3,
    resumeUrl: row.resume_url,
    recommendationLetterUrl: row.recommendation_letter_url || "",
    portfolioUrl: row.portfolio_url || "",
    coverNote: row.cover_note || "",
    status: (row.status as AttachmentApplication["status"]) || "Received",
    adminNotes: row.admin_notes || "",
    appliedAt: row.applied_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// --- ASYNC API FUNCTIONS WITH DB & LOCAL FALLBACK ---

export async function getStoredPostings(): Promise<InternshipPosting[]> {
  try {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("posted_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase job_postings fetch error/offline, using localStorage:", error?.message);
      return getLocalPostings();
    }

    const postings = data.map(mapPostingRow);
    saveLocalPostings(postings);
    return postings;
  } catch (err) {
    console.error("Error fetching job postings from Supabase:", err);
    return getLocalPostings();
  }
}

export async function addPosting(data: Omit<InternshipPosting, "id" | "postedAt">): Promise<InternshipPosting> {
  const newId = `post-${Date.now()}`;
  const postedAtStr = new Date().toISOString();

  const newPosting: InternshipPosting = {
    ...data,
    id: newId,
    postedAt: postedAtStr.split("T")[0],
  };

  // Update local storage immediately for responsive UI
  const localCurrent = getLocalPostings();
  saveLocalPostings([newPosting, ...localCurrent]);

  try {
    const { error } = await supabase.from("job_postings").insert({
      id: newId,
      title: data.title,
      department: data.department,
      type: data.type,
      location: data.location,
      duration: data.duration,
      description: data.description,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      slots: data.slots,
      deadline: data.deadline,
      is_open: data.isOpen,
      created_at: postedAtStr,
    });


    if (error) {
      console.error("Failed to insert job posting into Supabase:", error.message);
    }
  } catch (err) {
    console.error("Supabase insert error:", err);
  }

  return newPosting;
}

export async function editPosting(id: string, changes: Partial<InternshipPosting>): Promise<InternshipPosting | null> {
  const localCurrent = getLocalPostings();
  const idx = localCurrent.findIndex((p) => p.id === id);
  if (idx !== -1) {
    localCurrent[idx] = { ...localCurrent[idx], ...changes };
    saveLocalPostings(localCurrent);
  }

  try {
    const dbChanges: Database["public"]["Tables"]["job_postings"]["Update"] = {};
    if (changes.title !== undefined) dbChanges.title = changes.title;
    if (changes.department !== undefined) dbChanges.department = changes.department;
    if (changes.type !== undefined) dbChanges.type = changes.type;
    if (changes.location !== undefined) dbChanges.location = changes.location;
    if (changes.duration !== undefined) dbChanges.duration = changes.duration;
    if (changes.description !== undefined) dbChanges.description = changes.description;
    if (changes.requirements !== undefined) dbChanges.requirements = changes.requirements;
    if (changes.responsibilities !== undefined) dbChanges.responsibilities = changes.responsibilities;
    if (changes.slots !== undefined) dbChanges.slots = changes.slots;
    if (changes.deadline !== undefined) dbChanges.deadline = changes.deadline;
    if (changes.isOpen !== undefined) dbChanges.is_open = changes.isOpen;

    const { error } = await supabase.from("job_postings").update(dbChanges).eq("id", id);
    if (error) console.error("Failed to update job posting in Supabase:", error.message);
  } catch (err) {
    console.error("Supabase update error:", err);
  }

  return idx !== -1 ? localCurrent[idx] : null;
}

export async function deletePosting(id: string): Promise<boolean> {
  const localCurrent = getLocalPostings();
  const filtered = localCurrent.filter((p) => p.id !== id);
  saveLocalPostings(filtered);

  try {
    const { error } = await supabase.from("job_postings").delete().eq("id", id);
    if (error) console.error("Failed to delete job posting from Supabase:", error.message);
  } catch (err) {
    console.error("Supabase delete error:", err);
  }

  return true;
}

export async function getStoredApplications(): Promise<AttachmentApplication[]> {
  try {
    const { data, error } = await supabase
      .from("attachment_applications")
      .select("*")
      .order("applied_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase applications fetch error, using localStorage:", error?.message);
      return getLocalApplications();
    }

    const apps = data.map(mapApplicationRow);
    saveLocalApplications(apps);
    return apps;
  } catch (err) {
    console.error("Error fetching applications from Supabase:", err);
    return getLocalApplications();
  }
}

export async function submitApplication(
  data: Omit<AttachmentApplication, "id" | "referenceId" | "appliedAt" | "updatedAt" | "status">
): Promise<AttachmentApplication> {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const prefix = data.type === "Attachment" ? "ZTECH-ATT" : data.type === "Internship" ? "ZTECH-INT" : "ZTECH-APR";
  const referenceId = `${prefix}-${randNum}`;
  const newId = `app-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const newApp: AttachmentApplication = {
    ...data,
    id: newId,
    referenceId,
    status: "Received",
    appliedAt: nowIso,
    updatedAt: nowIso,
  };

  const localCurrent = getLocalApplications();
  saveLocalApplications([newApp, ...localCurrent]);

  try {
    const { error } = await supabase.from("attachment_applications").insert({
      id: newId,
      reference_id: referenceId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      institution: data.institution,
      field_of_study: data.fieldOfStudy,
      qualification_level: data.qualificationLevel,
      position_id: data.positionId,
      position_title: data.positionTitle,
      type: data.type,
      preferred_start_date: data.preferredStartDate,
      duration_months: data.durationMonths,
      resume_url: data.resumeUrl,
      recommendation_letter_url: data.recommendationLetterUrl || null,
      portfolio_url: data.portfolioUrl || null,
      cover_note: data.coverNote,
      status: "Received",
      applied_at: nowIso,
      updated_at: nowIso,
    });

    if (error) console.error("Failed to insert application into Supabase:", error.message);
  } catch (err) {
    console.error("Supabase application insert error:", err);
  }

  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: AttachmentApplication["status"],
  adminNotes?: string
): Promise<AttachmentApplication | null> {
  const localCurrent = getLocalApplications();
  const index = localCurrent.findIndex((a) => a.id === id);
  const nowIso = new Date().toISOString();

  if (index !== -1) {
    localCurrent[index] = {
      ...localCurrent[index],
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : localCurrent[index].adminNotes,
      updatedAt: nowIso,
    };
    saveLocalApplications(localCurrent);
  }

  try {
    const { error } = await supabase
      .from("attachment_applications")
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: nowIso,
      })
      .eq("id", id);

    if (error) console.error("Failed to update application status in Supabase:", error.message);
  } catch (err) {
    console.error("Supabase application update error:", err);
  }

  return index !== -1 ? localCurrent[index] : null;
}

export async function deleteApplication(id: string): Promise<boolean> {
  const localCurrent = getLocalApplications();
  const filtered = localCurrent.filter((a) => a.id !== id);
  saveLocalApplications(filtered);

  try {
    const { error } = await supabase.from("attachment_applications").delete().eq("id", id);
    if (error) console.error("Failed to delete application from Supabase:", error.message);
  } catch (err) {
    console.error("Supabase application delete error:", err);
  }

  return true;
}
