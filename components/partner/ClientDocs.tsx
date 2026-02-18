import React, { useState, useRef } from 'react';
import { PartnerLayout } from './PartnerLayout';
import {
    FileText,
    Printer,
    Download,
    Eye,
    CheckCircle,
    Edit3,
    Copy,
    Calendar,
    User,
    Building,
    AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Document Templates
interface DocTemplate {
    id: string;
    name: string;
    description: string;
    category: 'consent' | 'liability' | 'intake' | 'protocol';
    required: boolean;
}

const TEMPLATES: DocTemplate[] = [
    {
        id: 'informed-consent',
        name: 'Informed Consent Form',
        description: 'General consent for bio-optimization therapies',
        category: 'consent',
        required: true
    },
    {
        id: 'liability-waiver',
        name: 'Liability Waiver',
        description: 'Client assumes full responsibility for therapy participation',
        category: 'liability',
        required: true
    },
    {
        id: 'hbot-consent',
        name: 'HBOT Specific Consent',
        description: 'Hyperbaric oxygen therapy acknowledgment and risks',
        category: 'consent',
        required: true
    },
    {
        id: 'pemf-consent',
        name: 'PEMF Therapy Consent',
        description: 'Pulsed electromagnetic field therapy acknowledgment',
        category: 'consent',
        required: false
    },
    {
        id: 'health-intake',
        name: 'Health History Intake',
        description: 'Medical history and contraindications questionnaire',
        category: 'intake',
        required: true
    },
    {
        id: 'protocol-agreement',
        name: 'Protocol Commitment Agreement',
        description: 'Client commitment to follow prescribed protocol',
        category: 'protocol',
        required: false
    }
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    consent: { bg: 'bg-cyan-50', text: 'text-cyan-700', label: 'Consent' },
    liability: { bg: 'bg-red-50', text: 'text-red-700', label: 'Liability' },
    intake: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Intake' },
    protocol: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Protocol' }
};

// Print-friendly Document Preview
const DocumentPreview: React.FC<{
    template: DocTemplate;
    clinicName: string;
    clientName: string;
    date: string;
    onClose: () => void;
}> = ({ template, clinicName, clientName, date, onClose }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${template.name}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
                    h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    h2 { margin-top: 24px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                    .field { border-bottom: 1px solid #000; min-width: 200px; display: inline-block; margin: 0 5px; }
                    .signature-line { margin-top: 60px; display: flex; justify-content: space-between; }
                    .signature-box { width: 45%; }
                    .signature-box .line { border-bottom: 1px solid #000; height: 40px; margin-bottom: 5px; }
                    .signature-box .label { font-size: 12px; color: #666; }
                    .checkbox { display: flex; align-items: flex-start; gap: 10px; margin: 10px 0; }
                    .checkbox-box { width: 16px; height: 16px; border: 1px solid #000; flex-shrink: 0; margin-top: 3px; }
                    .date-field { text-align: right; margin-bottom: 20px; }
                    .warning { border: 1px solid #000; padding: 15px; margin: 20px 0; background: #f9f9f9; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                ${content.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const renderDocumentContent = () => {
        switch (template.id) {
            case 'informed-consent':
                return (
                    <>
                        <div className="header">
                            <div className="logo">HYLONO</div>
                            <p>Bio-Optimization Center</p>
                        </div>
                        <h1>INFORMED CONSENT FOR BIO-OPTIMIZATION SERVICES</h1>
                        <p className="date-field">Date: <span className="field">{date}</span></p>

                        <p><strong>Client Name:</strong> <span className="field">{clientName || '________________________'}</span></p>
                        <p><strong>Facility:</strong> <span className="field">{clinicName || '________________________'}</span></p>

                        <h2>Purpose & Nature of Services</h2>
                        <p>I understand that the bio-optimization services offered at this facility are designed to support general wellness and are not intended to diagnose, treat, cure, or prevent any disease or medical condition.</p>

                        <h2>Services May Include:</h2>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Hyperbaric Oxygen Therapy (HBOT) - mild pressure oxygen exposure</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Pulsed Electromagnetic Field Therapy (PEMF)</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Red Light Therapy (RLT) / Photobiomodulation</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Molecular Hydrogen Therapy</span></div>

                        <h2>Acknowledgment</h2>
                        <p>I acknowledge that I have been given the opportunity to ask questions about the services I will receive. I understand the potential benefits and risks associated with these wellness modalities.</p>

                        <div className="warning">
                            <strong>⚠️ IMPORTANT:</strong> These services are not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician before beginning any wellness program.
                        </div>

                        <div className="signature-line">
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Client Signature</div>
                            </div>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Date</div>
                            </div>
                        </div>
                    </>
                );

            case 'liability-waiver':
                return (
                    <>
                        <div className="header">
                            <div className="logo">HYLONO</div>
                            <p>Bio-Optimization Center</p>
                        </div>
                        <h1>LIABILITY WAIVER & ASSUMPTION OF RISK</h1>
                        <p className="date-field">Date: <span className="field">{date}</span></p>

                        <p><strong>Client Name:</strong> <span className="field">{clientName || '________________________'}</span></p>
                        <p><strong>Facility:</strong> <span className="field">{clinicName || '________________________'}</span></p>

                        <h2>Voluntary Participation</h2>
                        <p>I, the undersigned, acknowledge that my participation in bio-optimization services at this facility is entirely voluntary. I am participating of my own free will and understand that I may discontinue services at any time.</p>

                        <h2>Assumption of Risk</h2>
                        <p>I understand that bio-optimization modalities, while generally considered safe when used properly, may carry certain risks. I acknowledge that I have been informed of potential risks and contraindications specific to the services I will receive.</p>

                        <h2>Release of Liability</h2>
                        <p>I hereby release, waive, discharge, and covenant not to sue the facility, its owners, operators, employees, and affiliates from any and all liability, claims, demands, or causes of action that may arise from my participation in bio-optimization services.</p>

                        <h2>Medical Clearance</h2>
                        <div className="checkbox"><div className="checkbox-box"></div><span>I confirm that I have consulted with my physician regarding my participation in these services</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>I have disclosed all relevant medical conditions and medications to the facility staff</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>I am not aware of any medical reason that would prevent my safe participation</span></div>

                        <div className="warning">
                            <strong>I HAVE READ THIS WAIVER, FULLY UNDERSTAND ITS TERMS, AND SIGN IT FREELY AND VOLUNTARILY.</strong>
                        </div>

                        <div className="signature-line">
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Client Signature</div>
                            </div>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Date</div>
                            </div>
                        </div>

                        <div className="signature-line" style={{ marginTop: '30px' }}>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Witness Signature</div>
                            </div>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Date</div>
                            </div>
                        </div>
                    </>
                );

            case 'hbot-consent':
                return (
                    <>
                        <div className="header">
                            <div className="logo">HYLONO</div>
                            <p>Bio-Optimization Center</p>
                        </div>
                        <h1>HYPERBARIC OXYGEN THERAPY (HBOT) CONSENT</h1>
                        <p className="date-field">Date: <span className="field">{date}</span></p>

                        <p><strong>Client Name:</strong> <span className="field">{clientName || '________________________'}</span></p>

                        <h2>What is Mild Hyperbaric Oxygen Therapy?</h2>
                        <p>Mild HBOT involves breathing oxygen in a pressurized chamber at 1.3-1.5 ATA. This non-medical wellness modality is designed to increase oxygen availability in body tissues.</p>

                        <h2>Potential Sensations & Considerations</h2>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Ear pressure (similar to airplane descent) - I have been instructed on equalization techniques</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Temporary changes in vision may occur</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Mild fatigue after sessions is normal</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Claustrophobia considerations have been discussed</span></div>

                        <h2>Contraindications Screening</h2>
                        <p>I confirm that I do NOT have any of the following:</p>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Untreated pneumothorax (collapsed lung)</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Severe COPD or emphysema</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Recent ear surgery or ear drum issues</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Uncontrolled high fever</span></div>
                        <div className="checkbox"><div className="checkbox-box"></div><span>Pregnancy (unless cleared by physician)</span></div>

                        <div className="signature-line">
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Client Signature</div>
                            </div>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Date</div>
                            </div>
                        </div>
                    </>
                );

            default:
                return (
                    <>
                        <div className="header">
                            <div className="logo">HYLONO</div>
                            <p>Bio-Optimization Center</p>
                        </div>
                        <h1>{template.name.toUpperCase()}</h1>
                        <p className="date-field">Date: <span className="field">{date}</span></p>
                        <p><strong>Client Name:</strong> <span className="field">{clientName || '________________________'}</span></p>
                        <p><strong>Facility:</strong> <span className="field">{clinicName || '________________________'}</span></p>
                        <p style={{ marginTop: '40px', fontStyle: 'italic' }}>Document content template to be customized...</p>
                        <div className="signature-line">
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Client Signature</div>
                            </div>
                            <div className="signature-box">
                                <div className="line"></div>
                                <div className="label">Date</div>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{template.name}</h2>
                        <p className="text-sm text-slate-500">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Document Content - Print Ready */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div
                        ref={printRef}
                        className="max-w-[700px] mx-auto font-serif text-slate-900 leading-relaxed"
                        style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                        {renderDocumentContent()}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const ClientDocs: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<DocTemplate | null>(null);
    const [clinicName, setClinicName] = useState('Aura Wellness Center');
    const [clientName, setClientName] = useState('');

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <PartnerLayout title="Client Documents">
            <AnimatePresence>
                {selectedTemplate && (
                    <DocumentPreview
                        template={selectedTemplate}
                        clinicName={clinicName}
                        clientName={clientName}
                        date={today}
                        onClose={() => setSelectedTemplate(null)}
                    />
                )}
            </AnimatePresence>

            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold mb-1">Client Forms & Waivers</h2>
                            <p className="text-slate-400 text-sm">Print-ready legal documents for client consent and liability protection</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Clinic Name</p>
                                <input
                                    type="text"
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    className="bg-slate-700 text-white px-3 py-1.5 rounded text-sm font-medium border border-slate-600 focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Fill */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Fill Client Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Client Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Enter client name..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Facility</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={today}
                                    readOnly
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Templates Grid */}
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Document Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TEMPLATES.map((template) => {
                            const style = CATEGORY_STYLES[template.category];
                            return (
                                <motion.div
                                    key={template.id}
                                    whileHover={{ y: -4 }}
                                    className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className={`p-2.5 rounded-lg ${style.bg}`}>
                                                <FileText className={`w-5 h-5 ${style.text}`} />
                                            </div>
                                            {template.required && (
                                                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">
                                                    REQUIRED
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">{template.name}</h4>
                                        <p className="text-xs text-slate-500 mb-4">{template.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.bg} ${style.text}`}>
                                                {style.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                        <button
                                            onClick={() => setSelectedTemplate(template)}
                                            className="flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Preview & Print
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-amber-900 mb-1">Legal Disclaimer</h4>
                        <p className="text-sm text-amber-800">
                            These document templates are provided as general guidance only and should be reviewed by a qualified legal professional
                            in your jurisdiction before use. Hylono does not provide legal advice. Customize these documents to comply with local
                            laws and regulations.
                        </p>
                    </div>
                </div>
            </div>
        </PartnerLayout>
    );
};

export default ClientDocs;
