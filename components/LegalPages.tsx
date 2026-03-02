"use client";

import React, { useState } from 'react';  
import { motion, AnimatePresence } from 'motion/react';  
import { Shield, FileText, ToggleLeft, ToggleRight, Info, CheckCircle } from 'lucide-react';
  
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
            summary: "We collect your name, email, shipping address, payment info, device usage data, and basic browser info to operate our rental service.",  
            content: (  
                <>  
                    <p>HYLONO SYSTEMS collects the following categories of personal data:</p>  
                    <ul>  
                        <li><strong>Identity data:</strong> First name, last name, username or similar identifier.</li>  
                        <li><strong>Contact data:</strong> Billing address, delivery address, email address, and telephone number.</li>  
                        <li><strong>Financial data:</strong> Payment card details and bank account information, processed securely via Stripe. We do not store full card numbers.</li>  
                        <li><strong>Rental contract data:</strong> Rental agreement details, device serial numbers, delivery address, rental period, and payment schedule.</li>  
                        <li><strong>Device usage data:</strong> Aggregated session data from rented devices (e.g. session count, duration) for service quality and maintenance purposes.</li>  
                        <li><strong>Technical data:</strong> IP address, browser type and version, time zone setting, browser plug-in types, operating system and platform.</li>  
                        <li><strong>Usage data:</strong> Information about how you use our website and services.</li>  
                        <li><strong>Marketing data:</strong> Your preferences in receiving marketing communications from us.</li>  
                    </ul>  
                    <p>We collect this data when you register on our website, place an order, enter into a rental contract, contact customer support, or subscribe to our newsletter.</p>  
                </>  
            )  
        },  
        {  
            title: "2. How We Use Your Information",  
            summary: "We use your data to process orders, manage your rental contract, communicate service updates, and comply with EU law. We always have a legal basis.",  
            content: (  
                <>  
                    <p>We use your personal data for the following purposes and on the following legal bases under GDPR:</p>  
                    <ul>  
                        <li><strong>Contract performance:</strong> Processing your order, managing your rental agreement, arranging delivery and collection, and providing customer support.</li>  
                        <li><strong>Legitimate interests:</strong> Improving our website and services, fraud prevention, device monitoring for maintenance purposes, and direct marketing of similar products where permitted.</li>  
                        <li><strong>Legal obligation:</strong> Compliance with applicable EU and member state laws, including tax, accounting, and consumer protection requirements.</li>  
                        <li><strong>Consent:</strong> Sending you marketing communications about new products and services where you have opted in. You may withdraw consent at any time.</li>  
                    </ul>  
                    <p>We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason compatible with the original purpose.</p>  
                </>  
            )  
        },  
        {  
            title: "3. Data Sharing & Third Parties",  
            summary: "We never sell your data. We share it only with Stripe (payments) and our shipping partners. Data stays within the EU.",  
            content: (  
                <>  
                    <p>We do not sell, rent, or trade your personal data to third parties. We may share your data with the following categories of third parties:</p>  
                    <ul>  
                        <li><strong>Payment processors:</strong> Stripe, Inc. processes all payment transactions. Stripe is certified to PCI Service Provider Level 1. Their privacy policy is available at stripe.com/privacy.</li>  
                        <li><strong>Shipping and logistics carriers:</strong> We share your delivery address and contact details with our logistics partners to fulfil delivery and collection of rental devices.</li>  
                        <li><strong>Professional advisers:</strong> Lawyers, accountants, and auditors who are subject to professional confidentiality obligations.</li>  
                        <li><strong>Regulators and authorities:</strong> Tax authorities, law enforcement, and other regulatory bodies where required by law.</li>  
                    </ul>  
                    <p>All personal data is processed and stored within the European Union. We do not transfer personal data to countries outside the EU/EEA. A full list of sub-processors is available upon request by contacting <a href="mailto:privacy@hylono.com">privacy@hylono.com</a>.</p>  
                </>  
            )  
        },  
        {  
            title: "4. Your Rights Under GDPR",  
            summary: "You have full rights to access, correct, delete, or export your data. Contact privacy@hylono.com or complain to your national DPA.",  
            content: (  
                <>  
                    <p>As a data subject under the General Data Protection Regulation (GDPR), you have the following rights:</p>  
                    <ul>  
                        <li><strong>Right of access:</strong> You may request a copy of the personal data we hold about you.</li>  
                        <li><strong>Right to rectification:</strong> You may request correction of inaccurate or incomplete personal data.</li>  
                        <li><strong>Right to erasure (right to be forgotten):</strong> You may request deletion of your personal data where there is no compelling reason for its continued processing.</li>  
                        <li><strong>Right to restriction:</strong> You may request that we restrict the processing of your data in certain circumstances.</li>  
                        <li><strong>Right to data portability:</strong> You may request transfer of your personal data to you or a third party in a structured, commonly used, machine-readable format.</li>  
                        <li><strong>Right to object:</strong> You may object to processing based on our legitimate interests or for direct marketing purposes.</li>  
                        <li><strong>Rights related to automated decision-making:</strong> You have the right not to be subject to solely automated decision-making that produces legal or similarly significant effects.</li>  
                    </ul>  
                    <p>To exercise any of these rights, please contact us at <a href="mailto:privacy@hylono.com">privacy@hylono.com</a>. We will respond within 30 days. You also have the right to lodge a complaint with your national data protection authority (DPA). In the Netherlands, this is the Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).</p>  
                </>  
            )  
        },  
        {  
            title: "5. Contact & Data Controller",  
            summary: "HYLONO SYSTEMS is the data controller. Contact privacy@hylono.com for any privacy questions. We respond within 30 days.",  
            content: (  
                <>  
                    <p>The data controller responsible for your personal data is:</p>  
                    <p><strong>HYLONO SYSTEMS</strong><br />  
                    Email: <a href="mailto:privacy@hylono.com">privacy@hylono.com</a><br />  
                    Website: hylono.com</p>  
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or the processing of your personal data, please contact our privacy team at <a href="mailto:privacy@hylono.com">privacy@hylono.com</a>. We aim to respond to all legitimate requests within 30 calendar days.</p>  
                    <p>This Privacy Policy was last reviewed and updated in January 2026. We may update this policy from time to time; the latest version will always be available on our website.</p>  
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
                            <Shield className="text-cyan-500" size={32} />  
                            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
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
  
export const TermsPage: React.FC = () => {  
    const [showSummary, setShowSummary] = useState(false);  
  
    const sections: LegalSection[] = [  
        {  
            title: "1. Acceptance of Terms",  
            summary: "By using Hylono's website or services, you accept these terms. You must be 18 or over. EU consumer rights always apply.",  
            content: (  
                <>  
                    <p>By accessing or using the website at hylono.com, placing an order, or entering into a rental agreement with HYLONO SYSTEMS, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>  
                    <p>You must be at least 18 years of age to use our services and enter into a binding rental agreement. By using our services, you represent and warrant that you are 18 or older.</p>  
                    <p>These terms are governed by applicable EU consumer law, including Directive 2011/83/EU on consumer rights. Nothing in these terms affects your statutory rights as a consumer under applicable EU or national law.</p>  
                </>  
            )  
        },  
        {  
            title: "2. Rental Terms & Conditions",  
            summary: "Minimum 3-month rental. 30-day cancellation notice needed. Return device in original condition. Damage beyond fair wear may be charged.",  
            content: (  
                <>  
                    <p>The following conditions apply to all device rental agreements with HYLONO SYSTEMS:</p>  
                    <ul>  
                        <li><strong>Minimum rental period:</strong> All rental agreements have a minimum term of 3 (three) calendar months from the date of delivery.</li>  
                        <li><strong>Payment schedule:</strong> Monthly rental payments are due on the same calendar date each month as the initial subscription date. Payments are processed automatically via Stripe.</li>  
                        <li><strong>Cancellation notice:</strong> After the minimum term, you may cancel your rental by providing 30 days written notice to support@hylono.com. Cancellation takes effect at the end of the notice period.</li>  
                        <li><strong>Device condition on return:</strong> The device must be returned in its original condition, including all accessories, cables, user manuals, and original packaging where available. Normal wear and tear is expected and accepted.</li>  
                        <li><strong>Damage charges:</strong> Damage beyond normal fair wear and tear, including cracks, liquid damage, or missing components, will be assessed and charged at repair or replacement cost following return inspection.</li>  
                        <li><strong>Ownership:</strong> The device remains the property of HYLONO SYSTEMS at all times. You may not sublease, pledge, sell, or otherwise transfer the device to any third party.</li>  
                    </ul>  
                </>  
            )  
        },  
        {  
            title: "3. Product & Service Descriptions",  
            summary: "Our devices are wellness products, not medical devices. They are not intended to diagnose or treat disease. Consult your doctor first.",  
            content: (  
                <>  
                    <p>HYLONO SYSTEMS provides wellness technology devices including hyperbaric oxygen chambers (HBOT), pulsed electromagnetic field (PEMF) devices, red light therapy (RLT) panels, and hydrogen inhalation therapy devices for rental.</p>  
                    <p><strong>Important notice:</strong> These devices are wellness and lifestyle products. They are NOT classified as medical devices under EU Regulation 2017/745 (MDR) and are NOT intended to diagnose, treat, cure, monitor, or prevent any medical condition or disease.</p>  
                    <p>Individual results from the use of wellness devices vary significantly between users. We make no warranty or guarantee regarding specific outcomes. Before commencing use of any wellness device, particularly if you have an existing health condition, are pregnant, or are taking medication, you should consult a qualified healthcare professional.</p>  
                    <p>We reserve the right to update product specifications, features, and descriptions at any time. Images on our website are for illustrative purposes only.</p>  
                </>  
            )  
        },  
        {  
            title: "4. Payment & Pricing",  
            summary: "Prices are in euros including VAT. Payments via Stripe. Failed payments may suspend service. First month has a 30-day money-back guarantee.",  
            content: (  
                <>  
                    <p>All prices displayed on the Hylono website are denominated in Euros (EUR) and include Value Added Tax (VAT) where applicable under EU law. Your applicable VAT rate will be displayed at checkout based on your country of residence.</p>  
                    <p>All payment transactions are processed securely by Stripe, Inc. By providing your payment details, you authorise us to charge the applicable rental fee on the scheduled date each month. You agree to Stripe's terms of service in addition to these terms.</p>  
                    <p><strong>Failed payments:</strong> If a scheduled payment fails, we will notify you by email and retry the charge. If payment remains outstanding for more than 14 days, we reserve the right to suspend the rental service and arrange collection of the device. Continued non-payment may result in debt recovery proceedings.</p>  
                    <p><strong>30-Day money-back guarantee:</strong> If you are not satisfied with your rental device during the first 30 calendar days of your rental agreement, you may return the device and receive a full refund of your first month rental payment. This guarantee applies to first-time rentals only and is subject to the device being returned in original condition.</p>  
                </>  
            )  
        },  
        {  
            title: "5. Governing Law",  
            summary: "These terms are governed by Dutch law. Disputes go to Amsterdam courts. Your EU consumer rights are always protected.",  
            content: (  
                <>  
                    <p>These Terms of Service and any disputes or claims arising in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of the Netherlands.</p>  
                    <p>Any dispute arising out of or in connection with these terms, including any question regarding their existence, validity, or termination, shall be subject to the exclusive jurisdiction of the courts of Amsterdam, Netherlands.</p>  
                    <p>Nothing in this clause shall limit or exclude any consumer protection rights you have under the mandatory laws of your country of residence within the European Union. EU consumers may also use the European Commission's Online Dispute Resolution platform at ec.europa.eu/odr.</p>  
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
                            <FileText className="text-cyan-500" size={32} />  
                            <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
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
  
export const ReturnsPage: React.FC = () => {
    const [showSummary, setShowSummary] = useState(false);

    const sections: LegalSection[] = [
        {
            title: "1. 30-Day Satisfaction Guarantee",
            summary: "If you're not satisfied within 30 days of delivery, we'll refund you in full. No small print, no hassle.",
            content: (
                <>
                    <p>HYLONO SYSTEMS stands behind every device we sell or rent. All direct purchases made through hylono.com are eligible for a full refund if returned within 30 calendar days of the delivery date, provided the conditions in Section 2 are met.</p>
                    <p>In addition to our 30-day satisfaction guarantee, EU consumers have a statutory 14-day right of withdrawal from the date of delivery under Directive 2011/83/EU on consumer rights. This right is separate from and does not replace our extended 30-day policy.</p>
                    <p>Rental device returns follow a separate process governed by your rental agreement and the Shipping &amp; Returns policy. The 30-day satisfaction guarantee applies to outright purchases only.</p>
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
                            <h1 className="text-4xl font-bold text-slate-900">Returns &amp; Refunds</h1>
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
            title: "1. Wellness Devices — Not Medical Devices",
            summary: "Hylono devices are wellness products. They are not medical devices and are not intended to diagnose, treat, cure, or prevent any disease.",
            content: (
                <>
                    <p>The devices available through HYLONO SYSTEMS — including hyperbaric oxygen chambers (HBOT), pulsed electromagnetic field (PEMF) devices, red light therapy (RLT) panels, hydrogen inhalation systems, and all other products in our range — are <strong>wellness and lifestyle technology products</strong>.</p>
                    <p>These devices are <strong>not classified as medical devices</strong> under EU Regulation 2017/745 (EU MDR) and are <strong>not intended to</strong>:</p>
                    <ul>
                        <li>Diagnose, prevent, monitor, treat, or alleviate any disease or injury</li>
                        <li>Investigate, replace, or modify the anatomy or a physiological or pathological process or state</li>
                        <li>Control or support conception</li>
                    </ul>
                    <p>Use of Hylono devices does not constitute medical treatment and should not replace professional medical care.</p>
                </>
            )
        },
        {
            title: "2. Consult Your Healthcare Provider",
            summary: "Always consult a qualified doctor before using any wellness device, especially if you have existing health conditions, are pregnant, or take medication.",
            content: (
                <>
                    <p>Before commencing use of any wellness device, you should consult a qualified and licensed healthcare professional, particularly if:</p>
                    <ul>
                        <li>You have or have been diagnosed with any chronic or acute medical condition</li>
                        <li>You are pregnant, planning to become pregnant, or breastfeeding</li>
                        <li>You are taking any prescription or over-the-counter medication</li>
                        <li>You have recently undergone surgery or a medical procedure</li>
                        <li>You have implanted medical devices (e.g., pacemakers, metal implants)</li>
                        <li>You have a history of seizures, epilepsy, or neurological conditions</li>
                        <li>You are under 18 years of age</li>
                    </ul>
                    <p>This is not an exhaustive list. When in doubt, always seek professional medical advice before starting any new wellness protocol.</p>
                </>
            )
        },
        {
            title: "3. No Medical Claims or Guarantees",
            summary: "We make no medical claims. Any results mentioned are individual experiences. Wellness outcomes vary significantly between people.",
            content: (
                <>
                    <p>HYLONO SYSTEMS does not make any claims that our devices diagnose, treat, cure, prevent, or mitigate any medical condition or disease. Any testimonials, case studies, research summaries, or user experiences shared on our website or in our marketing materials:</p>
                    <ul>
                        <li>Reflect individual experiences and results only</li>
                        <li>Are not typical or guaranteed outcomes</li>
                        <li>Do not constitute medical advice or endorsement of specific health outcomes</li>
                        <li>Should not be interpreted as a substitute for professional medical advice</li>
                    </ul>
                    <p>The effectiveness of wellness technologies varies significantly between individuals based on genetics, health status, lifestyle, age, and compliance with protocol guidelines. Hylono does not guarantee any specific result from the use of its devices.</p>
                </>
            )
        },
        {
            title: "4. Research References",
            summary: "Research cited on our site is provided for educational purposes. It does not constitute medical evidence specific to our devices or a guarantee of results.",
            content: (
                <>
                    <p>Our website, Research Hub, and marketing materials may reference peer-reviewed research, clinical studies, and scientific literature related to the technologies used in our devices. This content is provided for <strong>educational and informational purposes only</strong>.</p>
                    <p>Referenced studies may involve:</p>
                    <ul>
                        <li>Devices of different specifications or configurations than our products</li>
                        <li>Clinical populations (patients under medical supervision) rather than healthy wellness users</li>
                        <li>Research not specifically involving HYLONO SYSTEMS products</li>
                        <li>Preliminary or inconclusive findings not yet replicated</li>
                    </ul>
                    <p>Citing a study does not constitute a medical claim about our specific products. HYLONO SYSTEMS recommends that users review all referenced research in full and consult their healthcare provider to evaluate applicability to their individual circumstances.</p>
                </>
            )
        },
        {
            title: "5. Limitation of Liability",
            summary: "Hylono is not liable for health outcomes from device use. Always follow the protocol guide and consult a doctor. Use at your own risk.",
            content: (
                <>
                    <p>To the fullest extent permitted by applicable law, HYLONO SYSTEMS and its directors, officers, employees, and agents shall not be liable for any injury, illness, adverse reaction, or health outcome arising from or related to:</p>
                    <ul>
                        <li>The use or misuse of any Hylono wellness device</li>
                        <li>Failure to follow the included protocol guide or safety instructions</li>
                        <li>Use of a device by individuals with known contraindications</li>
                        <li>Reliance on any content, testimonials, or research summaries on our website as a substitute for professional medical advice</li>
                    </ul>
                    <p>Nothing in this disclaimer limits or excludes our liability for death or personal injury caused by our negligence, fraud, or any liability that cannot lawfully be limited or excluded under applicable EU consumer law.</p>
                    <p>For a full list of device-specific contraindications and safety guidelines, refer to your device's user manual or contact us at <a href="mailto:support@hylono.com">support@hylono.com</a>.</p>
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
                    <p className="text-sm text-slate-400 mb-4">Last updated: February 2026</p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-12">
                        <p className="text-amber-800 font-medium text-sm">Important: Hylono devices are wellness products, not medical devices. They are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before use.</p>
                    </div>
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
                        <h1 className="text-4xl font-bold text-slate-900">Shipping & Returns</h1>
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

