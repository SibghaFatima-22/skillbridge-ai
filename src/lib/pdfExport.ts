import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Converts oklch(L C H [/ A]) to rgb(...) or rgba(...) string
 */
export function oklchToRgb(oklchStr: string): string {
  try {
    const match = oklchStr.match(
      /oklch\(\s*([\d.%]+)\s+([\d.%]+)\s+([\d.%]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i
    );
    if (!match) return "#64748b";

    let l = parseFloat(match[1]);
    if (match[1].endsWith("%")) l /= 100;

    let c = parseFloat(match[2]);
    if (match[2].endsWith("%")) c /= 100;

    let h = parseFloat(match[3]);

    let alpha = 1;
    if (match[4]) {
      alpha = parseFloat(match[4]);
      if (match[4].endsWith("%")) alpha /= 100;
    }

    // Convert OKLCH to OKLAB
    const l_ = l;
    const a_ = c * Math.cos((h * Math.PI) / 180);
    const b_ = c * Math.sin((h * Math.PI) / 180);

    // Convert OKLAB to LMS
    const l__ = l_ + 0.3963377774 * a_ + 0.2158037573 * b_;
    const m__ = l_ - 0.1055613458 * a_ - 0.0638541728 * b_;
    const s__ = l_ - 0.0894841775 * a_ - 1.291485548 * b_;

    const l_cube = l__ * l__ * l__;
    const m_cube = m__ * m__ * m__;
    const s_cube = s__ * s__ * s__;

    // Convert LMS to linear sRGB
    const rLin = +4.0767416621 * l_cube - 3.3077115913 * m_cube + 0.2309699292 * s_cube;
    const gLin = -1.2684380046 * l_cube + 2.6097574011 * m_cube - 0.3413193965 * s_cube;
    const bLin = -0.0041960863 * l_cube - 0.7034186147 * m_cube + 1.707614701 * s_cube;

    // Linear sRGB to gamma-corrected sRGB
    const toGamma = (x: number) => {
      x = Math.max(0, Math.min(1, x));
      return x >= 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x;
    };

    const r = Math.round(toGamma(rLin) * 255);
    const g = Math.round(toGamma(gLin) * 255);
    const b = Math.round(toGamma(bLin) * 255);

    if (alpha < 1) {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return "#64748b";
  }
}

/**
 * Replaces all oklch(...), oklab(...), color-mix(...) instances in a CSS string with converted RGB
 */
export function sanitizeCssColors(cssText: string): string {
  if (!cssText) return "";

  // Replace oklch(...)
  let sanitized = cssText.replace(/oklch\([^)]+\)/gi, (match) => {
    return oklchToRgb(match);
  });

  // Replace oklab(...)
  sanitized = sanitized.replace(/oklab\([^)]+\)/gi, "#64748b");

  // Replace color-mix(...)
  sanitized = sanitized.replace(/color-mix\([^)]+\)/gi, "#64748b");

  return sanitized;
}

/**
 * Sanitize cloned document before html2canvas converts it to canvas
 */
export function sanitizeClonedDocumentForPdf(clonedDoc: Document) {
  // 1. Sanitize all style elements by replacing them with newly parsed style elements
  const styleElements = Array.from(clonedDoc.querySelectorAll("style"));
  styleElements.forEach((style) => {
    if (style.textContent && /oklch|oklab|color-mix/i.test(style.textContent)) {
      const newStyle = clonedDoc.createElement("style");
      newStyle.textContent = sanitizeCssColors(style.textContent);
      if (style.parentNode) {
        style.parentNode.replaceChild(newStyle, style);
      }
    }
  });

  // 2. Sanitize inline styles on all elements
  const allElements = Array.from(clonedDoc.querySelectorAll("*"));
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      const styleAttr = el.getAttribute("style");
      if (styleAttr && /oklch|oklab|color-mix/i.test(styleAttr)) {
        el.setAttribute("style", sanitizeCssColors(styleAttr));
      }

      // Convert computed styles for key color properties
      try {
        const computed = window.getComputedStyle(el);
        const colorProps = [
          "color",
          "backgroundColor",
          "borderColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "fill",
          "stroke",
        ];

        colorProps.forEach((prop) => {
          const val = (computed as any)[prop];
          if (val && typeof val === "string" && /oklch|oklab|color-mix/i.test(val)) {
            (el.style as any)[prop] = sanitizeCssColors(val);
          }
        });
      } catch {
        // ignore if computed style fails on cloned element
      }
    }
  });
}

interface ExportPdfOptions {
  elementId: string;
  filename: string;
  backgroundColor?: string;
  scale?: number;
}

export async function exportElementToPdf({
  elementId,
  filename,
  backgroundColor = "#ffffff",
  scale = 2,
}: ExportPdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor,
    windowWidth: 1200,
    onclone: (clonedDoc) => {
      sanitizeClonedDocumentForPdf(clonedDoc);
    },
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfPageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pdfPageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfPageHeight;
  }

  pdf.save(filename);
}
