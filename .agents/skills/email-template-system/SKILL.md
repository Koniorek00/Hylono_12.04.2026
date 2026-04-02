# SKILL: Email Template System
**Used by**: email-notification-engineer

---

## Technology Stack
- **Templating**: React Email (JSX-based email components)
- **Sending**: Resend (primary) or SendGrid (fallback)
- **Testing**: Email on Acid or Litmus for client testing

## Base Template Structure
```tsx
// emails/base/BaseEmail.tsx
import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

interface BaseEmailProps {
  preview: string;
  children: React.ReactNode;
}

export const BaseEmail = ({ preview, children }: BaseEmailProps) => (
  <Html lang="en">
    <Head />
    <Body style={bodyStyle}>
      <Container style={containerStyle}>
        {/* Header: Hylono logo */}
        <Section style={headerStyle}>
          <img src="https://hylono.com/images/logo-email.png" 
               alt="Hylono" width="120" height="40" />
        </Section>
        
        {/* Content */}
        {children}
        
        {/* Footer */}
        <Section style={footerStyle}>
          <Text>Hylono | [Address] | [EU Registration]</Text>
          <Text>
            <a href="{{{unsubscribe_url}}}">Unsubscribe</a> · 
            <a href="https://hylono.com/privacy">Privacy Policy</a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles: inline (email clients don't support <style> well)
const bodyStyle = { backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' };
const containerStyle = { maxWidth: '600px', margin: '0 auto', backgroundColor: '#FFFFFF' };
```

## Rental Lifecycle — Critical Templates

### 1. Rental Confirmation
```
Trigger: rental.created (state: RESERVED)
Type: Transactional
Subject: "Your Hylono rental is confirmed 🎉"
Preheader: "Delivery within [2-3 business days]. Here's what happens next."
Content:
  - Order summary (device, duration, address)
  - Delivery timeline
  - What to expect on arrival
  - Protocol guide download link
  - Support contact
CTA: "View Your Rental"
```

### 2. Welcome + Protocol Guide
```
Trigger: rental.activated (state: ACTIVE) — send day 1
Type: Transactional
Subject: "Your Hylono [Device] is ready — start your protocol"
Preheader: "Your week-by-week guide is inside."
Content:
  - Welcome message
  - Protocol guide inline + PDF download
  - Week 1 setup instructions
  - Safety reminder (mandatory)
  - Support/onboarding call offer
CTA: "View Full Protocol"
```

### 3. Week 1 Check-in
```
Trigger: 7 days after rental.activated
Type: Transactional (protocol-related)
Subject: "How's week 1 going? [First name]"
Preheader: "Tips for sessions 2-7 and what to notice."
```

### 4. Extension Offer
```
Trigger: 7 days before rental end date
Type: Transactional (contract-related)
Subject: "Your rental ends in 7 days — extend or return?"
Preheader: "No decision needed right now. Here are your options."
Content:
  - Current rental summary
  - Extension options (30/60/90 days) with pricing
  - Return process reminder
  - Upsell: "Ready to stack your protocols?"
CTA: "Extend My Rental" (primary) | "Request Return" (secondary)
```

## GDPR Email Classification
| Email | Type | Consent Required | Unsubscribe Required |
|-------|------|-----------------|---------------------|
| Rental confirmation | Transactional | No | No (but include) |
| Protocol guides | Transactional | No | No |
| Check-ins (protocol) | Transactional | No | Yes (can opt-out) |
| Extension offers | Transactional | No | Yes |
| Newsletter | Marketing | Yes — explicit opt-in | Yes — one click |
| Promotional offers | Marketing | Yes | Yes |

## Subject Line Formulas
- Transactional: "[Action confirmed/needed] — [specifics]"
- Protocol: "[What they'll learn/do] this [week/session]"
- Check-in: Natural, personal — "How's it going, [name]?"
- Extension: "Your rental ends in [N] days — [option]"

## Mobile Optimization Rules
- Single column layout for critical content
- CTA buttons: min 44px height, full width on mobile
- Font size: 16px body minimum, 20px headlines minimum
- Max 3 lines of body text per paragraph
- Images: 100% width on mobile, with `alt` text always set
