import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export interface PageOwnershipItem {
  label: string;
  value: string;
  detail?: string;
}

export interface PageOwnershipAction {
  href: string;
  label: string;
}

interface PageOwnershipProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: PageOwnershipItem[];
  actions?: PageOwnershipAction[];
  note?: string;
  className?: string;
}

export function PageOwnership({
  eyebrow = 'Ownership and freshness',
  title = 'Reviewed for clarity and fit',
  description,
  items,
  actions = [],
  note,
  className = '',
}: PageOwnershipProps) {
  return (
    <aside
      className={`rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm ${className}`.trim()}
    >
      <div className="flex items-center gap-3 text-slate-900">
        <div className="rounded-2xl bg-white p-2 text-cyan-700 shadow-sm">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight">{title}</h2>
        </div>
      </div>

      {description ? (
        <p className="mt-4 text-sm leading-7 text-slate-700">{description}</p>
      ) : null}

      <dl className="mt-5 grid gap-4 text-sm">
        {items.map((item) => (
          <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-white bg-white p-4">
            <dt className="font-medium text-slate-500">{item.label}</dt>
            <dd className="mt-1 font-semibold text-slate-950">{item.value}</dd>
            {item.detail ? <p className="mt-2 leading-6 text-slate-600">{item.detail}</p> : null}
          </div>
        ))}
      </dl>

      {note ? <p className="mt-5 text-sm leading-6 text-slate-600">{note}</p> : null}

      {actions.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950 hover:decoration-slate-950"
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
