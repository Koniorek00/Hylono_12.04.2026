# Snipe-IT Operator Baseline

This repo ships a local, idempotent Snipe-IT bootstrap that seeds a minimal but useful operator inventory baseline.

Seeder:
- `scripts/seed-snipeit-operator-baseline.ps1`

What it creates:
- One location: `Hylono Clinic - Warsaw`
- One manufacturer: `Hylono Medtech`
- One asset category: `HBOT Equipment`
- One model: `HBOT Starter System`
- One deployable asset: `HBOT Starter Unit` with tag `HBOT-001`

Why this baseline exists:
- It gives Snipe-IT a real asset-management record instead of only an operator login.
- It is safe to rerun because the script resolves or creates each record by name/tag before updating the row.

Output artifact:
- `output/snipeit-bootstrap/operator-baseline-state.json`

Rerun command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\seed-snipeit-operator-baseline.ps1
```
