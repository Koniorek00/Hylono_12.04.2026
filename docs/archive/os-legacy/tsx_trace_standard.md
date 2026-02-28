# TSX TRACE STANDARD — ANTI-GRAVITY OS

Każde twierdzenie o technologii (copy) w plikach `.tsx` musi być poprzedzone komentarzem metadata.

## Wzorzec (Pattern)

```tsx
{/* trace_id: [ID-PAKIETU] | claim: [Treść twierdzenia] */}
<p>Treść twierdzenia...</p>
```

## Przykłady

```tsx
{/* trace_id: HBOT-001 | claim: increases oxygen concentration in plasma */}
<p>Zwiększona koncentracja tlenu w osoczu wspiera regenerację tkanek.</p>

{/* trace_id: RLT-005 | claim: mitochondrial stimulation via 660nm light */}
<span>Stymulacja mitochondrialna światłem 660nm.</span>
```

## Automatyzacja

Skill `trace-lint` skanuje pliki TSX w poszukiwaniu TW_ (twierdzeń) i weryfikuje obecność komentarza metadata bezpośrednio nad elementem zawierającym tekst.
