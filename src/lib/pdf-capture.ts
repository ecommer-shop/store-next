interface PdfCaptureOptions {
  containerSelector: string;
  pixelRatio?: number;
  backgroundColor?: string;
  isDark?: boolean;
  filename?: string;
}

interface CanvasReplacement {
  canvas: HTMLCanvasElement;
  img: HTMLImageElement;
}

interface BackdropState {
  el: HTMLElement;
  original: string;
}

interface DarkImageState {
  img: HTMLImageElement;
  originalDisplay: string;
}

interface CaptureState {
  canvasReplacements: CanvasReplacement[];
  backdropEls: BackdropState[];
  darkImages: DarkImageState[];
  originalOverflow: string;
  originalWidth: string;
}

const OVERRIDE_CSS = `
  [data-pdf-reveal], [data-pdf-stagger] {
    opacity: 1 !important;
    transform: none !important;
  }
  [data-pdf-chip] {
    transform: rotate(calc(var(--pdf-rot) * 1deg)) !important;
  }
`;

export class PdfCapture {
  private el: HTMLElement;
  private opts: Required<PdfCaptureOptions>;

  constructor(opts: PdfCaptureOptions) {
    const el = document.querySelector(opts.containerSelector) as HTMLElement | null;
    if (!el) throw new Error(`PdfCapture: container "${opts.containerSelector}" not found`);
    this.el = el;
    this.opts = {
      containerSelector: opts.containerSelector,
      pixelRatio: opts.pixelRatio ?? 3,
      backgroundColor: opts.backgroundColor ?? '#F1F1F1',
      isDark: opts.isDark ?? document.documentElement.classList.contains('dark'),
      filename: opts.filename ?? 'vendedores-ecommer.pdf',
    };
  }

  private prepare(): CaptureState {
    const el = this.el;
    const state: CaptureState = {
      canvasReplacements: [],
      backdropEls: [],
      darkImages: [],
      originalOverflow: '',
      originalWidth: '',
    };

    el.querySelectorAll('canvas').forEach(canvas => {
      const img = document.createElement('img');
      img.src = (canvas as HTMLCanvasElement).toDataURL('image/png', 1.0);
      img.style.position = 'fixed';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100vw';
      img.style.height = '100dvh';
      img.style.objectFit = 'cover';
      canvas.parentNode?.replaceChild(img, canvas);
      state.canvasReplacements.push({ canvas: canvas as HTMLCanvasElement, img });
    });

    el.querySelectorAll('[class*="backdrop-blur-"]').forEach(el => {
      const e = el as HTMLElement;
      state.backdropEls.push({ el: e, original: e.style.backdropFilter });
      e.style.backdropFilter = 'none';
    });

    el.querySelectorAll('img[class*="dark:"]').forEach(img => {
      const e = img as HTMLImageElement;
      const orig = e.style.display;
      const isDarkBlock = e.className.includes('dark:block');
      const isDarkHidden = e.className.includes('dark:hidden');
      if (isDarkBlock) e.style.display = this.opts.isDark ? 'block' : 'none';
      else if (isDarkHidden) e.style.display = this.opts.isDark ? 'none' : 'block';
      state.darkImages.push({ img: e, originalDisplay: orig });
    });

    const mainEl = el.querySelector('main') as HTMLElement | null;
    if (mainEl) {
      state.originalOverflow = mainEl.style.overflow;
      mainEl.style.overflow = 'visible';
    }

    state.originalWidth = el.style.width;
    el.style.width = `${window.innerWidth}px`;

    return state;
  }

  private restore(state: CaptureState): void {
    for (const { canvas, img } of state.canvasReplacements) {
      img.parentNode?.replaceChild(canvas, img);
    }
    for (const { el, original } of state.backdropEls) {
      el.style.backdropFilter = original;
    }
    for (const { img, originalDisplay } of state.darkImages) {
      img.style.display = originalDisplay;
    }
    const mainEl = this.el.querySelector('main') as HTMLElement | null;
    if (mainEl) mainEl.style.overflow = state.originalOverflow;
    this.el.style.width = state.originalWidth;
  }

  async toPdf(): Promise<void> {
    const { dataUrl, width, height } = await this.capture();

    const { jsPDF } = await import('jspdf');
    const pdfW = 210;
    const pdfH = (height * pdfW) / width;
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: [pdfW, pdfH] });
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(this.opts.filename);
  }

  private async capture(): Promise<{ dataUrl: string; width: number; height: number }> {
    const { el, opts } = this;

    const state = this.prepare();
    if (opts.isDark) el.classList.add('dark');

    const overrideStyle = document.createElement('style');
    overrideStyle.id = 'pdf-capture-override';
    overrideStyle.textContent = OVERRIDE_CSS;
    document.head.appendChild(overrideStyle);

    try {
      await document.fonts.ready;

      await Promise.all(
        Array.from(el.querySelectorAll('img')).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>(resolve => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 3000);
          });
        })
      );

      const { toCanvas, getFontEmbedCSS } = await import('html-to-image');

      const fontEmbedCSS = await getFontEmbedCSS(el);

      const captureCanvas = await toCanvas(el, {
        pixelRatio: opts.pixelRatio,
        backgroundColor: opts.backgroundColor,
        fontEmbedCSS,
      });

      return {
        dataUrl: captureCanvas.toDataURL('image/png'),
        width: captureCanvas.width,
        height: captureCanvas.height,
      };
    } finally {
      this.restore(state);
      if (opts.isDark) el.classList.remove('dark');
      overrideStyle.remove();
    }
  }
}
