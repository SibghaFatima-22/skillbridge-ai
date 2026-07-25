import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Wand2,
  CheckCircle2,
  Eye,
  Edit3,
  Loader2,
  Printer,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Award,
  Code2,
} from "lucide-react";
import { ResumeData } from "../../types";
import { enhanceResumeAPI } from "../../lib/api";
import { exportElementToPdf } from "../../lib/pdfExport";

interface ResumeBuilderViewProps {
  resume: ResumeData;
  setResume: (res: ResumeData) => void;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({
  resume,
  setResume,
}) => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Form helpers
  const handlePersonalInfoChange = (field: string, value: string) => {
    setResume({
      ...resume,
      personalInfo: { ...resume.personalInfo, [field]: value },
    });
  };

  const handleEnhanceSummary = async () => {
    setEnhancingIndex(-1);
    const result = await enhanceResumeAPI({
      section: "Professional Summary",
      rawText: resume.summary,
      targetRole: "Software Engineer",
    });
    if (result?.enhancedText) {
      setResume({ ...resume, summary: result.enhancedText });
    }
    setEnhancingIndex(null);
  };

  const handleEnhanceExperienceBullet = async (expIdx: number, bulletIdx: number) => {
    setEnhancingIndex(expIdx * 10 + bulletIdx);
    const rawBullet = resume.experience[expIdx].bullets[bulletIdx];
    const result = await enhanceResumeAPI({
      section: "Work Experience",
      rawText: rawBullet,
      targetRole: "Software Engineer",
    });

    if (result?.enhancedText) {
      const updatedExp = [...resume.experience];
      updatedExp[expIdx].bullets[bulletIdx] = result.enhancedText.split("\n")[0].replace(/^•\s*/, "");
      setResume({ ...resume, experience: updatedExp });
    }
    setEnhancingIndex(null);
  };

