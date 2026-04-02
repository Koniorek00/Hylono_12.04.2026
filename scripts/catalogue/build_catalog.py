from __future__ import annotations

import html
import json
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path
from typing import Iterable

import requests
from PIL import Image


ROOT = Path(r"F:\ag projects\Hylono_MAIN - SEO BOOST")
OUTPUT_DIR = ROOT / "output" / "pdf" / "hydrogen-catalogue"
ASSETS_DIR = OUTPUT_DIR / "assets"


@dataclass(frozen=True)
class Model:
    id: str
    model_code: str
    display_name: str
    total_flow: str
    gas_type: str
    series: str
    use_case: str
    positioning: str
    power: str
    tank: str
    form_factor: str
    source_url: str
    image_url: str
    image_alt: str
    note: str = ""


MODELS: list[Model] = [
    Model("150", "GY-H150", "150 ml/min", "150 ml/min", "czysty H2", "Seria kompaktowa", "pierwszy kontakt z kategorią, prosta rutyna domowa", "najmniejszy model do spokojnego startu i codziennego komfortu", "70 W", "300 ml", "mini desktop", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-150mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/08/28/20250828163020zmy10j.webp", "Suyzeko 150 ml/min hydrogen inhalation machine"),
    Model("200", "GY-H200", "200 ml/min", "200 ml/min", "czysty H2", "Seria kompaktowa", "domowe sesje o małym śladzie urządzenia", "kompaktowy model dla użytkowników szukających więcej niż poziom startowy", "120 W", "1200 ml", "desktop", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-200mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/08/29/20250829175623Rgy7F6.webp", "Suyzeko 200 ml/min hydrogen inhalation machine"),
    Model("225", "Compact 225", "225 ml/min", "225 ml/min", "wariant kompaktowy H2+O2", "Seria kompaktowa", "wejście w compact mix", "kompaktowa opcja z rodziny mini", "do potwierdzenia", "do potwierdzenia", "compact mix", "https://www.alibaba.com/showroom/hydrogen-inhalation-therapy.html", "https://www.suyzekotech.com/uploadfile/2025/08/29/20250829175623Rgy7F6.webp", "Compact portable hydrogen inhaler family", "Wariant 225 ml/min został ujęty jako część kompaktowej rodziny producenta komunikowanej w materiałach sprzedażowych."),
    Model("300", "GY-H300", "300 ml/min", "300 ml/min", "H2+O2 2:1", "Seria kompaktowa", "mocniejszy compact mix", "wariant przejściowy między mini a home", "wg konfiguracji compact mix", "wg konfiguracji compact mix", "compact mix", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-300mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/03/20250903160749wJ4Qt9.webp", "Suyzeko 300 ml/min hydrogen inhalation machine", "Na stronie producenta model 300 ml/min występuje w rodzinie compact mix; w katalogu pokazujemy go jako wariant przejściowy bez przeciążania szczegółami technicznymi."),
    Model("450", "GY-450-S", "450 ml/min", "450 ml/min", "H2+O2 2:1", "Seria kompaktowa", "najmocniejszy compact do domu i showroomu", "kompakt premium o wyższym przepływie", "150 W", "1000 ml", "compact mix", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-450mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/03/20250903151544Cb84RH.webp", "Suyzeko 450 ml/min hydrogen inhalation system"),
    Model("600", "GY-HX600", "600 ml/min", "600 ml/min", "czysty H2", "Seria domowa", "regularna rutyna domowa z wyższą wydajnością", "pierwszy model do bardziej konsekwentnej pracy tygodniowej", "300 W", "2500 ml", "home system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-600mlmin-hydrogen-therapy-device-hydrogen-inhalation-machine-generator.html", "https://www.suyzekotech.com/uploadfile/2026/01/20/20260120163128e03ILY.webp", "Suyzeko 600 ml/min PEM hydrogen inhalation machine"),
    Model("900", "GY-900-S", "900 ml/min", "900 ml/min", "H2+O2 2:1", "Seria domowa", "dom, showroom i intensywniejsze sesje tygodniowe", "wydajniejszy model dla osób, które wiedzą już czego oczekują od kategorii", "<350 W", "2500 ml", "home system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-900mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/02/20250902173238oh5uEZ.webp", "Suyzeko 900 ml/min hydrogen inhalation machine"),
    Model("1500", "GY-1500-S", "1500 ml/min", "1500 ml/min", "H2+O2 2:1", "Seria zaawansowana", "bardziej rozbudowane rutyny, wyższa intensywność użytkowania", "wejście w segment urządzeń o wyraźnie profesjonalniejszym charakterze", "400 W", "2500 ml", "advanced system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-1500mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/03/202509031531508Et9TB.webp", "Suyzeko 1500 ml/min hydrogen inhalation technology"),
    Model("1800", "GY-HX1800", "1800 ml/min", "1800 ml/min", "H2+O2 2:1", "Seria zaawansowana", "bardziej wymagające środowiska i dłuższe sesje", "stabilna, mocna jednostka dla klientów szukających jeszcze większego przepływu", "500 W", "2500 ml", "advanced system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-1800mlmin-hydrogen-therapy-device-hydrogen-inhalation-machine.html", "https://www.suyzekotech.com/uploadfile/2025/09/20/202509201016520eroyt.jpg", "Suyzeko 1800 ml/min hydrogen inhalation machine"),
    Model("3000", "GY-HX3000", "3000 ml/min", "3000 ml/min", "H2+O2 2:1", "Seria profesjonalna", "gabinet, showroom, demonstracje i intensywna eksploatacja", "flagowy próg wejścia do segmentu pro", "900-1000 W", "5000-6000 ml", "professional system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-3000mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/16/20250916173309MjFAwi.jpg", "Suyzeko 3000 ml/min hydrogen inhalation system"),
    Model("3600", "GY-HX3600", "3600 ml/min", "3600 ml/min", "H2+O2 2:1", "Seria profesjonalna", "gabinet, punkt demonstracyjny, zaawansowane zastosowania stacjonarne", "większa wydajność dla pracy na wyższym przepływie", "1000 W", "5000 ml", "professional system", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-3600mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device.html", "https://www.suyzekotech.com/uploadfile/2025/09/20/202509201042263fg280.jpg", "Suyzeko 3600 ml/min hydrogen inhalation machine"),
    Model("6000", "GY-HX6000", "6000 ml/min", "6000 ml/min", "H2+O2 2:1", "Seria profesjonalna", "najmocniejsza prezentacja portfolio dla najbardziej wymagających wdrożeń", "najwyższy przepływ w całej linii i najmocniejsza obecność katalogowa", "1000-1600 W", "5000 ml", "flagship pro", "https://www.suyzekotech.com/h2-therapy-hyperbaric-oxygen-chamber/suyzeko-6000mlmin-hydrogen-inhalation-machine-hydrogen-therapy-device-ybfxrb.html", "https://www.suyzekotech.com/uploadfile/2025/08/21/20250821123105cvbyXY.webp", "Suyzeko 6000 ml/min hydrogen inhalation machine"),
]


def ensure_dirs() -> None:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)


def download_image(url: str, target: Path) -> None:
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content)).convert("RGBA")
    image.save(target, format="PNG", optimize=True)


def build_asset_manifest(models: Iterable[Model]) -> dict[str, str]:
    assets: dict[str, str] = {}
    for model in models:
        filename = f"{model.id}.png"
        target = ASSETS_DIR / filename
        if not target.exists():
            download_image(model.image_url, target)
        assets[model.id] = f"assets/{filename}"
    return assets


def h(text: str) -> str:
    return html.escape(text, quote=True)


def render_chip(label: str) -> str:
    return f'<span class="chip">{h(label)}</span>'


def render_model_card(model: Model, asset_path: str, compact_mode: bool = False, show_note: bool = True) -> str:
    note = f'<p class="card-note">{h(model.note)}</p>' if model.note and show_note else ""
    details = (
        f'<div class="mini-detail"><span>Najlepszy do</span><strong>{h(model.use_case)}</strong></div>'
        if compact_mode
        else f"""
          <dl class="spec-pairs">
            <div><dt>Moc</dt><dd>{h(model.power)}</dd></div>
            <div><dt>Zbiornik</dt><dd>{h(model.tank)}</dd></div>
            <div><dt>Najlepszy do</dt><dd>{h(model.use_case)}</dd></div>
          </dl>
        """
    )
    return f"""
      <article class="model-card">
        <div class="product-visual">
          <img src="{h(asset_path)}" alt="{h(model.image_alt)}">
        </div>
        <div class="model-copy">
          <p class="eyebrow">{h(model.model_code)}</p>
          <h3>{h(model.display_name)}</h3>
          <div class="card-chips">
            {render_chip(model.total_flow)}
            {render_chip(model.gas_type)}
            {render_chip(model.form_factor)}
          </div>
          <p class="positioning">{h(model.positioning)}</p>
          {details}
          {note}
        </div>
      </article>
    """


def render_series_page(title: str, lead: str, models: list[Model], assets: dict[str, str], page_number: int) -> str:
    cards = "\n".join(render_model_card(model, assets[model.id]) for model in models)
    return f"""
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header">
            <div>
              <p class="section-kicker">Linia urządzeń</p>
              <h2>{h(title)}</h2>
            </div>
            <p class="page-number">{page_number:02d}</p>
          </header>
          <p class="lead lead-wide">{h(lead)}</p>
          <div class="cards-grid cards-grid-{len(models)}">
            {cards}
          </div>
          <footer class="page-footer">
            <span>Zdjęcia i parametry: materiały producenta Suyzeko / Shenzhen Guangyang Zhongkang Technology.</span>
            <span>Hylono prezentuje urządzenia w kontekście wellness i doboru konfiguracji.</span>
          </footer>
        </div>
      </section>
    """


def render_comparison_row(model: Model) -> str:
    return f"""
      <tr>
        <td>{h(model.model_code)}</td>
        <td>{h(model.display_name)}</td>
        <td>{h(model.total_flow)}</td>
        <td>{h(model.gas_type)}</td>
        <td>{h(model.form_factor)}</td>
        <td>{h(model.use_case)}</td>
      </tr>
    """


def render_html(assets: dict[str, str]) -> str:
    compact = [model for model in MODELS if model.series == "Seria kompaktowa"]
    home = [model for model in MODELS if model.series == "Seria domowa"]
    advanced = [model for model in MODELS if model.series == "Seria zaawansowana"]
    pro = [model for model in MODELS if model.series == "Seria profesjonalna"]
    comparison_rows = "\n".join(render_comparison_row(model) for model in MODELS)
    compact_cards = "\n".join(render_model_card(model, assets[model.id], compact_mode=True, show_note=False) for model in compact)

    return f"""<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hylono - katalog inhalacji wodorowej 2026</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root {{
        --ink: #10243a;
        --ink-soft: #35566d;
        --sky: #8bc9df;
        --mist: #ecf7fb;
        --fog: #f7fbfd;
        --line: rgba(16, 36, 58, 0.12);
        --white: #ffffff;
        --shadow: 0 24px 60px rgba(15, 34, 56, 0.14);
      }}
      * {{ box-sizing: border-box; }}
      html, body {{ margin: 0; padding: 0; background: #dce9ef; color: var(--ink); font-family: "Manrope", sans-serif; }}
      body {{ padding: 24px 0 48px; }}
      .catalogue {{ display: flex; flex-direction: column; gap: 18px; align-items: center; }}
      .page {{ position: relative; width: 210mm; height: 297mm; background: var(--white); overflow: hidden; box-shadow: var(--shadow); page-break-after: always; }}
      .page::before {{ content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 10% 15%, rgba(139, 201, 223, 0.22), transparent 25%), radial-gradient(circle at 85% 12%, rgba(53, 86, 109, 0.18), transparent 28%), radial-gradient(circle at 88% 86%, rgba(139, 201, 223, 0.14), transparent 26%); pointer-events: none; }}
      .page-shell {{ position: relative; z-index: 1; height: 100%; padding: 16mm 17mm 15mm; display: flex; flex-direction: column; }}
      .cover {{ background: linear-gradient(145deg, rgba(16, 36, 58, 0.96), rgba(16, 36, 58, 0.82) 46%, rgba(28, 74, 97, 0.78)), linear-gradient(180deg, rgba(12, 22, 34, 0.72), rgba(12, 22, 34, 0.2)); color: var(--white); }}
      .cover::before {{ background: radial-gradient(circle at 17% 20%, rgba(139, 201, 223, 0.22), transparent 22%), radial-gradient(circle at 82% 10%, rgba(255, 255, 255, 0.14), transparent 18%), radial-gradient(circle at 78% 68%, rgba(139, 201, 223, 0.18), transparent 26%); }}
      .cover-grid {{ display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 10mm; flex: 1; align-items: center; }}
      .cover-copy {{ display: flex; flex-direction: column; gap: 6mm; }}
      .cover-mark, .dark-strip {{ display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 999px; width: fit-content; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; }}
      .cover-mark {{ background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); }}
      .dark-strip {{ background: rgba(16, 36, 58, 0.06); border: 1px solid rgba(16, 36, 58, 0.08); color: var(--ink-soft); }}
      .cover h1, .page h2 {{ margin: 0; font-family: "Cormorant Garamond", serif; font-weight: 600; line-height: 0.94; }}
      .cover h1 {{ font-size: 53px; max-width: 360px; }}
      .page h2 {{ font-size: 41px; max-width: 560px; }}
      .cover-intro {{ font-size: 15.5px; line-height: 1.65; color: rgba(255, 255, 255, 0.82); max-width: 400px; }}
      .cover-bullets {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; margin-top: 2mm; }}
      .cover-bullets div {{ padding: 14px 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.14); font-size: 13px; line-height: 1.45; }}
      .cover-visual {{ position: relative; height: 205mm; display: flex; align-items: center; justify-content: center; }}
      .cover-orb {{ position: absolute; inset: 18mm 8mm 22mm 8mm; border-radius: 32px; background: linear-gradient(155deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.06)); border: 1px solid rgba(255, 255, 255, 0.12); }}
      .cover-visual img, .hero-contact img {{ position: relative; z-index: 1; object-fit: contain; filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.28)); }}
      .cover-visual img {{ width: 100%; max-width: 330px; max-height: 188mm; }}
      .cover-footer, .page-footer {{ display: flex; justify-content: space-between; gap: 14px; font-size: 10px; line-height: 1.5; }}
      .cover-footer {{ align-items: center; color: rgba(255, 255, 255, 0.72); }}
      .page-footer {{ margin-top: auto; padding-top: 9mm; color: rgba(16, 36, 58, 0.6); }}
      .light-page {{ background: linear-gradient(180deg, #ffffff, #fbfdff 56%, #f7fbfd); }}
      .section-kicker, .eyebrow {{ margin: 0 0 5px; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-soft); font-weight: 700; }}
      .page-header {{ display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }}
      .page-number {{ margin: 0; font-size: 12px; color: rgba(16, 36, 58, 0.55); letter-spacing: 0.2em; text-transform: uppercase; }}
      .lead {{ font-size: 16px; line-height: 1.7; color: var(--ink-soft); max-width: 540px; }}
      .lead-wide {{ max-width: 620px; }}
      .intro-grid, .contact-grid {{ display: grid; gap: 8mm; }}
      .intro-grid {{ grid-template-columns: 0.96fr 1.04fr; margin-top: 7mm; }}
      .feature-grid, .choice-grid, .safety-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 7mm; }}
      .intro-panel, .feature-panel, .choice-panel, .safety-panel, .matrix-panel, .contact-card {{ border-radius: 24px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.82); padding: 18px 20px; }}
      .intro-panel h3, .feature-panel h3, .choice-panel h3, .safety-panel h3, .model-copy h3 {{ margin: 0 0 8px; font-size: 22px; line-height: 1.18; }}
      .intro-panel p, .feature-panel p, .choice-panel p, .safety-panel p, .positioning, .card-note, .model-copy dd, .copy-list li, .contact-card p {{ margin: 0; font-size: 13.4px; line-height: 1.6; color: var(--ink-soft); }}
      .copy-list {{ margin: 12px 0 0; padding-left: 16px; display: flex; flex-direction: column; gap: 8px; }}
      .feature-card {{ padding: 16px 18px; border-radius: 22px; border: 1px solid var(--line); background: linear-gradient(180deg, rgba(236, 247, 251, 0.72), rgba(255, 255, 255, 0.9)); }}
      .feature-card strong, .choice-panel strong, .safety-panel strong {{ display: block; margin-bottom: 5px; font-size: 14px; }}
      .cards-grid {{ display: grid; gap: 12px; margin-top: 6mm; }}
      .cards-grid-5 {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
      .cards-grid-5 .model-card:last-child {{ grid-column: 1 / -1; }}
      .cards-grid-5 .model-card {{ padding: 12px; gap: 12px; }}
      .cards-grid-5 .product-visual {{ min-height: 116px; }}
      .cards-grid-5 .product-visual img {{ max-height: 108px; }}
      .cards-grid-5 .positioning {{ font-size: 12.4px; line-height: 1.45; }}
      .cards-grid-5 .mini-detail strong {{ font-size: 11.8px; line-height: 1.4; }}
      .cards-grid-2 {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
      .cards-grid-3 {{ grid-template-columns: repeat(3, minmax(0, 1fr)); }}
      .model-card {{ display: grid; grid-template-columns: 118px 1fr; gap: 14px; padding: 14px; border-radius: 24px; border: 1px solid var(--line); background: rgba(255, 255, 255, 0.88); }}
      .cards-grid-3 .model-card {{ grid-template-columns: 1fr; }}
      .product-visual {{ display: flex; align-items: center; justify-content: center; min-height: 130px; border-radius: 18px; background: linear-gradient(180deg, rgba(236, 247, 251, 0.82), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(16, 36, 58, 0.06); }}
      .product-visual img {{ max-width: 100%; max-height: 120px; object-fit: contain; }}
      .card-chips {{ display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 9px; }}
      .chip {{ display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px; background: rgba(139, 201, 223, 0.16); color: var(--ink); font-size: 11px; font-weight: 700; }}
      .spec-pairs {{ margin: 11px 0 0; display: grid; gap: 7px; }}
      .spec-pairs div {{ display: grid; grid-template-columns: 88px 1fr; gap: 8px; }}
      .spec-pairs dt {{ font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(16, 36, 58, 0.58); font-weight: 700; }}
      .mini-detail {{ margin-top: 11px; padding: 10px 12px; border-radius: 14px; background: rgba(236, 247, 251, 0.72); }}
      .mini-detail span {{ display: block; margin-bottom: 4px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(16, 36, 58, 0.56); font-weight: 700; }}
      .mini-detail strong {{ font-size: 12.5px; line-height: 1.5; }}
      .matrix-panel {{ margin-top: 7mm; padding: 14px 16px; }}
      table {{ width: 100%; border-collapse: collapse; }}
      th, td {{ text-align: left; vertical-align: top; padding: 8px 7px; border-bottom: 1px solid var(--line); font-size: 11.5px; line-height: 1.45; }}
      th {{ font-size: 10.5px; color: rgba(16, 36, 58, 0.6); letter-spacing: 0.14em; text-transform: uppercase; }}
      .contact-grid {{ grid-template-columns: 1.05fr 0.95fr; gap: 12mm; flex: 1; align-items: center; }}
      .contact-stack {{ display: flex; flex-direction: column; gap: 5mm; }}
      .contact-links {{ display: grid; gap: 8px; margin-top: 8px; }}
      .contact-link {{ display: inline-flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-radius: 16px; background: rgba(236, 247, 251, 0.8); border: 1px solid rgba(16, 36, 58, 0.08); font-size: 13px; }}
      .hero-contact {{ display: flex; align-items: center; justify-content: center; height: 210mm; border-radius: 32px; background: radial-gradient(circle at 18% 18%, rgba(139, 201, 223, 0.32), transparent 24%), linear-gradient(160deg, rgba(16, 36, 58, 0.95), rgba(16, 36, 58, 0.84) 52%, rgba(53, 86, 109, 0.76)); }}
      .hero-contact img {{ max-width: 88%; max-height: 180mm; }}
      .print-note {{ margin-top: 4px; font-size: 10.5px; line-height: 1.55; color: rgba(16, 36, 58, 0.56); }}
      @page {{ size: A4; margin: 0; }}
      @media print {{ body {{ padding: 0; background: transparent; }} .catalogue {{ gap: 0; }} .page {{ box-shadow: none; }} }}
    </style>
  </head>
  <body>
    <main class="catalogue">
      <section class="page cover">
        <div class="page-shell">
          <div class="cover-grid">
            <div class="cover-copy">
              <div class="cover-mark">Hylono distribution line · 2026</div>
              <h1>Katalog inhalacji wodorowej</h1>
              <p class="cover-intro">Linia urządzeń Suyzeko przygotowana do rozmów offline z klientem: od kompaktowych modeli startowych po wydajne systemy dla showroomów, gabinetów i zastosowań profesjonalnych.</p>
              <div class="cover-bullets">
                <div>premium materiał sprzedażowy bez cen i bez chaosu spec-sheetów</div>
                <div>pełna linia wariantów 150-6000 ml/min w jednym układzie katalogowym</div>
                <div>język edukacyjny dla osób, które dopiero poznają kategorię H2</div>
                <div>konserwatywny framing wellness zgodny z podejściem Hylono</div>
              </div>
            </div>
            <div class="cover-visual">
              <div class="cover-orb"></div>
              <img src="{h(assets['6000'])}" alt="Flagowy generator inhalacji wodorowej">
            </div>
          </div>
          <div class="cover-footer">
            <span>Hylono · Europejski partner doboru urządzeń wellness</span>
            <span>PDF catalogue · A4 · marzec 2026</span>
          </div>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Wprowadzenie</p><h2>Czym jest inhalacja wodorem?</h2></div><p class="page-number">02</p></header>
          <p class="lead">Dla większości klientów to nowa kategoria. Dlatego katalog zaczynamy nie od parametrów, ale od prostego wyjaśnienia: urządzenie wytwarza cząsteczkowy wodór, który podawany jest przez kaniulę lub akcesoria towarzyszące w ramach rutyn wellbeing.</p>
          <div class="intro-grid">
            <div class="intro-panel">
              <h3>Jak Hylono tłumaczy kategorię</h3>
              <p>Molekularny wodór jest małą cząsteczką, dlatego często opisuje się go w kontekście stresu oksydacyjnego, regeneracji po wysiłku i codziennego komfortu funkcjonowania. Z perspektywy Hylono to kategoria wellness, a nie obietnica leczenia.</p>
              <ul class="copy-list">
                <li>najczęstsza forma użytkowania: sesja inhalacyjna przez kaniulę</li>
                <li>spotykane są także konfiguracje z wodą wodorową lub akcesoriami miejscowymi</li>
                <li>badania są rozwijające się, dlatego komunikacja powinna być spokojna i uczciwa</li>
              </ul>
            </div>
            <div class="intro-panel">
              <h3>Co warto powiedzieć klientowi przy pierwszym spotkaniu</h3>
              <ul class="copy-list">
                <li>to urządzenia do planowania rutyn wellbeing w domu, showroomie i gabinecie</li>
                <li>różnice między modelami wynikają głównie z przepływu, typu gazu i skali użycia</li>
                <li>mniejszy model nie oznacza gorszego modelu - oznacza inny kontekst wdrożenia</li>
                <li>najbezpieczniej rozmawiać o jakości wykonania, ergonomii i doborze konfiguracji</li>
              </ul>
              <p class="print-note">Notka badawcza: Hylono opiera komunikację na materiałach producenta oraz konserwatywnym przeglądzie piśmiennictwa, m.in. wybranych publikacjach z Clinical Nutrition ESPEN i Medical Gas Research.</p>
            </div>
          </div>
          <footer class="page-footer"><span>Materiał edukacyjny. Urządzenia prezentowane są przez Hylono jako sprzęt wellness do ogólnego dobrostanu.</span><span>Przed użyciem należy zapoznać się z instrukcją i skonsultować się z wykwalifikowanym specjalistą.</span></footer>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Dlaczego ta linia</p><h2>Porządek, jakość wykonania i czytelna architektura oferty</h2></div><p class="page-number">03</p></header>
          <p class="lead lead-wide">Materiały producenta są techniczne i niespójne, ale same urządzenia mają mocne strony: elektrolizę PEM/SPE, deklarowaną wysoką czystość gazu, rozbudowane systemy alarmowe i wyraźne przejście od modeli kompaktowych do profesjonalnych.</p>
          <div class="feature-grid">
            <div class="feature-card"><strong>PEM / SPE electrolysis</strong><p>Linia opiera się na technologii protonowej zamiast prostych, nieselektywnych rozwiązań low-end.</p></div>
            <div class="feature-card"><strong>Do 99.996% deklarowanej czystości</strong><p>To jeden z głównych argumentów jakościowych, który warto pokazywać klientowi obok ergonomii.</p></div>
            <div class="feature-card"><strong>Systemy zabezpieczeń</strong><p>Kontrola temperatury, poziomu wody, jakości wody, przegrzania i ciśnienia zwiększa poczucie bezpieczeństwa.</p></div>
            <div class="feature-card"><strong>Wsparcie Hylono</strong><p>Dobór modelu, dokumentacja, onboarding i spokojna komunikacja sprzedażowa zamiast spekulacji medycznych.</p></div>
          </div>
          <div class="intro-grid">
            <div class="feature-panel">
              <h3>Jak czytać tę ofertę</h3>
              <ul class="copy-list">
                <li><strong>Seria kompaktowa</strong> - małe urządzenia dla startu i domowych sesji</li>
                <li><strong>Seria domowa</strong> - większa wydajność przy nadal praktycznym formacie</li>
                <li><strong>Seria zaawansowana</strong> - wyższy przepływ dla bardziej intensywnego użytkowania</li>
                <li><strong>Seria profesjonalna</strong> - flagowe jednostki do showroomu, gabinetu i ekspozycji</li>
              </ul>
            </div>
            <div class="feature-panel">
              <h3>Na czym budować zaufanie</h3>
              <ul class="copy-list">
                <li>na jakości wykonania, czytelności obsługi i dobraniu formatu do realnego użycia</li>
                <li>na tym, że klient rozumie różnicę między czystym H2 a mieszanką H2+O2 2:1</li>
                <li>na prostych zasadach użytkowania: woda destylowana, wentylacja, brak otwartego ognia</li>
                <li>na uczciwym zdaniu: to urządzenia wellbeing, nie substytut opieki medycznej</li>
              </ul>
            </div>
          </div>
          <footer class="page-footer"><span>Źródła techniczne: katalog producenta Suyzeko, price list, instrukcja GY-HX3000 oraz aktualne strony produktowe.</span><span>Język katalogu został uproszczony i uporządkowany na potrzeby rozmowy z klientem IRL.</span></footer>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Linia kompaktowa</p><h2>150, 200, 225, 300 i 450 ml/min</h2></div><p class="page-number">04</p></header>
          <p class="lead lead-wide">Najprostszy sposób, by pokazać klientowi kategorię bez dużego urządzenia: mały format, szybkie wdrożenie i czytelne wejście w świat inhalacji wodorowej.</p>
          <div class="cards-grid cards-grid-5">{compact_cards}</div>
          <footer class="page-footer"><span>225 ml/min pokazujemy jako wariant kompaktowej rodziny producenta.</span><span>W tej serii sprzedają prostota, format i łatwy start.</span></footer>
        </div>
      </section>
      {render_series_page("Seria domowa · 600 i 900 ml/min", "Modele domowe są naturalnym krokiem dalej: mają wyraźnie większy przepływ, lepiej sprawdzają się przy regularnych rutynach tygodniowych i wyglądają bardziej jak stacjonarne urządzenia niż sprzęt startowy.", home, assets, 5)}
      {render_series_page("Seria zaawansowana · 1500 i 1800 ml/min", "Tutaj klient zaczyna widzieć urządzenie jako poważny system pracy, a nie tylko kompaktowy gadżet. To dobry moment na rozmowę o intensywności użytkowania, długości sesji i docelowym środowisku wdrożenia.", advanced, assets, 6)}
      {render_series_page("Seria profesjonalna · 3000, 3600 i 6000 ml/min", "Segment pro powinien wyglądać w katalogu jak segment flagowy: duże jednostki, mocna obecność wizualna i klarowny przekaz, że są to urządzenia do najbardziej wymagających wdrożeń showroomowych, gabinetowych lub demonstracyjnych.", pro, assets, 7)}
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Porównanie</p><h2>Pełna macierz modeli w jednym widoku</h2></div><p class="page-number">08</p></header>
          <p class="lead lead-wide">Ten układ jest stworzony do rozmowy sprzedażowej przy stole. Zamiast przeładowania tabelą mocy i amperażu, skupia klienta na tym, co naprawdę pomaga wybrać odpowiedni model: przepływ, typ gazu, format urządzenia i kontekst użycia.</p>
          <div class="matrix-panel">
            <table>
              <thead><tr><th>Model</th><th>Wariant</th><th>Przepływ</th><th>Typ gazu</th><th>Format</th><th>Najlepszy do</th></tr></thead>
              <tbody>{comparison_rows}</tbody>
            </table>
          </div>
          <footer class="page-footer"><span>Jeżeli klient zaczyna od pytania „który model mam wybrać?”, tę stronę warto otwierać jako pierwszą po krótkim wprowadzeniu.</span><span>Parametry szczegółowe i konfiguracje końcowe należy potwierdzać przy konkretnej ofercie handlowej.</span></footer>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Dobór modelu</p><h2>Jak prowadzić klienta przez decyzję</h2></div><p class="page-number">09</p></header>
          <p class="lead lead-wide">Zamiast zaczynać od najdroższego urządzenia, lepiej prowadzić rozmowę przez kontekst użycia. Klient szybciej rozumie ofertę, gdy porównuje format pracy i oczekiwaną częstotliwość sesji, a dopiero potem wchodzi w przepływ.</p>
          <div class="choice-grid">
            <div class="choice-panel"><h3>Start i codzienny komfort</h3><strong>Seria kompaktowa</strong><p>Najlepsza dla osób prywatnych, które chcą wejść w kategorię bez dużego urządzenia i bez rozbudowanej logistyki.</p></div>
            <div class="choice-panel"><h3>Regularna rutyna domowa</h3><strong>Seria domowa</strong><p>Dla klientów, którzy wiedzą, że będą korzystać częściej i oczekują większej stabilności w tygodniowym planie.</p></div>
            <div class="choice-panel"><h3>Wyższa intensywność</h3><strong>Seria zaawansowana</strong><p>Dobry wybór wtedy, gdy klient chce urządzenia „na dłużej” i nie chce wracać za chwilę po mocniejszy model.</p></div>
            <div class="choice-panel"><h3>Showroom lub gabinet</h3><strong>Seria profesjonalna</strong><p>Segment dla ekspozycji, demonstracji i pracy na najmocniejszych przepływach - z największym efektem „wow” na spotkaniu.</p></div>
          </div>
          <footer class="page-footer"><span>Najczytelniejsza ścieżka rozmowy: kontekst użycia → typ gazu → przepływ → ergonomia urządzenia.</span><span>Taki układ skraca czas decyzji i eliminuje chaos charakterystyczny dla nieuporządkowanych katalogów fabrycznych.</span></footer>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <header class="page-header"><div><p class="section-kicker">Bezpieczeństwo i obsługa</p><h2>Najważniejsze zasady, które warto komunikować od razu</h2></div><p class="page-number">10</p></header>
          <p class="lead lead-wide">To jedna z tych stron, które podnoszą wiarygodność całego materiału. Klient widzi, że nie sprzedajemy „magii”, tylko urządzenia, które mają swoje jasne zasady użytkowania.</p>
          <div class="safety-grid">
            <div class="safety-panel"><h3>Podstawy użytkowania</h3><ul class="copy-list"><li>używać wyłącznie wody destylowanej lub oczyszczonej zgodnie z zaleceniami producenta</li><li>obsługiwać urządzenie w wentylowanym miejscu i z dala od otwartego ognia</li><li>przed startem sesji sprawdzić drożność przewodów i poprawność podłączenia</li><li>przestrzegać limitów czasu pracy i zaleceń z instrukcji danego modelu</li></ul></div>
            <div class="safety-panel"><h3>Jak Hylono ustawia przekaz</h3><ul class="copy-list"><li>urządzenia pokazujemy jako sprzęt wellness do ogólnego dobrostanu</li><li>nie składamy obietnic leczenia i nie komunikujemy ich jako substytutu opieki medycznej</li><li>zachęcamy do konsultacji z wykwalifikowanym specjalistą przed rozpoczęciem rutyny</li><li>ostateczna konfiguracja handlowa i dokumentacja są potwierdzane indywidualnie</li></ul></div>
            <div class="safety-panel"><h3>Argumenty jakościowe</h3><ul class="copy-list"><li>ekran dotykowy i czytelna obsługa w wielu modelach</li><li>alarmy jakości wody, temperatury i ciśnienia</li><li>logiczną progresję od modeli compact do pro</li><li>łatwiejsze budowanie oferty dystrybucyjnej niż na bazie niespójnych katalogów OEM</li></ul></div>
            <div class="safety-panel"><h3>Dla rozmowy z klientem</h3><p>Najmocniejsze katalogi nie wyglądają jak instrukcja serwisowa. Dlatego ten materiał równoważy edukację, estetykę i selekcję informacji - pokazuje wystarczająco dużo, by klient zaufał marce, ale nie gubił się w detalach.</p></div>
          </div>
          <footer class="page-footer"><span>Informacje eksploatacyjne opracowano na podstawie instrukcji GY-HX3000 i opisów producenta.</span><span>Wszystkie decyzje zakupowe powinny być domykane z aktualną specyfikacją i dokumentacją danego modelu.</span></footer>
        </div>
      </section>
      <section class="page light-page">
        <div class="page-shell">
          <div class="contact-grid">
            <div class="contact-stack">
              <div class="dark-strip">Hylono · kontakt i wsparcie</div>
              <h2>Materiał do rozmów offline, nie do chaosu w stylu OEM</h2>
              <div class="contact-card">
                <p>Hylono porządkuje linię Suyzeko tak, aby klient widział nie tylko same maszyny, ale także logikę oferty: gdzie zaczyna się poziom wejścia, gdzie kończy się dom, a gdzie zaczyna segment showroomowy i gabinetowy.</p>
                <div class="contact-links">
                  <div class="contact-link"><span>Kontakt handlowy</span><strong>contact@hylono.com</strong></div>
                  <div class="contact-link"><span>Wsparcie</span><strong>support@hylono.com</strong></div>
                  <div class="contact-link"><span>Obszar działania</span><strong>UE / spotkania offline / dobór konfiguracji</strong></div>
                  <div class="contact-link"><span>Strona marki</span><strong>hylono.com</strong></div>
                </div>
              </div>
              <p class="print-note">Disclaimer: urządzenia wellness do ogólnego dobrostanu. Materiał ma charakter edukacyjny i sprzedażowy. Nie zastępuje indywidualnej porady medycznej, instrukcji użytkownika ani dokumentacji zgodności.</p>
            </div>
            <div class="hero-contact"><img src="{h(assets['3000'])}" alt="Generator inhalacji wodorowej Hylono"></div>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>
"""


def main() -> None:
    ensure_dirs()
    assets = build_asset_manifest(MODELS)
    html_text = render_html(assets)
    html_path = OUTPUT_DIR / "catalogue.html"
    html_path.write_text(html_text, encoding="utf-8")

    sources = {
        "brand_context": {
            "name": "Hylono",
            "contact": "contact@hylono.com",
            "support": "support@hylono.com",
            "positioning": "European wellness-technology platform focused on guided device access and conservative evidence-informed education.",
        },
        "manufacturer_files": [
            str(ROOT / "New Catalogue" / "Suyzeko hydrogen inhaler.pdf"),
            str(ROOT / "New Catalogue" / "Suyzeko Hydrogen products price list.pdf"),
            str(ROOT / "New Catalogue" / "GY-HX3000-01 -user manual-English.pdf"),
            str(ROOT / "New Catalogue" / "Omega3_Oferta_H2_podzielony_A4.pdf"),
        ],
        "research_references": [
            {"title": "Effects of molecular hydrogen supplementation on fatigue and aerobic capacity in healthy adults: A systematic review and meta-analysis", "source": "Clinical Nutrition ESPEN", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9934906/"},
            {"title": "Modified hydrogen-oxygen breathing and respiratory function, exercise capacity, sleep disorders, and mood disorders in patients with chronic complications of cancer treatment", "source": "Medical Gas Research", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12391262/"},
        ],
        "models": [model.__dict__ | {"local_asset": assets[model.id]} for model in MODELS],
    }

    (OUTPUT_DIR / "source-data.json").write_text(json.dumps(sources, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Catalogue HTML written to: {html_path}")


if __name__ == "__main__":
    main()
