import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (skipping for MVP, using standard fonts)
// Font.register({ family: 'Outfit', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    header: {
        height: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        backgroundColor: '#0f172a', // Hylono Slate
    },
    socialHeader: {
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        padding: 20,
    },
    hylonoBadge: {
        color: 'white',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    heroSection: {
        height: '40%',
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#334155',
        textAlign: 'center',
        padding: 20,
    },
    contentSection: {
        padding: 40,
    },
    socialContent: {
        padding: 30,
        flex: 1,
        justifyContent: 'center',
    },
    partnerBrand: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        color: '#0f172a',
    },
    socialTitle: {
        fontSize: 24,
        marginBottom: 15,
        color: '#0f172a',
        textAlign: 'center',
    },
    body: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#334155',
        marginBottom: 30,
    },
    socialBody: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#334155',
        textAlign: 'center',
        marginBottom: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#f1f5f9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    socialFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#f1f5f9',
    },
    disclaimer: {
        fontSize: 8,
        color: '#94a3b8',
        maxWidth: '70%',
    },
    socialDisclaimer: {
        fontSize: 6,
        color: '#94a3b8',
        textAlign: 'center',
    },
    qrPlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: 'black',
    }
});

interface TemplateProps {
    clinicName: string;
    brandColor: string;
    title: string;
    body: string;
    modality: string;
    logoUrl?: string | null;
    qrCodeUrl?: string | null;
    backgroundImage?: string | null;
    theme?: string;
}

const getDisclaimer = (modality: string) => {
    return `*Disclaimer: The ${modality} technology provided by Hylono is for wellness purposes only. It is not intended to assess, treat, support, or replace care for any health condition. Consult a qualified healthcare professional before use.`;
};

export const A4PosterTemplate: React.FC<TemplateProps> = ({ clinicName, brandColor, title, body, modality, logoUrl, qrCodeUrl, backgroundImage, theme }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.hylonoBadge}>Verified Technology</Text>
                <Text style={{ color: 'white', fontSize: 14 }}>HYLONO</Text>
            </View>

            {/* Content */}
            <View style={styles.contentSection}>
                {logoUrl && <Image src={logoUrl} style={{ width: 100, height: 50, objectFit: 'contain', marginBottom: 20 }} />}
                {!logoUrl && <Text style={[styles.partnerBrand, { color: brandColor }]}>{clinicName.toUpperCase()}</Text>}

                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>

                {backgroundImage && (
                    <Image src={backgroundImage} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginTop: 20 }} />
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.disclaimer}>
                    {getDisclaimer(modality)}
                </Text>
                {qrCodeUrl ? (
                    <Image src={qrCodeUrl} style={{ width: 60, height: 60 }} />
                ) : (
                    <View style={[styles.qrPlaceholder, { backgroundColor: brandColor }]} />
                )}
            </View>
        </Page>
    </Document>
);

export const SocialSquareTemplate: React.FC<TemplateProps> = ({ clinicName, brandColor, title, body, modality, logoUrl, qrCodeUrl, backgroundImage, theme }) => (
    <Document>
        <Page size={[1080, 1080]} style={styles.page}>
            {backgroundImage && (
                <Image src={backgroundImage} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            )}
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.9)' }} />

            <View style={[styles.socialHeader, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.hylonoBadge, { color: '#0f172a' }]}>Verified Technology</Text>
            </View>

            <View style={styles.socialContent}>
                {logoUrl ? (
                    <Image src={logoUrl} style={{ height: 80, objectFit: 'contain', alignSelf: 'center', marginBottom: 20 }} />
                ) : (
                    <Text style={[styles.partnerBrand, { color: brandColor, textAlign: 'center' }]}>{clinicName.toUpperCase()}</Text>
                )}

                <Text style={styles.socialTitle}>{title}</Text>
                <Text style={styles.socialBody}>{body}</Text>
            </View>

            <View style={[styles.socialFooter, { backgroundColor: 'transparent', flexDirection: 'column', gap: 20 }]}>
                {qrCodeUrl && <Image src={qrCodeUrl} style={{ width: 120, height: 120 }} />}
                <Text style={styles.socialDisclaimer}>
                    {getDisclaimer(modality)}
                </Text>
            </View>
        </Page>
    </Document>
);

export const SocialStoryTemplate: React.FC<TemplateProps> = ({ clinicName, brandColor, title, body, modality, logoUrl, qrCodeUrl, backgroundImage, theme }) => (
    <Document>
        <Page size={[1080, 1920]} style={{ backgroundColor: '#000' }}>
            {backgroundImage && (
                <Image src={backgroundImage} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            )}
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' }} />

            <View style={[styles.socialHeader, { height: '15%', backgroundColor: 'transparent' }]}>
                <Text style={styles.hylonoBadge}>Verified Technology</Text>
            </View>
            <View style={styles.socialContent}>
                {logoUrl ? (
                    <Image src={logoUrl} style={{ height: 100, objectFit: 'contain', alignSelf: 'center', marginBottom: 40 }} />
                ) : (
                    <Text style={[styles.partnerBrand, { color: brandColor, textAlign: 'center' }]}>{clinicName.toUpperCase()}</Text>
                )}
                <Text style={[styles.socialTitle, { fontSize: 60, color: 'white' }]}>{title}</Text>
                <Text style={[styles.socialBody, { fontSize: 24, color: 'white' }]}>{body}</Text>
            </View>
            <View style={[styles.socialFooter, { padding: 60, backgroundColor: 'transparent', flexDirection: 'column', gap: 30 }]}>
                {qrCodeUrl && (
                    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 20 }}>
                        <Image src={qrCodeUrl} style={{ width: 200, height: 200 }} />
                    </View>
                )}
                <Text style={[styles.socialDisclaimer, { color: 'rgba(255,255,255,0.7)', fontSize: 14 }]}>
                    {getDisclaimer(modality)}
                </Text>
            </View>
        </Page>
    </Document>
);