  // High quality client-side PDF export
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);

      // Look for print area element
      let element = document.getElementById("resume-print-area");

      // If not visible in DOM, temporarily switch to preview tab
      if (!element) {
        setActiveTab("preview");
        await new Promise((r) => setTimeout(r, 400));
        element = document.getElementById("resume-print-area");
      }

      if (!element) throw new Error("Resume element not found");

      const filename = `${(resume.personalInfo.fullName || "Candidate").trim().replace(/\s+/g, "_")}_Resume.pdf`;

      await exportElementToPdf({
        elementId: "resume-print-area",
        filename,
        backgroundColor: "#ffffff",
        scale: 2,
      });
    } catch (err) {
      console.error("PDF generation error, falling back to print:", err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const downloadTextResume = () => {
    const content = `=======================================================
${(resume.personalInfo.fullName || "CANDIDATE").toUpperCase()}
Email: ${resume.personalInfo.email || "N/A"} | Phone: ${resume.personalInfo.phone || "N/A"} | Location: ${resume.personalInfo.location || "N/A"}
GitHub: ${resume.personalInfo.github || "N/A"} | LinkedIn: ${resume.personalInfo.linkedin || "N/A"}
=======================================================

PROFESSIONAL SUMMARY
-------------------------------------------------------
${resume.summary || "N/A"}

WORK EXPERIENCE
-------------------------------------------------------
${(resume.experience || []).map(exp => `
${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})
${(exp.bullets || []).map(b => `• ${b}`).join('\n')}
`).join('\n')}

TECHNICAL PROJECTS
-------------------------------------------------------
${(resume.projects || []).map(proj => `
${proj.title} [${(proj.technologies || []).join(', ')}] - ${proj.link || ''}
${(proj.bullets || []).map(b => `• ${b}`).join('\n')}
`).join('\n')}

EDUCATION
-------------------------------------------------------
${(resume.education || []).map(edu => `
${edu.institution} - ${edu.degree} in ${edu.field} (${edu.startDate} - ${edu.endDate})
`).join('\n')}

TECHNICAL SKILLS
-------------------------------------------------------
Languages: ${(resume.skills?.languages || []).join(', ')}
Frameworks: ${(resume.skills?.frameworks || []).join(', ')}
Databases: ${(resume.skills?.databases || []).join(', ')}
Dev Tools: ${(resume.skills?.tools || []).join(', ')}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(resume.personalInfo.fullName || "Candidate").trim().replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBrowserPrint = () => {
    if (activeTab !== "preview") {
      setActiveTab("preview");
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  };

  // Dynamic Template Renderer
  const renderResumePreview = () => {
    const tpl = resume.template || "ATS Executive";

    if (tpl === "ATS Executive") {
      return (
        <div id="resume-print-area" className="p-10 md:p-14 bg-white text-slate-900 shadow-2xl max-w-4xl mx-auto space-y-6 font-serif leading-relaxed border border-slate-200">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-slate-900">{resume.personalInfo.fullName}</h1>
            <div className="text-xs text-slate-700 font-sans flex flex-wrap justify-center items-center gap-2 pt-1 font-medium">
              <span>{resume.personalInfo.email}</span>
              <span>•</span>
              <span>{resume.personalInfo.phone}</span>
              <span>•</span>
              <span>{resume.personalInfo.location}</span>
            </div>
            <div className="text-xs text-slate-800 font-sans flex flex-wrap justify-center items-center gap-2 font-medium">
              <span>{resume.personalInfo.github}</span>
              <span>•</span>
              <span>{resume.personalInfo.linkedin}</span>
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2 font-sans">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2 font-sans">
                Work Experience
              </h2>
              <div className="space-y-3 font-sans">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{exp.role} | {exp.company}</span>
                      <span className="font-normal text-slate-600">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-slate-800 space-y-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2 font-sans">
                Technical Projects
              </h2>
              <div className="space-y-3 font-sans">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{proj.title} <span className="font-normal text-slate-600">({proj.technologies.join(", ")})</span></span>
                      {proj.link && <span className="font-normal text-blue-700">{proj.link}</span>}
                    </div>
                    <ul className="list-disc pl-4 text-xs text-slate-800 space-y-1">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2 font-sans">
                Education
              </h2>
              <div className="space-y-1 font-sans text-xs">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-slate-900">
                    <div>
                      <strong>{edu.institution}</strong> — {edu.degree} in {edu.field}
                    </div>
                    <div className="text-slate-600">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {resume.skills && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2 font-sans">
                Technical Skills
              </h2>
              <div className="text-xs text-slate-800 space-y-1 font-sans">
                {resume.skills.languages?.length > 0 && <div><strong>Languages:</strong> {resume.skills.languages.join(", ")}</div>}
                {resume.skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {resume.skills.frameworks.join(", ")}</div>}
                {resume.skills.databases?.length > 0 && <div><strong>Databases:</strong> {resume.skills.databases.join(", ")}</div>}
                {resume.skills.tools?.length > 0 && <div><strong>Dev Tools:</strong> {resume.skills.tools.join(", ")}</div>}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (tpl === "Modern") {
      return (
        <div id="resume-print-area" className="p-10 md:p-14 bg-white text-slate-900 shadow-2xl max-w-4xl mx-auto space-y-6 font-sans leading-normal border border-slate-200">
          {/* Header */}
          <div className="border-l-4 border-blue-600 pl-4 py-1 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{resume.personalInfo.fullName}</h1>
              <div className="text-xs text-blue-600 font-bold mt-1">Full Stack & Software Engineer</div>
            </div>
            <div className="text-xs text-slate-600 space-y-1 text-right">
              <div>{resume.personalInfo.email} • {resume.personalInfo.phone}</div>
              <div>{resume.personalInfo.location}</div>
              <div className="text-blue-600 font-medium">{resume.personalInfo.github} • {resume.personalInfo.linkedin}</div>
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 border-b-2 border-blue-600 pb-1 mb-2 flex items-center gap-2">
                Professional Summary
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 border-b-2 border-blue-600 pb-1 mb-2">
                Work Experience
              </h2>
              <div className="space-y-4">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-900 text-sm">{exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[11px]">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1.5 pt-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 border-b-2 border-blue-600 pb-1 mb-2">
                Technical Projects
              </h2>
              <div className="space-y-3">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{proj.title} <span className="font-normal text-slate-500">[{proj.technologies.join(" • ")}]</span></span>
                      {proj.link && <span className="text-blue-600 font-semibold">{proj.link}</span>}
                    </div>
                    <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 border-b-2 border-blue-600 pb-1 mb-2">
                Education
              </h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-600">{edu.degree} in {edu.field} ({edu.startDate} - {edu.endDate})</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 border-b-2 border-blue-600 pb-1 mb-2">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[...(resume.skills.languages || []), ...(resume.skills.frameworks || []), ...(resume.skills.databases || []), ...(resume.skills.tools || [])].map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tpl === "Developer Minimal") {
      return (
        <div id="resume-print-area" className="p-8 md:p-12 bg-white text-slate-900 shadow-2xl max-w-4xl mx-auto space-y-5 font-mono text-xs leading-relaxed border border-slate-300">
          {/* Header */}
          <div className="border-b border-dashed border-slate-400 pb-3">
            <div className="text-base font-bold text-slate-900">// {resume.personalInfo.fullName.toUpperCase()}</div>
            <div className="text-slate-600 text-[11px] mt-1">
              [ {resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.location} ]
            </div>
            <div className="text-slate-700 text-[11px] font-semibold">
              [ {resume.personalInfo.github} | {resume.personalInfo.linkedin} ]
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div>
              <div className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                // SUMMARY
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <div>
              <div className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                // EXPERIENCE
              </div>
              <div className="space-y-3">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>&gt; {exp.role} @ {exp.company}</span>
                      <span className="font-normal text-slate-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul className="space-y-1 pl-3 text-slate-700 text-[11px]">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>■ {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <div className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                // PROJECTS
              </div>
              <div className="space-y-2">
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>&gt; {proj.title} [{proj.technologies.join(", ")}]</span>
                      <span className="font-normal text-slate-500">{proj.link}</span>
                    </div>
                    <ul className="space-y-1 pl-3 text-slate-700 text-[11px]">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>■ {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Skills */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                // EDUCATION
              </div>
              {resume.education.map((edu) => (
                <div key={edu.id} className="text-[11px] text-slate-800">
                  <div className="font-bold">{edu.institution}</div>
                  <div>{edu.degree} in {edu.field} ({edu.startDate} - {edu.endDate})</div>
                </div>
              ))}
            </div>

            <div>
              <div className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-0.5 mb-1.5">
                // SKILLS
              </div>
              <div className="text-[11px] text-slate-800">
                <div>LANGS: {resume.skills.languages?.join(", ")}</div>
                <div>FRAMEWORKS: {resume.skills.frameworks?.join(", ")}</div>
                <div>TOOLS: {resume.skills.tools?.join(", ")}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Creative Tech
    return (
      <div id="resume-print-area" className="p-8 md:p-12 bg-white text-slate-900 shadow-2xl max-w-4xl mx-auto space-y-6 font-sans leading-normal border border-slate-200">
        {/* Top Creative Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">{resume.personalInfo.fullName}</h1>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">Software Engineering Candidate</p>
          </div>
          <div className="text-xs text-slate-300 space-y-1 text-right font-medium">
            <div>{resume.personalInfo.email} • {resume.personalInfo.phone}</div>
            <div>{resume.personalInfo.github} • {resume.personalInfo.linkedin}</div>
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div>
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-black uppercase mb-2">
              Professional Summary
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div>
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-black uppercase mb-2">
              Work Experience
            </div>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-900">{exp.role} <span className="font-normal text-slate-500">at {exp.company}</span></span>
                    <span className="text-slate-500 text-[11px] font-semibold">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 pt-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div>
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-black uppercase mb-2">
              Projects
            </div>
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>{proj.title} <span className="font-normal text-slate-500">[{proj.technologies.join(", ")}]</span></span>
                    <span className="text-emerald-600">{proj.link}</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Skills */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-black uppercase mb-2">
              Education
            </div>
            {resume.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-bold text-slate-900">{edu.institution}</div>
                <div className="text-slate-600">{edu.degree} in {edu.field}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-xs font-black uppercase mb-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-1 text-xs">
              {[...(resume.skills.languages || []), ...(resume.skills.frameworks || []), ...(resume.skills.tools || [])].map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI ATS Resume Generator
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Resume Builder</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build ATS-formatted engineering resumes with Gemini action-verb enhancement.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-1 rounded-xl bg-slate-800 border border-slate-700 flex items-center">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "edit" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Form
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Export PDF</span>
          </button>

          <button
            onClick={downloadTextResume}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Download Plain Text Resume (.txt) for ATS Copy/Paste"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Download .TXT</span>
          </button>

          <button
            onClick={handleBrowserPrint}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Print or Save via Browser Print Dialog"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Controls - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={resume.personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={resume.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={resume.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={resume.personalInfo.location}
                  onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={resume.personalInfo.github}
                  onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                  className="px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Professional Summary</h3>
                <button
                  type="button"
                  onClick={handleEnhanceSummary}
                  className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-100"
                >
                  {enhancingIndex === -1 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>AI Enhance Summary</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none leading-relaxed text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Experience Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Work Experience & Internships</h3>

              {resume.experience.map((exp, expIdx) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[expIdx].company = e.target.value;
                        setResume({ ...resume, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...resume.experience];
                        updated[expIdx].role = e.target.value;
                        setResume({ ...resume, experience: updated });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bullet Points</div>
                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...resume.experience];
                            updated[expIdx].bullets[bIdx] = e.target.value;
                            setResume({ ...resume, experience: updated });
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => handleEnhanceExperienceBullet(expIdx, bIdx)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-semibold flex-shrink-0"
                          title="AI Enhance Action Verbs"
                        >
                          {enhancingIndex === expIdx * 10 + bIdx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selector Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Select ATS Template Preset</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "ATS Executive", desc: "Classic Serif / Standard Recruiter" },
                  { name: "Modern", desc: "Clean Blue Accent / Sans Serif" },
                  { name: "Developer Minimal", desc: "Terminal Monospace / Compact" },
                  { name: "Creative Tech", desc: "Dark Hero Card / Fresh Badges" },
                ].map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => setResume({ ...resume, template: tpl.name as any })}
                    className={`p-3 rounded-xl border text-xs text-left transition-all ${
                      resume.template === tpl.name
                        ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md shadow-blue-600/30"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <div className="font-bold">{tpl.name}</div>
                    <div className="text-[10px] opacity-80 font-normal mt-0.5">{tpl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Live Resume Preview Page */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="text-xs font-bold text-slate-400">
              Active Template: <span className="text-blue-400 font-extrabold">{resume.template}</span>
            </div>
            <div className="flex items-center gap-2">
              {["ATS Executive", "Modern", "Developer Minimal", "Creative Tech"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setResume({ ...resume, template: preset as any })}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    resume.template === preset
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {renderResumePreview()}
        </div>
      )}
    </div>
  );
};

