import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  CheckCircle2,
  Search,
  MapPin,
  Clock,
  Users,
  Send,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  X,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getStoredPostings,
  getStoredApplications,
  submitApplication,
  InternshipPosting,
  AttachmentApplication
} from "@/data/internshipsData";

export default function Careers() {
  const [postings, setPostings] = useState<InternshipPosting[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [activePosting, setActivePosting] = useState<InternshipPosting | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [qualificationLevel, setQualificationLevel] = useState<AttachmentApplication["qualificationLevel"]>("Bachelor Degree");
  const [type, setType] = useState<AttachmentApplication["type"]>("Attachment");
  const [preferredStartDate, setPreferredStartDate] = useState("");
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [resumeUrl, setResumeUrl] = useState("");
  const [recommendationLetterUrl, setRecommendationLetterUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Tracking widget state
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [trackedResult, setTrackedResult] = useState<AttachmentApplication | null | undefined>(undefined);

  useEffect(() => {
    const fetchPostings = async () => {
      const data = await getStoredPostings();
      setPostings(data);
    };
    fetchPostings();

    // Listen for local storage changes across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ztech_internship_postings_v2") {
        fetchPostings();
      }
    };
    
    // Fallback interval just in case storage events are missed or navigating locally
    const interval = setInterval(fetchPostings, 5000);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Only show open postings to the public
  const openPostings = postings.filter((p) => p.isOpen);

  // Derive unique departments from actual posted data
  const departments = Array.from(new Set(openPostings.map((p) => p.department)));

  const handleOpenApplyModal = (posting: InternshipPosting) => {
    setActivePosting(posting);
    setType(posting.type);
    setSubmittedRef(null);
    setIsApplyModalOpen(true);
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setInstitution("");
    setFieldOfStudy("");
    setResumeUrl("");
    setRecommendationLetterUrl("");
    setPortfolioUrl("");
    setCoverNote("");
    setPreferredStartDate("");
    setDurationMonths(3);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !institution || !fieldOfStudy || !resumeUrl) {
      toast.error("Please fill in all required fields including your resume link!");
      return;
    }

    setIsSubmitting(true);
    try {
      const createdApp = await submitApplication({
        fullName,
        email,
        phone,
        institution,
        fieldOfStudy,
        qualificationLevel,
        positionId: activePosting ? activePosting.id : "general",
        positionTitle: activePosting ? activePosting.title : "General Application",
        type,
        preferredStartDate: preferredStartDate || new Date().toISOString().split("T")[0],
        durationMonths,
        resumeUrl,
        recommendationLetterUrl: recommendationLetterUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
        coverNote,
      });

      setSubmittedRef(createdApp.referenceId);
      toast.success(`Application submitted! Your tracking code is ${createdApp.referenceId}`);
      resetForm();
    } catch {
      toast.error("Error submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingIdInput.trim()) return;

    const allApps = await getStoredApplications();
    const match = allApps.find(
      (a) => a.referenceId.trim().toLowerCase() === trackingIdInput.trim().toLowerCase()
    );
    setTrackedResult(match || null);
  };

  const filteredPostings = openPostings.filter((p) => {
    const matchesDept = selectedDepartment === "All" || p.department === selectedDepartment;
    const matchesType = selectedType === "All" || p.type === selectedType;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesType && matchesSearch;
  });

  const getStatusBadge = (status: AttachmentApplication["status"]) => {
    const colors: Record<string, string> = {
      "Received": "bg-blue-600 text-white",
      "Under Review": "bg-amber-600 text-white",
      "Shortlisted": "bg-purple-600 text-white",
      "Interview Scheduled": "bg-indigo-600 text-white",
      "Offered": "bg-emerald-600 text-white",
      "Rejected": "bg-rose-600 text-white",
    };
    return <Badge className={colors[status] || ""}>{status === "Rejected" ? "Closed / Unsuccessful" : status}</Badge>;
  };

  const hasOpenPostings = openPostings.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO
        title="Industrial Attachments & Internships - Ztech Electronics Ltd"
        description="Apply for industrial attachments, engineering internships, and technical apprenticeships at Ztech Electronics Limited in Kenya."
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 px-3 py-1 mb-6 text-sm rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> Ztech Talent & Student Career Portal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Kickstart Your Tech Career at <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Ztech Electronics Limited
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Gain invaluable practical experience in PCB repair, software engineering, CCTV networks, and smart device diagnostics under senior industry mentors.
          </p>

          {hasOpenPostings ? (
            <Button
              onClick={() => {
                const el = document.getElementById("open-positions");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-lg shadow-amber-500/20 text-base"
            >
              View Open Opportunities <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                const el = document.getElementById("track-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 font-semibold px-8 py-6 rounded-xl text-base shadow-lg transition-all"
            >
              <Search className="w-5 h-5 mr-2 text-amber-400" />
              Track Existing Application
            </Button>
          )}
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-slate-900/60 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Our Practical Training Programs</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Designed for diploma students, university undergraduates, and passionate self-taught technicians.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Industrial Attachment</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                3 to 6 months attachment tailored for university & college students needing official logbook completion, hands-on workshop experience, and mentorship.
              </p>
              <div className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                Official Recommendation Letter Required <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Graduate Internship</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                6 to 12 months immersive program for recent graduates. Deep-dive into client projects, production software systems, network installation, and lab operations.
              </p>
              <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                Path to Full-Time Career <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Technical Apprenticeship</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Focused short-term bootcamps in micro-soldering, CCTV IP configuration, smartphone display repairs, and computer hardware diagnostics.
              </p>
              <div className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                Certificate of Technical Competency <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-16 container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Open Positions & Attachment Slots</h2>
          <p className="text-slate-400 text-sm">
            {hasOpenPostings
              ? "Browse the available slots below and apply to the one that fits your skills."
              : "Check back regularly — new opportunities are posted by our team as they become available."}
          </p>
        </div>

        {/* No postings empty state */}
        {!hasOpenPostings ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800/60">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-5">
              <Inbox className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Open Positions Right Now</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed mb-6">
              Ztech Electronics Ltd currently has no active attachment or internship openings.
              New opportunities are posted by our admin team regularly — please check back soon or follow us on social media for announcements.
            </p>
            <Button
              onClick={() => {
                const el = document.getElementById("track-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              <Search className="w-4 h-4 mr-2 text-amber-400" />
              Already Applied? Track Your Status Below
            </Button>
          </div>
        ) : (
          <>
            {/* Filters bar */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search title or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-950 border-slate-700 text-white text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Types</option>
                  <option value="Attachment">Industrial Attachment</option>
                  <option value="Internship">Graduate Internship</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>
            </div>

            {/* Postings grid */}
            {filteredPostings.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-semibold">No positions match your filters.</p>
                <p className="text-slate-500 text-sm mt-1">Try broadening your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPostings.map((posting) => (
                  <div
                    key={posting.id}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                          {posting.department}
                        </span>
                        <Badge variant="outline" className="text-slate-300 border-slate-700 text-xs">
                          {posting.type}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{posting.title}</h3>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {posting.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-4 border-y border-slate-800 py-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {posting.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> {posting.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-500" /> {posting.slots} Slot{posting.slots !== 1 ? "s" : ""} Available
                        </span>
                      </div>

                      {posting.requirements.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Key Requirements:</p>
                          <ul className="space-y-1">
                            {posting.requirements.slice(0, 3).map((req, idx) => (
                              <li key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                {req}
                              </li>
                            ))}
                            {posting.requirements.length > 3 && (
                              <li className="text-xs text-slate-500 italic">+{posting.requirements.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Deadline: {posting.deadline}</span>
                      <Button
                        onClick={() => handleOpenApplyModal(posting)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg px-4"
                      >
                        Apply Now <Send className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Application Status Tracker */}
      <section id="track-section" className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-center shadow-xl">
            <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">Track Your Application</h2>
            <p className="text-slate-400 text-sm mb-6">
              Already submitted an application? Enter your Tracking Reference Code (e.g. <span className="text-amber-300 font-mono">ZTECH-ATT-7301</span>) to check live status updates from Ztech Electronics admin.
            </p>

            <form onSubmit={handleTrackApplication} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <Input
                placeholder="Enter Reference ID..."
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white font-mono text-center sm:text-left"
              />
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6">
                Check Status
              </Button>
            </form>

            {trackedResult !== undefined && (
              <div className="mt-6 text-left bg-slate-950 p-5 rounded-xl border border-slate-800 animate-in fade-in">
                {trackedResult === null ? (
                  <p className="text-rose-400 text-sm text-center font-medium">
                    No application found with reference code "{trackingIdInput}". Please double-check your code.
                  </p>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-base">{trackedResult.fullName}</h4>
                        <p className="text-xs text-slate-400">{trackedResult.positionTitle} ({trackedResult.type})</p>
                      </div>
                      <div>{getStatusBadge(trackedResult.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div><span className="text-slate-500">Ref Code:</span> <span className="font-mono text-amber-400">{trackedResult.referenceId}</span></div>
                      <div><span className="text-slate-500">Institution:</span> {trackedResult.institution}</div>
                      <div><span className="text-slate-500">Applied On:</span> {new Date(trackedResult.appliedAt).toLocaleDateString()}</div>
                      <div><span className="text-slate-500">Preferred Start:</span> {trackedResult.preferredStartDate}</div>
                    </div>

                    {trackedResult.adminNotes && (
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 mt-2">
                        <span className="font-semibold text-amber-400 block mb-1">Update from Ztech Admin:</span>
                        {trackedResult.adminNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application Modal — only opens when a posting was selected */}
      {isApplyModalOpen && activePosting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedRef ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Your application for <span className="font-semibold text-amber-300">{activePosting.title}</span> has been submitted and will be reviewed by the Ztech Electronics team.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 inline-block font-mono text-amber-400 text-lg">
                  Ref: {submittedRef}
                </div>
                <p className="text-xs text-slate-400">Save this reference code to track your application status anytime.</p>
                <Button onClick={() => setIsApplyModalOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Apply for {activePosting.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Fill in your academic details and link your CV. Applications are reviewed by Ztech Super Admin.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Full Name *</label>
                    <Input
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Email Address *</label>
                    <Input
                      required
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Phone Number (M-Pesa / WhatsApp) *</label>
                    <Input
                      required
                      placeholder="+254 7..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">College / University / Institution *</label>
                    <Input
                      required
                      placeholder="e.g. UoN, JKUAT, Kenya Poly, etc."
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Field of Study / Course *</label>
                    <Input
                      required
                      placeholder="e.g. B.Sc Electronics, Diploma in IT"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Current Qualification Level *</label>
                    <select
                      value={qualificationLevel}
                      onChange={(e) => setQualificationLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Certificate">Certificate</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor Degree">Bachelor Degree</option>
                      <option value="Master Degree">Master Degree</option>
                      <option value="Self Taught / Other">Self Taught / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Target Start Date</label>
                    <Input
                      type="date"
                      value={preferredStartDate}
                      onChange={(e) => setPreferredStartDate(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Duration (Months)</label>
                    <Input
                      type="number"
                      min={1}
                      max={24}
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-4">
                  <h4 className="font-semibold text-white text-sm">Document & Portfolio Links</h4>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Resume / CV URL *</label>
                    <Input
                      required
                      placeholder="Link to Google Drive / Dropbox / PDF document"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Attachment Letter URL (Optional)</label>
                      <Input
                        placeholder="Link to university letter"
                        value={recommendationLetterUrl}
                        onChange={(e) => setRecommendationLetterUrl(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">GitHub / Portfolio URL (Optional)</label>
                      <Input
                        placeholder="e.g. github.com/username"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Personal Cover Note / Brief Introduction</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us why you want to do your attachment at Ztech Electronics Ltd..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
