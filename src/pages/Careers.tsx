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
  Inbox,
  Award,
  Cpu,
  Check,
  TrendingUp,
  HelpCircle
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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ztech_internship_postings_v2") {
        fetchPostings();
      }
    };
    
    const interval = setInterval(fetchPostings, 5000);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const openPostings = postings.filter((p) => p.isOpen);
  const departments = Array.from(new Set(openPostings.map((p) => p.department)));

  const handleOpenApplyModal = (posting: InternshipPosting) => {
    setActivePosting(posting);
    setType(posting.type);
    setSubmittedRef(null);
    setIsApplyModalOpen(true);
  };

  const handleOpenGeneralApply = () => {
    setActivePosting({
      id: "general",
      title: "General Attachment & Internship Application",
      department: "Engineering & Technical Services",
      type: "Attachment",
      location: "Nairobi, Kenya",
      duration: "3 to 6 Months",
      description: "General application for industrial attachment, engineering internship, or technical apprenticeship at Ztech Electronics Ltd.",
      requirements: [],
      responsibilities: [],
      slots: 1,
      deadline: "Open",
      isOpen: true,
      postedAt: new Date().toISOString().split("T")[0]
    });
    setType("Attachment");
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
      "Received": "bg-blue-500/20 text-blue-300 border-blue-500/40",
      "Under Review": "bg-amber-500/20 text-amber-300 border-amber-500/40",
      "Shortlisted": "bg-purple-500/20 text-purple-300 border-purple-500/40",
      "Interview Scheduled": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      "Offered": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      "Rejected": "bg-rose-500/20 text-rose-300 border-rose-500/40",
    };
    return (
      <Badge className={`${colors[status] || ""} border px-3 py-1 text-xs font-semibold rounded-full`}>
        {status === "Rejected" ? "Closed / Unsuccessful" : status}
      </Badge>
    );
  };

  const statusSteps: AttachmentApplication["status"][] = [
    "Received",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Offered"
  ];

  const getStatusStepIndex = (status: AttachmentApplication["status"]) => {
    if (status === "Rejected") return -1;
    return statusSteps.indexOf(status);
  };

  const hasOpenPostings = openPostings.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <SEO
        title="Industrial Attachments & Internships - Ztech Electronics Ltd"
        description="Apply for industrial attachments, engineering internships, and technical apprenticeships at Ztech Electronics Limited in Kenya."
      />
      <Navigation />

      {/* Modern Hero Section with Ambient Lighting */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
        {/* Background Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        {/* Dual Radial Glow Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[280px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs md:text-sm font-medium shadow-xl shadow-amber-500/5 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Ztech Engineering Talent & Student Career Portal</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Kickstart Your Tech Career at <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 drop-shadow-sm">
              Ztech Electronics Limited
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Gain real-world practical experience in micro-soldering, PCB diagnostic rigs, software engineering, CCTV networks, and smart hardware under senior industry mentors.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {hasOpenPostings ? (
              <Button
                onClick={() => {
                  const el = document.getElementById("open-positions");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-xl shadow-amber-500/20 text-base transition-all duration-300 hover:scale-[1.02]"
              >
                View Open Opportunities <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleOpenGeneralApply}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-xl shadow-amber-500/20 text-base transition-all duration-300 hover:scale-[1.02]"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Application Now
              </Button>
            )}

            <Button
              onClick={() => {
                const el = document.getElementById("track-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              size="lg"
              className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 font-semibold px-8 py-6 rounded-xl text-base shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              <Search className="w-5 h-5 mr-2.5 text-amber-400" />
              Track Existing Application
            </Button>
          </div>

          {/* Hero Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xl">
            <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400">100+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Students Placed</div>
            </div>
            <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Practical Workshop</div>
            </div>
            <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400">1-on-1</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Senior Mentorship</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400">Official</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Logbook Sign-off</div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights Section */}
      <section className="py-20 bg-slate-950 relative border-b border-slate-800/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 mb-3 text-xs uppercase tracking-wider font-semibold">
              Training Tracks
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Our Hands-On Practical Programs</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              Designed specifically for diploma students, university undergraduates, and passionate technical self-starters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800/80 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Industrial Attachment</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  3 to 6 months attachment tailored for university & diploma students needing official logbook completion, workshop diagnostics, and engineer guidance.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Official Recommendation Required</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800/80 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Graduate Internship</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  6 to 12 months immersive program for recent graduates. Work directly on production codebases, CCTV IP networking, PCB lab diagnostics, and client solutions.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span>Direct Path to Full-Time Career</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800/80 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Wrench className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Technical Apprenticeship</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Intensive practical bootcamps in micro-soldering, smartphone display refurbishing, CCTV IP camera installation, and hardware troubleshooting.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Certificate of Practical Competency</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 mb-2 text-xs uppercase tracking-wider font-semibold">
              Live Openings
            </Badge>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Available Attachment & Job Slots</h2>
            <p className="text-slate-400 text-sm mt-1">
              {hasOpenPostings
                ? "Explore open slots and apply directly using your online reference details."
                : "All posted opportunities are reviewed live by the Ztech Electronics Engineering team."}
            </p>
          </div>
        </div>

        {/* Empty State Banner */}
        {!hasOpenPostings ? (
          <div className="relative overflow-hidden text-center py-16 px-6 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <div className="w-20 h-20 rounded-3xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center mx-auto mb-6 shadow-inner text-amber-400">
              <Inbox className="w-10 h-10" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">No Open Positions Right Now</h3>
            <p className="text-slate-300 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-8">
              Ztech Electronics Ltd currently has no active attachment or internship openings listed. 
              New slots are opened regularly by our admin team — check back soon or track your submitted application below.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleOpenGeneralApply}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-xl shadow-amber-500/20 text-base transition-all duration-300 hover:scale-[1.02]"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit General Application
              </Button>

              <Button
                onClick={() => {
                  const el = document.getElementById("track-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/50 hover:border-amber-400 font-semibold px-8 py-6 rounded-xl shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Search className="w-5 h-5 mr-2.5 text-amber-400" />
                Already Applied? Track Your Status Below
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="bg-slate-900/90 p-4 md:p-5 rounded-2xl border border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg backdrop-blur-md">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search title or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-950 border-slate-700 text-white text-sm focus:border-amber-500 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="All">All Types</option>
                  <option value="Attachment">Industrial Attachment</option>
                  <option value="Internship">Graduate Internship</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>
            </div>

            {/* Postings Grid */}
            {filteredPostings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-200 font-semibold text-lg">No positions match your filters.</p>
                <p className="text-slate-400 text-sm mt-1">Try broadening your search term or selection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPostings.map((posting) => (
                  <div
                    key={posting.id}
                    className="bg-slate-900/80 rounded-3xl border border-slate-800/90 p-7 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                          {posting.department}
                        </span>
                        <Badge className="bg-slate-800 text-slate-200 border-slate-700 text-xs px-2.5 py-1">
                          {posting.type}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{posting.title}</h3>
                      <p className="text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {posting.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 mb-6 border-y border-slate-800/80 py-3.5">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> <span className="truncate">{posting.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> <span className="truncate">{posting.duration}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" /> <span className="truncate">{posting.slots} Slot{posting.slots !== 1 ? "s" : ""}</span>
                        </span>
                      </div>

                      {posting.requirements.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Key Requirements:</p>
                          <ul className="space-y-1.5">
                            {posting.requirements.slice(0, 3).map((req, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                {req}
                              </li>
                            ))}
                            {posting.requirements.length > 3 && (
                              <li className="text-xs text-amber-400/80 italic font-medium">+{posting.requirements.length - 3} more requirements...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Deadline: <span className="text-slate-200">{posting.deadline}</span></span>
                      <Button
                        onClick={() => handleOpenApplyModal(posting)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl px-5 py-2.5 shadow-md transition-all hover:scale-105"
                      >
                        Apply Now <Send className="ml-2 w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Why Join Ztech Section */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 mb-3 text-xs uppercase tracking-wider font-semibold">
              Student Advantages
            </Badge>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Why Complete Your Attachment at Ztech?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm mt-2">
              We bridge the gap between academic theory and high-demand electronics industry expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Real Lab Hardware</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work directly with hot-air rework stations, digital oscilloscopes, motherboard schematics, and CCTV IP testers.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">100% Logbook Approval</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guaranteed weekly supervisor reviews, logbook assessment sign-offs, and official university recommendation letters.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Career Pathways</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Top performing attachment students are retained for paid graduate internships and permanent engineering positions.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Engineer Mentorship</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get assigned 1-on-1 with senior lab technicians and lead software engineers throughout your program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Status Tracker Dashboard */}
      <section id="track-section" className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md">
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Track Application Status</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Enter your unique reference tracking code (e.g. <span className="text-amber-400 font-mono font-semibold">ZTECH-ATT-7301</span>) below to get live status updates from Ztech Admin.
              </p>
            </div>

            <form onSubmit={handleTrackApplication} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-8">
              <Input
                placeholder="Enter Reference ID (e.g. ZTECH-ATT-...)"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white font-mono text-center sm:text-left rounded-xl py-6 text-base"
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-xl shadow-lg transition-all"
              >
                Check Status
              </Button>
            </form>

            {/* Results Display */}
            {trackedResult !== undefined && (
              <div className="mt-8 bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl animate-in fade-in duration-300">
                {trackedResult === null ? (
                  <div className="text-center py-4">
                    <p className="text-rose-400 text-sm font-semibold">
                      No application record found for code "{trackingIdInput}".
                    </p>
                    <p className="text-slate-500 text-xs mt-1">Please double-check your code or contact Ztech support.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-5">
                      <div>
                        <h4 className="font-bold text-white text-xl">{trackedResult.fullName}</h4>
                        <p className="text-sm text-slate-400">{trackedResult.positionTitle} &bull; <span className="text-amber-400 font-medium">{trackedResult.type}</span></p>
                      </div>
                      <div>{getStatusBadge(trackedResult.status)}</div>
                    </div>

                    {/* Timeline Tracker */}
                    {trackedResult.status !== "Rejected" && (
                      <div className="py-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Application Lifecycle:</p>
                        <div className="grid grid-cols-5 gap-1 relative">
                          {statusSteps.map((step, idx) => {
                            const currentIdx = getStatusStepIndex(trackedResult.status);
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                              <div key={step} className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isCurrent
                                    ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20"
                                    : isCompleted
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-slate-900 text-slate-600 border border-slate-800"
                                }`}>
                                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-2 font-medium leading-tight ${
                                  isCurrent ? "text-amber-400 font-bold" : isCompleted ? "text-slate-300" : "text-slate-600"
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                      <div><span className="text-slate-500">Ref Code:</span> <span className="font-mono text-amber-400 font-semibold">{trackedResult.referenceId}</span></div>
                      <div><span className="text-slate-500">Institution:</span> <span className="text-slate-200">{trackedResult.institution} ({trackedResult.fieldOfStudy})</span></div>
                      <div><span className="text-slate-500">Applied On:</span> <span className="text-slate-200">{new Date(trackedResult.appliedAt).toLocaleDateString()}</span></div>
                      <div><span className="text-slate-500">Preferred Start:</span> <span className="text-slate-200">{trackedResult.preferredStartDate || "N/A"}</span></div>
                    </div>

                    {trackedResult.adminNotes && (
                      <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 text-xs text-slate-200">
                        <span className="font-semibold text-amber-400 block mb-1 text-xs uppercase tracking-wider">Note from Ztech Engineering Admin:</span>
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

      {/* Application Modal */}
      {isApplyModalOpen && activePosting && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedRef ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-extrabold text-white">Application Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Your application for <span className="font-semibold text-amber-400">{activePosting.title}</span> has been submitted to the Ztech Electronics Engineering Team.
                </p>
                <div className="bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 inline-block font-mono text-amber-400 text-xl font-bold shadow-inner">
                  Ref: {submittedRef}
                </div>
                <p className="text-xs text-slate-400">Save this reference code to track your application status anytime on this portal.</p>
                <Button onClick={() => setIsApplyModalOpen(false)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3 rounded-xl">
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
                    Fill in your details accurately. Applications are reviewed directly by Ztech Electronics.
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
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
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
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Phone Number (WhatsApp) *</label>
                    <Input
                      required
                      placeholder="+254 7..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">College / Institution *</label>
                    <Input
                      required
                      placeholder="e.g. UoN, JKUAT, Kenya Poly, TUK..."
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Field of Study / Course *</label>
                    <Input
                      required
                      placeholder="e.g. B.Sc Electrical Eng, Diploma IT"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Current Qualification Level *</label>
                    <select
                      value={qualificationLevel}
                      onChange={(e) => setQualificationLevel(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-medium"
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
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
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
                      className="bg-slate-950 border-slate-700 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-4">
                  <h4 className="font-semibold text-white text-sm">Document & Portfolio Links</h4>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Resume / CV Document Link *</label>
                    <Input
                      required
                      placeholder="Google Drive / Dropbox link to your CV"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white text-xs rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">Attachment Letter Link (Optional)</label>
                      <Input
                        placeholder="Link to university letter"
                        value={recommendationLetterUrl}
                        onChange={(e) => setRecommendationLetterUrl(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white text-xs rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">GitHub / Portfolio Link (Optional)</label>
                      <Input
                        placeholder="e.g. github.com/username"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-semibold mb-1">Personal Cover Note / Introduction</label>
                    <textarea
                      rows={3}
                      placeholder="Briefly state your passion and goals for attaching at Ztech Electronics..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 rounded-xl shadow-md"
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
