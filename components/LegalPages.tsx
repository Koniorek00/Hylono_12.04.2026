"use client";

import React, { useState } from 'react';  
import { motion, AnimatePresence } from 'motion/react';  
import { Shield, FileText, ToggleLeft, ToggleRight, Info, CheckCircle } from 'lucide-react';
import { disclaimers } from '../content/disclaimers';
import { MedicalDisclaimer } from './shared/MedicalDisclaimer';
  
interface LegalSection {  
    title: string;  
    content: React.ReactNode;  
    summary: string;  
}  
  
const HumanSummaryToggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (  
    <div  
        onClick={onToggle}  
        className={`flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 select-none border ${enabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}  
    >  
        {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}  
        <span className="font-medium text-sm">Human Summary</span>  
        {enabled && (  
            <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full animate-pulse">  
                Active  
            </span>  
        )}  
    </div>  
);  
  
const SectionView: React.FC<{ section: LegalSection; showSummary: boolean }> = ({ section, showSummary }) => (  
    <div className="mb-10 group">  
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">  
            {section.title}  
        </h2>  
  
        <AnimatePresence>  
            {showSummary && (  
                <motion.div  
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}  
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}  
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}  
                    transition={{ duration: 0.3 }}  
                    className="overflow-hidden"  
                >  
                    <div className="bg-emerald-50/50 border-l-4 border-emerald-400 p-4 rounded-r-lg">  
                        <div className="flex gap-2 text-emerald-700 font-medium items-start">  
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />  
                            <p className="text-emerald-800 italic">{section.summary}</p>  
                        </div>  
                    </div>  
                </motion.div>  
            )}  
        </AnimatePresence>  
  
        <div className={`prose prose-slate max-w-none transition-opacity duration-300 ${showSummary ? 'opacity-60' : 'opacity-100'}`}>  
            {section.content}  
        </div>  
    </div>  
);  
  
export const PrivacyPage: React.FC = () => {  
    const [showSummary, setShowSummary] = useState(false);  
  
    const sections: LegalSection[] = [  
        {  
            title: "1. Information We Collect",  
            summary: "We collect your name, email, shipping, and payment details only to fulfill your order.",
            content: <p>We collect information you provide directly, including name, email, shipping address, and payment information when making purchases.</p>,
        },  
        {  
            title: "2. How We Use Your Information",  
            summary: "We use your data strictly to process orders and improve your experience.",
            content: <p>Your information is used to process orders, send communications, improve our services, and comply with legal obligations.</p>,
        },  
        {  
            title: "3. Data Sharing",
            summary: "We never sell your data; we only share it with necessary payment and shipping partners.",
            content: <p>We do not sell your personal data. We may share data with payment processors and shipping carriers.</p>,
        },  
        {  
            title: "4. Your Rights (GDPR)",
            summary: "You have full control to access, update, or delete your personal data at any time.",
            content: <p>EU residents have the right to access, rectify, delete, and port their personal data.</p>,
        },  
        {  
            title: "5. Contact & Data Controller",  
            summary: "Reach out to privacy@hylono.com for any privacy concerns.",
            content: <p>For privacy inquiries: <a href="mailto:privacy@hylono.com">privacy@hylono.com</a></p>,
        }  
    ];  
  
    return (  
        <div className="min-h-screen bg-white pt-10 pb-24">  
            <div className="max-w-3xl mx-auto px-6">  
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>  
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">  
                        <div className="flex items-center gap-3">  
                            <Shield className="text-cyan-500" size={32} />  
                            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                        </div>  
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />  
                    </div>  
                    <p className="text-sm text-slate-400 mb-12">Last updated: January 2026</p>
  
                    <div>  
                        {sections.map((section, idx) => (  
                            <SectionView key={idx} section={section} showSummary={showSummary} />  
                        ))}  
                    </div>  
                </motion.div>  
            </div>  
        </div>  
    );  
};  
  
export const TermsPage: React.FC = () => {  
    const [showSummary, setShowSummary] = useState(false);  
  
    const sections: LegalSection[] = [  
        {  
            title: "1. Acceptance of Terms",  
            summary: "By using our site, you agree to our standard ground rules.",
            content: <p>By using Hylono services, you agree to these Terms of Service.</p>,
        },  
        {  
            title: "2. Products & Services",
            summary: "We provide wellness technology, not certified medical devices.",
            content: <p>Hylono provides bio-optimization technology. All products are for wellness purposes and are not medical devices.</p>,
        },  
        {  
            title: "3. Medical Disclaimer",
            summary: "Our products support wellness but do not replace professional medical advice or care from a qualified clinician.",
            content: <p>Our products are intended for general wellness support only and are not a substitute for evaluation or care from a qualified healthcare professional.</p>,
        },  
        {  
            title: "4. Limitation of Liability",
            summary: "We are responsible for our products up to their purchase price, but not for indirect issues.",
            content: <p>Hylono is not liable for indirect damages. Maximum liability is limited to the purchase price.</p>,
        },  
        {  
            title: "5. Governing Law",  
            summary: "Any legal disputes will be handled under Polish law.",
            content: <p>These terms are governed by Polish law.</p>,
        }  
    ];  
  
    return (  
        <div className="min-h-screen bg-white pt-10 pb-24">  
            <div className="max-w-3xl mx-auto px-6">  
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>  
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">  
                        <div className="flex items-center gap-3">  
                            <FileText className="text-cyan-500" size={32} />  
                            <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
                        </div>  
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />  
                    </div>  
                    <p className="text-sm text-slate-400 mb-12">Last updated: January 2026</p>
  
                    <div>  
                        {sections.map((section, idx) => (  
                            <SectionView key={idx} section={section} showSummary={showSummary} />  
                        ))}  
                    </div>  
                </motion.div>  
            </div>  
        </div>  
    );  
};  
  
export const ReturnsPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. 30-Day Satisfaction Policy",
            summary: "If you're not satisfied within 30 days of delivery, we'll refund you in full. Clear terms, straightforward process.",
            content: (
                <>
                    <p>HYLONO SYSTEMS stands behind every device we sell or rent. All direct purchases made through hylono.com are eligible for a full refund if returned within 30 calendar days of the delivery date, provided the conditions in Section 2 are met.</p>
                    <p>In addition to our 30-day satisfaction policy, EU consumers have a statutory 14-day right of withdrawal from the date of delivery under Directive 2011/83/EU on consumer rights. This right is separate from and does not replace our extended 30-day policy.</p>
                    <p>Rental device returns follow a separate process governed by your rental agreement and the Shipping &amp; Returns policy. The 30-day satisfaction policy applies to outright purchases only.</p>
                </>
            )
        },
        {
            title: "2. Return Eligibility",
            summary: "Your return is eligible if the device is unused (or used as per the protocol guide), returned within 30 days, and in original condition.",
            content: (
                <>
                    <p>To be eligible for a return and refund under our 30-day policy, all of the following conditions must be met:</p>
                    <ul>
                        <li>The return is requested within 30 calendar days of the confirmed delivery date.</li>
                        <li>The device has not been subjected to damage, modification, or misuse beyond the normal usage described in the included protocol guide.</li>
                        <li>All original accessories, cables, controllers, documentation, and packaging are included with the return shipment where possible.</li>
                        <li>The device was purchased directly through hylono.com — not through a third-party reseller, marketplace, or distributor.</li>
                    </ul>
                    <p><strong>Non-eligible items:</strong> Consumable accessories, replacement parts, hygiene accessories, and customised protocol packages are non-returnable. Devices purchased through authorised third-party resellers are subject to that reseller's return policy.</p>
                </>
            )
        },
        {
            title: "3. How to Initiate a Return",
            summary: "Email support@hylono.com with your order number. We'll arrange free collection and process your refund within 5-10 business days.",
            content: (
                <>
                    <p>To initiate a return, follow these steps:</p>
                    <ol>
                        <li><strong>Contact us:</strong> Email <a href="mailto:support@hylono.com">support@hylono.com</a> with the subject line "Return Request — [Your Order Number]". Include your name, order number, and the reason for your return.</li>
                        <li><strong>Receive confirmation:</strong> Our team will respond within 2 business days with a Return Merchandise Authorisation (RMA) number and collection instructions.</li>
                        <li><strong>Arrange collection:</strong> We will schedule a free collection of the device from your delivery address. Please ensure the device is securely packaged — we will provide packaging materials if needed.</li>
                        <li><strong>Inspection &amp; refund:</strong> Once the device is received and inspected at our facility, we will process your full refund within 5 to 10 business days to your original payment method via Stripe.</li>
                    </ol>
                    <p>Do not ship devices back to us without an RMA number. Unsolicited returns cannot be processed.</p>
                </>
            )
        },
        {
            title: "4. Refund Processing",
            summary: "Full refund to your original payment method within 5-10 business days of us receiving the device. We cover return shipping.",
            content: (
                <>
                    <p><strong>Refund amount:</strong> Approved returns within the 30-day window receive a 100% refund of the purchase price paid, including any applicable VAT. Original delivery charges are also refunded for EU consumers exercising their statutory 14-day right of withdrawal.</p>
                    <p><strong>Payment method:</strong> Refunds are returned to the original payment method used at checkout (processed via Stripe). Depending on your bank or card issuer, refunds may take an additional 2 to 5 business days to appear in your account after we initiate the transfer.</p>
                    <p><strong>Return shipping costs:</strong> HYLONO SYSTEMS covers all return shipping and collection costs for eligible 30-day returns. You will not be charged for collection.</p>
                    <p><strong>Deductions:</strong> If a device is returned with damage beyond normal evaluation use, or with missing accessories, we reserve the right to deduct the actual repair or replacement cost from the refund amount. You will receive a written assessment before any deduction is applied.</p>
                </>
            )
        },
        {
            title: "5. Exchanges",
            summary: "We don't do direct exchanges, but you can return and reorder. Contact support and we'll make it as smooth as possible.",
            content: (
                <>
                    <p>We do not offer direct product exchanges at this time. If you would like a different product or configuration, the recommended process is:</p>
                    <ol>
                        <li>Initiate a return for your original order as described in Section 3.</li>
                        <li>Place a new order for the desired product on hylono.com.</li>
                    </ol>
                    <p>If you received a defective or incorrect item, please contact us at <a href="mailto:support@hylono.com">support@hylono.com</a> immediately. Defective or incorrectly shipped items will be replaced or refunded at no cost to you, including priority collection and re-delivery.</p>
                </>
            )
        },
        {
            title: "6. Contact Us",
            summary: "Questions about a return? Email support@hylono.com or use the contact page. We aim to respond within 2 business days.",
            content: (
                <>
                    <p>For all return and refund enquiries, please contact our customer support team:</p>
                    <p><strong>Email:</strong> <a href="mailto:support@hylono.com">support@hylono.com</a><br />
                    <strong>Response time:</strong> Within 2 business days</p>
                    <p>This Returns &amp; Refund Policy was last reviewed in February 2026. HYLONO SYSTEMS reserves the right to update this policy. The current version is always available at hylono.com/returns.</p>
                </>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <ToggleLeft className="text-cyan-500" size={32} />
                            <h1 id="returns-hero-headline" className="text-4xl font-bold text-slate-900">Returns &amp; Refunds</h1>
                        </div>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>
                    <p className="text-sm text-slate-400 mb-12">Last updated: February 2026</p>
                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const CookiePolicyPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. What Are Cookies?",
            summary: "Cookies are small text files stored on your device when you visit our site. They help us make the website work properly and understand how you use it.",
            content: (
                <>
                    <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website operators useful information about how their site is used.</p>
                    <p>HYLONO SYSTEMS uses cookies and similar tracking technologies (such as local storage and session storage) on our website at hylono.com. This Cookie Policy explains what cookies we use, why we use them, and how you can control them.</p>
                    <p>By continuing to use our website, you consent to the use of cookies as described in this policy, except for cookies that require explicit consent under GDPR. You can withdraw or adjust your consent at any time using our Cookie Settings panel.</p>
                </>
            )
        },
        {
            title: "2. Essential Cookies",
            summary: "These cookies make the website work. They cannot be turned off. They don't track anything personal.",
            content: (
                <>
                    <p>Essential cookies are necessary for the website to function correctly. They do not collect personal data for marketing purposes and cannot be disabled via our Cookie Settings panel, as doing so would cause the website to break.</p>
                    <table className="w-full text-sm border-collapse mt-4">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Name</th>
                                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Purpose</th>
                                <th className="text-left py-2 font-semibold text-slate-700">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            <tr className="border-b border-slate-100">
                                <td className="py-2 pr-4 font-mono text-xs">hylono_cart</td>
                                <td className="py-2 pr-4">Stores your shopping cart contents between sessions</td>
                                <td className="py-2">7 days</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-2 pr-4 font-mono text-xs">hylono_session</td>
                                <td className="py-2 pr-4">Maintains your authenticated session when logged in</td>
                                <td className="py-2">Session</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="py-2 pr-4 font-mono text-xs">hylono_announcement_dismissed</td>
                                <td className="py-2 pr-4">Remembers if you have dismissed the announcement banner</td>
                                <td className="py-2">30 days</td>
                            </tr>
                            <tr>
                                <td className="py-2 pr-4 font-mono text-xs">hylono_cookie_consent</td>
                                <td className="py-2 pr-4">Stores your cookie consent preferences</td>
                                <td className="py-2">12 months</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )
        },
        {
            title: "3. Analytics Cookies",
            summary: "We use PostHog to understand how visitors use our site. This data is anonymised and stays within the EU. You can opt out.",
            content: (
                <>
                    <p>We use analytics cookies to understand how visitors interact with our website. This helps us improve the user experience and our services. All analytics data is processed in an anonymised or pseudonymised form.</p>
                    <p><strong>PostHog:</strong> We use PostHog for website analytics. PostHog captures page views, user interactions, and navigation patterns. Data is processed on servers located within the European Union. PostHog does not sell your data to third parties.</p>
                    <table className="w-full text-sm border-collapse mt-4">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Name</th>
                                <th className="text-left py-2 pr-4 font-semibold text-slate-700">Provider</th>
                                <th className="text-left py-2 font-semibold text-slate-700">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600">
                            <tr className="border-b border-slate-100">
                                <td className="py-2 pr-4 font-mono text-xs">ph_*</td>
                                <td className="py-2 pr-4">PostHog (posthog.com)</td>
                                <td className="py-2">12 months</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="mt-4">Analytics cookies require your consent. You can opt out at any time via our <button className="text-cyan-600 underline hover:text-cyan-800" onClick={() => import('./CookieConsent').then(m => m.openCookieSettings())}>Cookie Settings</button>.</p>
                </>
            )
        },
        {
            title: "4. How to Manage Cookies",
            summary: "Use our Cookie Settings panel to opt in or out of non-essential cookies at any time. You can also manage cookies via your browser settings.",
            content: (
                <>
                    <p><strong>Cookie Settings panel:</strong> Click the "Cookie Settings" link in the footer of any page to open our consent manager. You can enable or disable analytics and marketing cookies at any time. Essential cookies cannot be disabled.</p>
                    <p><strong>Browser settings:</strong> You can also manage and delete cookies through your browser settings. Please note that disabling all cookies may affect the functionality of our website. For guidance, visit your browser's help documentation:</p>
                    <ul>
                        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                        <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                    </ul>
                    <p><strong>Do Not Track:</strong> Some browsers offer a "Do Not Track" signal. We honour DNT signals for analytics cookies where technically feasible.</p>
                </>
            )
        },
        {
            title: "5. Contact & Updates",
            summary: "Questions about cookies? Email privacy@hylono.com. This policy is reviewed annually or whenever our cookie usage changes.",
            content: (
                <>
                    <p>For questions about our use of cookies, please contact our privacy team at <a href="mailto:privacy@hylono.com">privacy@hylono.com</a>.</p>
                    <p>This Cookie Policy was last reviewed in February 2026. We may update this policy when we add or remove cookie categories, change providers, or when required by changes in applicable law. Updates will be posted on this page with a revised date.</p>
                </>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <Info className="text-cyan-500" size={32} />
                            <h1 className="text-4xl font-bold text-slate-900">Cookie Policy</h1>
                        </div>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>
                    <p className="text-sm text-slate-400 mb-12">Last updated: February 2026</p>
                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const DisclaimerPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. General Wellness Use",
            summary: "Hylono products are wellness devices designed to support general wellbeing.",
            content: (
                <>
                    <p>{disclaimers.general}</p>
                </>
            )
        },
        {
            title: "2. Research & Educational Content",
            summary: "Research summaries and study references are provided for educational review only.",
            content: (
                <>
                    <p>{disclaimers.research}</p>
                </>
            )
        },
        {
            title: "3. Testimonials & Outcomes",
            summary: "Testimonials and reviews reflect individual experiences and are not promised results.",
            content: (
                <>
                    <p>{disclaimers.testimonial}</p>
                </>
            )
        },
        {
            title: "4. Safety Notes",
            summary: "Safety notes and contraindications are not exhaustive.",
            content: (
                <>
                    <p>{disclaimers.safety}</p>
                </>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <Shield className="text-amber-500" size={32} />
                            <h1 className="text-4xl font-bold text-slate-900">Health Disclaimer</h1>
                        </div>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />
                    </div>
                    <MedicalDisclaimer type="general" variant="warning" className="mb-12" />
                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={showSummary} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const AccessibilityPage: React.FC = () => {
    const sections: LegalSection[] = [
        {
            title: "Our Commitment",
            summary: "Hylono is committed to making hylono.com accessible to everyone, including people with disabilities.",
            content: (
                <>
                    <p>HYLONO SYSTEMS is committed to ensuring digital accessibility for people with disabilities. We continuously work to improve the user experience for everyone and apply relevant accessibility standards.</p>
                    <p>We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> as published by the World Wide Web Consortium (W3C). These guidelines explain how to make web content more accessible to people with disabilities.</p>
                    <p>This website is also designed to comply with the <strong>EU Web Accessibility Directive</strong> (Directive (EU) 2016/2102) and the <strong>European Accessibility Act</strong> (Directive 2019/882), which come into force for private sector services from 28 June 2025.</p>
                </>
            )
        },
        {
            title: "Accessibility Features",
            summary: "This site includes keyboard navigation, screen reader support, skip links, ARIA labels, and reduced motion support.",
            content: (
                <>
                    <p>The following accessibility features are implemented on hylono.com:</p>
                    <ul>
                        <li><strong>Keyboard navigation:</strong> All interactive elements are navigable using a keyboard. Tab order follows a logical document flow.</li>
                        <li><strong>Skip to main content:</strong> A "Skip to main content" link is available at the top of every page for keyboard and screen reader users.</li>
                        <li><strong>ARIA landmarks and labels:</strong> Key regions (navigation, main content, footer) are labelled with ARIA landmarks. Interactive elements include descriptive ARIA labels.</li>
                        <li><strong>Reduced motion:</strong> The site respects the <code>prefers-reduced-motion</code> media query. Users who have enabled reduced motion in their operating system settings will see simplified, non-animated versions of transitions and effects.</li>
                        <li><strong>Colour contrast:</strong> We aim to meet a minimum 4.5:1 contrast ratio for normal text and 3:1 for large text and UI components.</li>
                        <li><strong>Scalable text:</strong> All text can be resized up to 200% without loss of content or functionality.</li>
                        <li><strong>Alt text:</strong> Meaningful images include descriptive alternative text. Decorative images are marked as such.</li>
                        <li><strong>Focus indicators:</strong> Visible focus outlines are provided for all keyboard-navigable elements.</li>
                    </ul>
                </>
            )
        },
        {
            title: "Known Limitations",
            summary: "Some older content and third-party embeds may not fully meet WCAG 2.1 AA. We are actively working to address these.",
            content: (
                <>
                    <p>Despite our best efforts, some content on our website may not yet fully conform to WCAG 2.1 Level AA. Known limitations include:</p>
                    <ul>
                        <li><strong>Third-party content:</strong> Some embedded third-party tools (such as payment widgets and live chat) may not fully conform to WCAG 2.1 AA. We are working with our suppliers to improve this.</li>
                        <li><strong>Legacy PDF documents:</strong> Some downloadable documents may not be fully tagged for screen reader access. We are working to remediate these.</li>
                        <li><strong>Complex data visualisations:</strong> Some charts and interactive product comparison tools may have limited keyboard accessibility. Text-based alternatives are provided where possible.</li>
                        <li><strong>Video content:</strong> Closed captions are not yet available for all video content on the site. We are progressively adding captions to all video assets.</li>
                    </ul>
                    <p>We are actively working to address these limitations. If you encounter a specific barrier, please contact us and we will prioritise a resolution.</p>
                </>
            )
        },
        {
            title: "Feedback & Contact",
            summary: "Encountered an accessibility barrier? Email accessibility@hylono.com and we'll respond within 5 business days.",
            content: (
                <>
                    <p>We welcome feedback on the accessibility of hylono.com. If you experience any barriers that prevent you from accessing content or using a feature, please let us know:</p>
                    <p><strong>Email:</strong> <a href="mailto:accessibility@hylono.com">accessibility@hylono.com</a><br />
                    <strong>Response time:</strong> We aim to respond to accessibility requests within 5 business days.<br />
                    <strong>Alternative formats:</strong> If you require content in an alternative format (e.g. plain text, large print, audio), please contact us and we will do our best to accommodate your request.</p>
                    <p>If you are not satisfied with our response, you may escalate to your national digital accessibility authority. In the Netherlands, this is the <a href="https://www.digitaleoverheid.nl" target="_blank" rel="noopener noreferrer">Ministerie van Binnenlandse Zaken</a>.</p>
                    <p>This Accessibility Statement was last reviewed in February 2026 and will be updated annually or following any significant redesign of the website.</p>
                </>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-10 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="text-cyan-500" size={32} />
                        <h1 className="text-4xl font-bold text-slate-900">Accessibility Statement</h1>
                    </div>
                    <p className="text-sm text-slate-400 mb-12">Last reviewed: February 2026 · Standard: WCAG 2.1 Level AA</p>
                    <div>
                        {sections.map((section, idx) => (
                            <SectionView key={idx} section={section} showSummary={false} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export const ShippingPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);  
  
    const sections: LegalSection[] = [  
        {  
            title: "1. Delivery Information",  
            summary: "White-glove delivery within 5-10 EU business days. Professional setup help available. We can't deliver to PO boxes.",  
            content: (  
                <>  
                    <p>HYLONO SYSTEMS provides a white-glove delivery service for all rental devices. Delivery is included in your rental price at no additional charge.</p>  
                    <ul>  
                        <li><strong>Delivery timeframe:</strong> Within the European Union, deliveries are typically completed within 5 to 10 business days of rental agreement confirmation.</li>  
                        <li><strong>Installation assistance:</strong> Professional installation assistance and a device orientation session is available upon request at no extra charge for standard installations.</li>  
                        <li><strong>Delivery confirmation:</strong> An adult signature will be required at the point of delivery to confirm receipt and condition of the device.</li>  
                        <li><strong>Address requirements:</strong> We are unable to deliver to PO boxes or unmanned premises. Please ensure someone is available to receive and sign for the delivery.</li>  
                        <li><strong>Access requirements:</strong> Please ensure adequate access and space for delivery. Hyperbaric chambers require a minimum doorway width of 80 cm for installation.</li>  
                    </ul>  
                </>  
            )  
        },  
        {  
            title: "2. Rental Device Return Process",  
            summary: "Contact support@hylono.com to start a return. We provide packaging and collect within 10 business days. Device must be clean and complete.",  
            content: (  
                <>  
                    <p>When your rental period ends (either at cancellation or end of agreement), the return process is as follows:</p>  
                    <ul>  
                        <li><strong>Initiate return:</strong> Contact our logistics team at <a href="mailto:support@hylono.com">support@hylono.com</a> to initiate the return process. Please include your rental agreement number in your message.</li>  
                        <li><strong>Packaging:</strong> Hylono will provide appropriate protective packaging materials for the safe return of the device at no charge to you.</li>  
                        <li><strong>Collection schedule:</strong> Our logistics team will schedule a collection appointment within 10 business days of your cancellation confirmation.</li>  
                        <li><strong>Device condition:</strong> The device must be returned clean, fully assembled, and complete with all accessories, cables, controllers, and documentation originally provided.</li>  
                        <li><strong>Data erasure:</strong> If applicable, please perform a factory reset of the device before return. Hylono will conduct a data wipe upon return in accordance with our privacy policy.</li>  
                    </ul>  
                </>  
            )  
        },  
        {  
            title: "3. Damage & Missing Items",  
            summary: "Devices are inspected on return. Normal wear is fine. Damage or missing accessories will be charged. Report shipping damage within 48 hours.",  
            content: (  
                <>  
                    <p>All devices are inspected by our technical team upon return. The following policies apply:</p>  
                    <ul>  
                        <li><strong>Normal wear and tear:</strong> Minor surface scratches, natural fading, and normal operational wear consistent with careful use are accepted and will not be charged.</li>  
                        <li><strong>Significant damage:</strong> Damage beyond normal wear, including but not limited to cracks, dents, liquid ingress, burned components, or structural damage, will be assessed and charged at the actual repair or part replacement cost.</li>  
                        <li><strong>Missing accessories:</strong> Accessories, cables, controllers, or other components not returned with the device will be charged at their current retail replacement cost.</li>  
                        <li><strong>Shipping damage:</strong> If you receive a device that appears damaged during transit, you must report this to us within 48 hours of delivery by emailing <a href="mailto:support@hylono.com">support@hylono.com</a> with photographs of the damage and packaging. Failure to report within this window may affect your ability to claim.</li>  
                    </ul>  
                    <p>You will receive a written damage assessment within 10 business days of the device being inspected. Damage charges will be applied to your payment method on file.</p>  
                </>  
            )  
        },  
        {  
            title: "4. International Shipping",  
            summary: "We ship within EU member states only. No extra customs charges within EU. For non-EU inquiries, email hello@hylono.com.",  
            content: (  
                <>  
                    <p>HYLONO SYSTEMS currently provides rental services and device delivery exclusively within European Union (EU) member states.</p>  
                    <p><strong>Within the EU:</strong> All deliveries within EU member states are included in your rental price. As all our operations are conducted within the EU single market, no customs duties or import taxes will be levied on deliveries.</p>  
                    <p><strong>VAT:</strong> VAT is applied at the rate applicable in your EU member state of residence, in accordance with EU VAT rules.</p>  
                    <p><strong>Non-EU inquiries:</strong> We do not currently offer rental services outside the European Union. If you are based outside the EU and are interested in Hylono products or partnership opportunities, please contact us at <a href="mailto:hello@hylono.com">hello@hylono.com</a>.</p>  
                </>  
            )  
        }  
    ];  
  
    return (  
        <div className="min-h-screen bg-white pt-10 pb-24">  
            <div className="max-w-3xl mx-auto px-6">  
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>  
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">  
                        <h1 id="shipping-hero-headline" className="text-4xl font-bold text-slate-900">Shipping & Returns</h1>
                        <HumanSummaryToggle enabled={showSummary} onToggle={() => setShowSummary(!showSummary)} />  
                    </div>  
                    <p className="text-sm text-slate-400 mb-12">Last updated: February 2026</p>  
  
                    <div>  
                        {sections.map((section, idx) => (  
                            <SectionView key={idx} section={section} showSummary={showSummary} />  
                        ))}  
                    </div>  
                </motion.div>  
            </div>  
        </div>  
    );  
};  
