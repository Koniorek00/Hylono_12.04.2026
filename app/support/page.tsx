import { permanentRedirect } from 'next/navigation';

// [DECISION: redirect because /support is a duplicate trust alias and should resolve to the canonical help center.]
export default function SupportPageRoute() {
  permanentRedirect('/help');
}
