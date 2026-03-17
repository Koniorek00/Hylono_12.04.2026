import { getManifest } from "@/lib/manifest";
import { checkHealth } from "@/lib/health";
import { StackExplorer } from "@/components/StackExplorer";

export const dynamic = "force-dynamic";

export default async function StackPage() {
  const manifest = getManifest();
  const allServices = [...manifest.infrastructure, ...manifest.services];
  const healthResults = await Promise.all(allServices.map((service) => checkHealth(service)));
  const servicesWithStatus = allServices.map((service) => {
    const health = healthResults.find((result) => result.serviceId === service.id);

    return {
      ...service,
      status: health?.status ?? "unknown",
      url: health?.url,
      httpStatus: health?.httpStatus,
      responseTimeMs: health?.responseTimeMs,
      healthError: health?.error,
    };
  });
  const essentialCount = allServices.filter((s) => s.verdict === "ESSENTIAL").length;
  const recommendedCount = allServices.filter((s) => s.verdict === "RECOMMENDED").length;
  const buildFromSrcCount = allServices.filter((s) => s.buildFromSource).length;
  const runningCount = servicesWithStatus.filter((s) => s.status === "running").length;
  const stoppedCount = servicesWithStatus.filter((s) => s.status === "stopped").length;
  const errorCount = servicesWithStatus.filter((s) => s.status === "error").length;
  const uncheckedCount = servicesWithStatus.filter(
    (s) => s.status === "unknown" || s.status === "not-deployed"
  ).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Stack Explorer</h1>
            <p className="mt-0.5 text-gray-500 text-sm">
              Hylono Stack v{manifest.meta.version} · {manifest.meta.totalServices} services
            </p>
          </div>
          {/* Stats strip */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-gray-300">{runningCount} running</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-gray-300">{stoppedCount} stopped</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="text-gray-300">{errorCount} errors</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span className="text-gray-300">{uncheckedCount} unchecked</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <span className="text-gray-300">{essentialCount} essential</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-gray-300">{recommendedCount} recommended</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
              <span className="text-gray-300">{buildFromSrcCount} build-from-src</span>
            </span>
            <span className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5">
              <span className="text-gray-500">⇄</span>
              <span className="text-gray-300">{manifest.integrations.length} flows</span>
            </span>
          </div>
        </div>

        {/* Two-pane explorer */}
        <StackExplorer services={servicesWithStatus} integrations={manifest.integrations} />

        {/* R&D footer — collapsed */}
        <details className="mt-4 group">
          <summary className="flex items-center gap-2 cursor-pointer select-none py-2.5 border-b border-gray-800 text-sm text-gray-500 hover:text-gray-300 transition-colors list-none">
            <span className="text-gray-700 group-open:rotate-90 transition-transform inline-block">▶</span>
            R&amp;D References
            <span className="text-gray-700 text-xs ml-1">({manifest.rnd.length})</span>
            <span className="ml-auto text-xs text-gray-700">hardware &amp; firmware open-source projects</span>
          </summary>
          <div className="flex flex-col gap-1.5 mt-3">
            {manifest.rnd.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 flex items-center gap-4 hover:border-gray-700 transition-colors"
              >
                <span className="font-semibold text-gray-200 text-sm w-36 flex-shrink-0">{item.name}</span>
                <span className="text-gray-500 text-xs flex-1">{item.description}</span>
                <a
                  href={item.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
                >
                  GitHub ↗
                </a>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
