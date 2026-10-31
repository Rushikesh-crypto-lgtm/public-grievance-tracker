import React, { useState } from 'react';
import { useGrievance } from '../context/GrievanceContext';
import { Department, HYDERABAD_AREAS, Priority } from '../types/grievance';
import {
  FilePlus,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowRight,
  Upload,
  Paperclip,
  X,
  AlertCircle,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDateOnly } from '../utils/sla';

interface RegisterGrievancePageProps {
  onNavigate: (view: string, caseId?: string) => void;
}

export const RegisterGrievancePage: React.FC<RegisterGrievancePageProps> = ({ onNavigate }) => {
  const { addGrievance } = useGrievance();

  // Form State
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    category: 'Roads & Infrastructure' as Department,
    subcategory: 'Pothole & Surface Damage',
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    area: HYDERABAD_AREAS[0],
    address: '',
    priority: 'HIGH' as Priority
  });

  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Success State
  const [submittedCase, setSubmittedCase] = useState<{
    id: string;
    category: string;
    date: string;
    status: string;
    target: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const categories: Department[] = [
    'Roads & Infrastructure',
    'Water Supply',
    'Electricity',
    'Sanitation',
    'Street Lighting',
    'Public Safety',
    'Waste Management',
    'Transportation',
    'Other'
  ];

  const subcategoriesByCategory: Record<Department, string[]> = {
    'Roads & Infrastructure': [
      'Pothole & Surface Damage',
      'Damaged Speed Breaker',
      'Stormwater Drain Cover Missing',
      'Footpath / Paver Damage'
    ],
    'Water Supply': [
      'Contaminated Water Supply',
      'Main Pipeline Burst / Leakage',
      'Low Water Pressure',
      'Missing Water Meter'
    ],
    'Electricity': [
      'Overhead Wire Shock Hazard',
      'Transformer Sparking / Overheating',
      'Frequent Voltage Fluctuations',
      'Unmetered Power Leakage'
    ],
    'Sanitation': [
      'Overflowing Garbage Dump',
      'Open Sewage Overflow',
      'Dead Animal Disposal',
      'Public Toilet Hygiene'
    ],
    'Street Lighting': [
      'Consecutive Poles Dark',
      'Intermittent Street Lamp Blinking',
      'Fallen Lamp Post',
      'Daytime Burning Lights'
    ],
    'Public Safety': [
      'Fallen Tree / Debris Obstruction',
      'Uncovered Construction Trench',
      'Stray Animal Aggression',
      'Damaged Guard Rail'
    ],
    'Waste Management': [
      'Construction Debris Dumping',
      'Missed Door-to-Door Collection',
      'Burning Waste in Open Air',
      'Plastic Dump on Waterbody'
    ],
    'Transportation': [
      'Traffic Signal Timing Failure',
      'Damaged Road Signage',
      'Bus Shelter Damaged',
      'Illegal Encroachment on Carriageway'
    ],
    'Other': ['General Public Grievance', 'Civic Office Enquiry']
  };

  const handleCategoryChange = (cat: Department) => {
    setFormData(prev => ({
      ...prev,
      category: cat,
      subcategory: (subcategoriesByCategory[cat] && subcategoriesByCategory[cat][0]) || 'General'
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.reporterName.trim()) {
      errs.reporterName = 'Full name is required.';
    }
    if (!formData.reporterEmail.trim()) {
      errs.reporterEmail = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.reporterEmail)) {
      errs.reporterEmail = 'Please provide a valid email format.';
    }
    if (!formData.reporterPhone.trim()) {
      errs.reporterPhone = 'Mobile number is required.';
    } else if (formData.reporterPhone.replace(/\D/g, '').length < 10) {
      errs.reporterPhone = 'Please provide a valid 10-digit mobile number.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please describe the grievance clearly.';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Description must be at least 15 characters.';
    }
    if (!formData.area) {
      errs.area = 'Please select your area or locality.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleFinalConfirm = () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      const generated = addGrievance({
        title: formData.title.trim() || `${formData.subcategory || formData.category} Issue in ${formData.area}`,
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description.trim(),
        incidentDate: formData.incidentDate,
        area: formData.area,
        address: formData.address.trim() || undefined,
        attachmentName: attachmentName || undefined,
        reporterName: formData.reporterName.trim(),
        reporterEmail: formData.reporterEmail.trim(),
        reporterPhone: formData.reporterPhone.trim(),
        priority: formData.priority
      });

      setIsSubmitting(false);
      setSubmittedCase({
        id: generated.id,
        category: generated.category,
        date: formatDateOnly(generated.submittedAt),
        status: generated.status,
        target: formatDateOnly(generated.targetResolutionDate)
      });

      // Fire celebratory confetti for hackathon impact
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 400);
  };

  const handleCopyId = () => {
    if (submittedCase) {
      navigator.clipboard.writeText(submittedCase.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  // If successfully submitted, show the official receipt page
  if (submittedCase) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-xs">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Your grievance has been successfully registered.
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              An official case docket has been generated and routed to the municipal team.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-8 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Official Case Tracking ID
              </span>
              <div className="text-3xl font-black font-mono text-blue-900 tracking-wider">
                {submittedCase.id}
              </div>
              <p className="text-xs text-slate-500">
                Save this Case ID to check updates on the public tracking portal.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-center">
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Category</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{submittedCase.category}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Registered On</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">{submittedCase.date}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Initial Status</p>
                <p className="text-sm font-semibold text-blue-600 mt-1">{submittedCase.status}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium uppercase">Resolution Target</p>
                <p className="text-sm font-semibold text-emerald-700 mt-1">{submittedCase.target}</p>
              </div>
            </div>

            {/* Privacy reminder */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-900 rounded-lg text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Your contact details are protected. Only authorized municipal staff can view reporter information.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleCopyId}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg border border-slate-300 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Case ID'}</span>
              </button>

              <button
                onClick={() => onNavigate('track', submittedCase.id)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Grievance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <FilePlus className="w-4 h-4" />
          <span>Citizen Intake Form</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Register a Public Grievance
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Report civic, utility, or infrastructure issues for accountable redressal by municipal departments.
        </p>
      </div>

      <form onSubmit={handleInitialSubmit} className="space-y-8">
        {/* Section 1: Reporter Information */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900">Reporter Information</h2>
            </div>
            <span className="text-[11px] text-slate-400">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={e => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="e.g. Karthik Varma"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    errors.reporterName ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.reporterName && (
                <p className="text-xs text-red-600 mt-1">{errors.reporterName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={formData.reporterEmail}
                  onChange={e => setFormData({ ...formData, reporterEmail: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    errors.reporterEmail ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.reporterEmail && (
                <p className="text-xs text-red-600 mt-1">{errors.reporterEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="tel"
                  value={formData.reporterPhone}
                  onChange={e => setFormData({ ...formData, reporterPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${
                    errors.reporterPhone ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.reporterPhone && (
                <p className="text-xs text-red-600 mt-1">{errors.reporterPhone}</p>
              )}
            </div>
          </div>

          {/* Privacy Notice Box */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Privacy Notice:</strong> Your contact information is protected and is only visible to authorized personnel for case verification. It is not shown in public tracking logs.
            </span>
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900">Grievance Information</h2>
            </div>
            <span className="text-[11px] text-slate-400">Step 2 of 2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={e => handleCategoryChange(e.target.value as Department)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Specific Issue Type
              </label>
              <select
                value={formData.subcategory}
                onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {(subcategoriesByCategory[formData.category] || ['General Issue']).map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area & Incident Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Area / Locality <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {HYDERABAD_AREAS.map(ar => (
                    <option key={ar} value={ar}>
                      {ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Incident <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={formData.incidentDate}
                  onChange={e => setFormData({ ...formData, incidentDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Street Address / Landmark */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Landmark or Street Address (Optional)
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. Near Bio-Diversity Junction, opposite SBI ATM"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description with Character Counter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Grievance Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {formData.description.length}/1000 characters
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={e => {
                if (e.target.value.length <= 1000) {
                  setFormData({ ...formData, description: e.target.value });
                }
              }}
              rows={4}
              placeholder="Describe the issue clearly: what happened, exact location details, severity, and any immediate hazard..."
              className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-400' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Optional File Attachment UI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Upload Photographic Evidence (Optional)
            </label>
            {attachmentName ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-medium">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <span>{attachmentName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentName(null)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-5 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/20">
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-xs font-medium text-slate-700">
                  Click to attach photo or inspection document
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, or PDF up to 10MB
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Home
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FilePlus className="w-4 h-4" />
            <span>Submit Grievance</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal before submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Review & Confirm Submission</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900">
                Please verify that your locality and complaint details are accurate. A unique public tracking ID will be generated upon confirmation.
              </div>

              <div className="space-y-2 border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Reporter:</span>
                  <span className="font-semibold text-slate-800">{formData.reporterName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{formData.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Area:</span>
                  <span className="font-semibold text-slate-800">{formData.area}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-1">Description:</span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded text-xs line-clamp-3">
                    {formData.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
