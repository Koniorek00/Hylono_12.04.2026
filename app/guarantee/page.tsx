import { permanentRedirect } from 'next/navigation';

// [DECISION: redirect because this legacy assurance alias duplicates the canonical returns policy route.]
export default function GuaranteePageRoute() {
  permanentRedirect('/returns');
}
