import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  FileText,
  Briefcase,
  Plus,
  Eye,
  Mail,
  Phone,
  BookOpen,
  Sparkles,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Inbox,
  X,
  MapPin,
  Users as UsersIcon,
  Calendar,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getStoredApplications,
  updateApplicationStatus,
  deleteApplication,
  getStoredPostings,
  addPosting,
  editPosting,
  deletePosting,
  AttachmentApplication,
  InternshipPosting
} from "@/data/internshipsData";

export default function AdminInternships() {
  const [activeTab, setActiveTab] = useState<"applications" | "postings">("postings");

  // Applications state
  const [applications, setApplications] = useState<AttachmentApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Selected Application detail
  const [selectedApp, setSelectedApp] = useState<AttachmentApplication | null>(null);
  const [editStatus, setEditStatus] = useState<AttachmentApplication["status"]>("Received");
  const [adminNotes, setAdminNotes] = useState("");

  // Postings state
  const [postings, setPostings] = useState<InternshipPosting[]>([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  // Posting form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formType, setFormType] = useState<InternshipPosting["type"]>("Attachment");
  const [formLocation, setFormLocation] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRequirements, setFormRequirements] = useState("");
  const [formResponsibilities, setFormResponsibilities] = useState("");
  const [formSlots, setFormSlots] = useState<number>(1);
  const [formDeadline, setFormDeadline] = useState("");

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setApplications(getStoredApplications());
    setPostings(getStoredPostings());
  };

  // ---- Posting CRUD ----

  const resetPostForm = () => {
    setFormTitle("");
    setFormDept("");
    setFormType("Attachment");
    setFormLocation("");
    setFormDuration("");
    setFormDescription("");
    setFormRequirements("");
    setFormResponsibilities("");
    setFormSlots(1);
    setFormDeadline("");
  };

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim() || !formDept.trim() || !formDeadline) {
      toast.error("Please fill in all required fields (Title, Department, Description, Deadline).");
      return;
    }

    addPosting({
      title: formTitle.trim(),
      department: formDept.trim(),
      type: formType,
      location: formLocation.trim() || "Nairobi, Kenya",
      duration: formDuration.trim() || "3 Months",
      description: formDescription.trim(),
      requirements: formRequirements.split("\n").map(s => s.trim()).filter(Boolean),
      responsibilities: formResponsibilities.split("\n").map(s => s.trim()).filter(Boolean),
      slots: formSlots,
      deadline: formDeadline,
      isOpen: true,
    });

    toast.success(`"${formTitle}" has been published and is now visible on the Careers page!`);
    resetPostForm();
    setIsPostFormOpen(false);
    refreshData();
  };

  const handleToggleOpen = (id: string, currentlyOpen: boolean) => {
    editPosting(id, { isOpen: !currentlyOpen });
    toast.success(currentlyOpen ? "Posting closed — hidden from public page." : "Posting re-opened — now visible to applicants!");
    refreshData();
  };

  const handleDeletePosting = (id: string, title: string) => {
    if (!window.confirm(`Delete the posting "${title}"? This cannot be undone.`)) return;
    deletePosting(id);
    toast.success("Posting deleted.");
    refreshData();
  };

  // ---- Application Management ----

  const handleOpenAppDetail = (app: AttachmentApplication) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setAdminNotes(app.adminNotes || "");
  };

  const handleUpdateStatus = () => {
    if (!selectedApp) return;
    const updated = updateApplicationStatus(selectedApp.id, editStatus, adminNotes);
    if (updated) {
      toast.success(`Updated status for ${selectedApp.fullName} to "${editStatus}"`);
      setSelectedApp(updated);
      refreshData();
    } else {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteApp = (id: string, name: string) => {
    if (!window.confirm(`Remove the application from ${name}?`)) return;
    deleteApplication(id);
    setSelectedApp(null);
    toast.success("Application removed.");
    refreshData();
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AttachmentApplication["status"]) => {
    const styles: Record<string, string> = {
      Received: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      "Under Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      Shortlisted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
      "Interview Scheduled": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
      Offered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    };
    return <Badge className={styles[status] || ""}>{status === "Rejected" ? "Unsuccessful" : status}</Badge>;
  };

  const openCount = postings.filter((p) => p.isOpen).length;
  const closedCount = postings.length - openCount;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
              Super Admin
            </Badge>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Talent Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Attachments & Internships
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Post new opportunities, review incoming applications, and manage candidate status.
          </p>
        </div>

        <Button
          onClick={() => { resetPostForm(); setIsPostFormOpen(true); setActiveTab("postings"); }}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2 text-sm shadow-md self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Post New Opportunity
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-center">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{postings.length}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Total Postings</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{openCount}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Active / Open</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{applications.length}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Applications</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {applications.filter((a) => a.status === "Received").length}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Pending Review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6">
        <button
          onClick={() => setActiveTab("postings")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "postings"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Postings ({postings.length})
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === "applications"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Applications ({applications.length})
        </button>
      </div>

      {/* ============ POSTINGS TAB ============ */}
      {activeTab === "postings" && (
        <div className="space-y-6">
          {postings.length === 0 && !isPostFormOpen ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Postings Yet</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
                You haven't posted any attachment or internship opportunities yet. Click the button below to create your first one — it will instantly appear on the public Careers page.
              </p>
              <Button
                onClick={() => { resetPostForm(); setIsPostFormOpen(true); }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2"
              >
                <Plus className="w-4 h-4" /> Create First Posting
              </Button>
            </div>
          ) : (
            <>
              {/* Inline create form */}
              {isPostFormOpen && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-amber-500/40 p-6 shadow-lg space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-amber-500" /> Post New Opportunity
                    </h3>
                    <button onClick={() => setIsPostFormOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePosting} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Position Title *</label>
                        <Input
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Electronics Repair Attachee"
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Department *</label>
                        <Input
                          required
                          value={formDept}
                          onChange={(e) => setFormDept(e.target.value)}
                          placeholder="e.g. Hardware Repair, Software, Networking"
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Program Type *</label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value as any)}
                          className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm"
                        >
                          <option value="Attachment">Industrial Attachment</option>
                          <option value="Internship">Graduate Internship</option>
                          <option value="Apprenticeship">Technical Apprenticeship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Location</label>
                        <Input
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Nairobi Workshop / Hybrid"
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Duration</label>
                        <Input
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                          placeholder="e.g. 3 Months, 6 Months"
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Available Slots</label>
                        <Input
                          type="number"
                          min={1}
                          value={formSlots}
                          onChange={(e) => setFormSlots(Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Application Deadline *</label>
                        <Input
                          required
                          type="date"
                          value={formDeadline}
                          onChange={(e) => setFormDeadline(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm"
                        placeholder="Describe the opportunity, what the candidate will do, and what they'll learn..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                          Requirements <span className="text-gray-400 font-normal">(one per line)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formRequirements}
                          onChange={(e) => setFormRequirements(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm"
                          placeholder={"Diploma or Degree in relevant field\nIntroduction letter from institution\nBasic understanding of electronics"}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1">
                          Responsibilities <span className="text-gray-400 font-normal">(one per line)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formResponsibilities}
                          onChange={(e) => setFormResponsibilities(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm"
                          placeholder={"Assist senior technicians\nLog daily progress\nParticipate in team meetings"}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                      <Button type="button" variant="outline" onClick={() => setIsPostFormOpen(false)} className="text-sm">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm">
                        Publish Posting
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing postings list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postings.map((posting) => (
                  <div
                    key={posting.id}
                    className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                      posting.isOpen
                        ? "border-emerald-200 dark:border-emerald-800/50"
                        : "border-gray-200 dark:border-slate-800 opacity-60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-200 dark:text-amber-400">
                          {posting.department}
                        </Badge>
                        <Badge className={posting.isOpen ? "bg-emerald-600 text-white" : "bg-gray-500 text-white"}>
                          {posting.isOpen ? "Active" : "Closed"}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{posting.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">{posting.description}</p>

                      <div className="text-xs space-y-1 text-gray-600 dark:text-slate-300 border-t border-gray-100 dark:border-slate-800 pt-2">
                        <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-gray-400" /> {posting.type} • {posting.duration}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" /> {posting.location}</div>
                        <div className="flex items-center gap-1.5"><UsersIcon className="w-3 h-3 text-gray-400" /> {posting.slots} Slot{posting.slots !== 1 ? "s" : ""}</div>
                        <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-gray-400" /> Deadline: {posting.deadline}</div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-[11px] text-gray-400">Posted {posting.postedAt}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleOpen(posting.id, posting.isOpen)}
                          className="text-xs gap-1"
                        >
                          {posting.isOpen ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                          {posting.isOpen ? "Close" : "Open"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePosting(posting.id, posting.title)}
                          className="text-xs gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ============ APPLICATIONS TAB ============ */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No Applications Yet</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                No one has submitted an attachment or internship application yet. Applications will appear here as candidates apply through the public Careers page.
              </p>
            </div>
          ) : (
            <>
              {/* Search & Filter */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search name, ref, or institution..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2"
                >
                  <option value="All">All Statuses</option>
                  <option value="Received">Received</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Unsuccessful</option>
                </select>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">
                      <tr>
                        <th className="p-4">Candidate & Ref</th>
                        <th className="p-4">Institution</th>
                        <th className="p-4">Position Applied</th>
                        <th className="p-4">Applied</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredApps.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-slate-400">
                            No applications match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredApps.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4">
                              <div className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">{app.referenceId}</div>
                              <div className="font-semibold text-gray-900 dark:text-white">{app.fullName}</div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">{app.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="text-xs text-gray-700 dark:text-slate-200 font-medium">{app.institution}</div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">{app.fieldOfStudy}</div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold mb-1">{app.type}</Badge>
                              <div className="text-xs text-gray-700 dark:text-slate-300">{app.positionTitle}</div>
                            </td>
                            <td className="p-4 text-xs text-gray-500 dark:text-slate-400">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">{getStatusBadge(app.status)}</td>
                            <td className="p-4 text-right">
                              <Button size="sm" variant="outline" onClick={() => handleOpenAppDetail(app)} className="gap-1 text-xs">
                                <Eye className="w-3.5 h-3.5" /> Review
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ============ APPLICATION DETAIL MODAL ============ */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-gray-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">{selectedApp.referenceId}</span>
                <h3 className="text-xl font-bold">{selectedApp.fullName}</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">{selectedApp.positionTitle} ({selectedApp.type})</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <p><strong className="text-gray-500">Email:</strong> {selectedApp.email}</p>
              <p><strong className="text-gray-500">Phone:</strong> {selectedApp.phone}</p>
              <p><strong className="text-gray-500">Institution:</strong> {selectedApp.institution}</p>
              <p><strong className="text-gray-500">Field:</strong> {selectedApp.fieldOfStudy}</p>
              <p><strong className="text-gray-500">Qualification:</strong> {selectedApp.qualificationLevel}</p>
              <p><strong className="text-gray-500">Preferred Start:</strong> {selectedApp.preferredStartDate}</p>
              <p><strong className="text-gray-500">Duration:</strong> {selectedApp.durationMonths} Months</p>
              <p><strong className="text-gray-500">Applied:</strong> {new Date(selectedApp.appliedAt).toLocaleString()}</p>
            </div>

            {/* Document links */}
            <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-amber-500 mb-2">Attached Documents</h4>
              <a href={selectedApp.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline flex items-center gap-1 font-semibold">
                <FileText className="w-3.5 h-3.5" /> Resume / CV <ExternalLink className="w-3 h-3" />
              </a>
              {selectedApp.recommendationLetterUrl && (
                <a href={selectedApp.recommendationLetterUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Introduction Letter <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {selectedApp.portfolioUrl && (
                <a href={selectedApp.portfolioUrl} target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 underline flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> Portfolio / GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {selectedApp.coverNote && (
              <div className="text-xs bg-gray-50 dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800">
                <span className="font-bold block text-gray-500 mb-1">Candidate's Cover Note:</span>
                {selectedApp.coverNote}
              </div>
            )}

            {/* Status update */}
            <div className="border-t border-gray-200 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="font-bold text-sm">Update Status & Notes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1 font-semibold">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg p-2 text-sm"
                  >
                    <option value="Received">Received</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Unsuccessful / Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1 font-semibold">Admin Notes</label>
                  <Input
                    placeholder="e.g. Schedule interview for next Monday..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteApp(selectedApp.id, selectedApp.fullName)}
                  className="text-xs gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Application
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)} className="text-xs">Close</Button>
                  <Button size="sm" onClick={handleUpdateStatus} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
