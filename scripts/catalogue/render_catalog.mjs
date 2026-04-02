import path from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const root = String.raw`F:\ag projects\Hylono_MAIN - SEO BOOST`;
const outputDir = path.join(root, "output", "pdf", "hydrogen-catalogue");
const htmlPath = path.join(outputDir, "catalogue.html");
const pdfPath = path.join(outputDir, "Hylono_Hydrogen_Catalogue_2026.pdf");
const screenshotPath = path.join(outputDir, "catalogue-first-page.png");
const reportPath = path.join(outputDir, "render-report.json");

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 2048 },
  deviceScaleFactor: 1.5,
});

await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "screen" });
await page.screenshot({ path: screenshotPath, fullPage: false });

const report = await page.evaluate(() => {
  const pages = Array.from(document.querySelectorAll(".page"));
  const pageReports = pages.map((pageEl, index) => {
    const pageRect = pageEl.getBoundingClientRect();
    const offenders = [];

    for (const node of pageEl.querySelectorAll("*")) {
      const style = window.getComputedStyle(node);
      if (style.position === "fixed" || style.display === "none" || style.visibility === "hidden") {
        continue;
      }

      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        continue;
      }

      const outside =
        rect.right > pageRect.right + 0.5 ||
        rect.bottom > pageRect.bottom + 0.5 ||
        rect.left < pageRect.left - 0.5 ||
        rect.top < pageRect.top - 0.5;

      if (outside) {
        offenders.push({
          tag: node.tagName,
          className: node.className,
          text: (node.textContent || "").trim().slice(0, 140),
        });
      }
    }

    return {
      page: index + 1,
      offenderCount: offenders.length,
      offenders: offenders.slice(0, 20),
    };
  });

  return {
    pages: pageReports,
    totalOffenders: pageReports.reduce((sum, item) => sum + item.offenderCount, 0),
  };
});

if (report.totalOffenders > 0) {
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
  await browser.close();
  throw new Error(`Layout overflow detected. See ${reportPath}`);
}

await page.emulateMedia({ media: "print" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  preferCSSPageSize: true,
});

await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
await browser.close();

console.log(`PDF written to: ${pdfPath}`);
