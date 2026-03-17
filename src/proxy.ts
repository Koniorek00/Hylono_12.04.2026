/**
 * Legacy shim to preserve backward compatibility for historical imports.
 * Canonical proxy implementation lives in the repository root: /proxy.ts
 *
 * [DECISION: Keep compatibility shim instead of deleting immediately, because it
 * avoids accidental import breakage while fully eliminating policy drift by
 * re-exporting the canonical implementation — reverse by deleting this file once
 * references are fully removed.]
 *
 * HIGH-02 status: policy drift is functionally eliminated because this file does
 * not define independent security behavior; it forwards `config` and `proxy`
 * from the canonical root implementation.
 */
export { config, proxy } from '../proxy';
