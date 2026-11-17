import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/** Coordenadas calibradas sobre decimo-loteria-de-navidad-2026-.jpg (1519×894). */
const TICKET = {
  width: 1519,
  height: 894,
  creamNumero: 'hsl(75, 50%, 98%)', // fondo que tapa las bolas
  creamPrecio: 'rgb(239, 236, 220)', // fondo al cambiar el importe
  // Ajusta aquí posiciones/tamaños (Y más alto = más abajo en la imagen)
  ballCentersX: [594, 724, 854, 984, 1114],
  ballY: 200, // número (dígitos sobre las bolas)
  ballRadius: 74, // tamaño del círculo/franja que tapa las bolas
  ballFontSize: 136, // tamaño de los dígitos
  ballDigitOffsetY: 12, // mueve solo los dígitos (+ = más abajo, − = más arriba)
  serie: { x: 1370, y: 240, fontSize: 95 }, // serie: y / fontSize
  fraccion: { x: 1370, y: 405, fontSize: 40 }, // fracción: y / fontSize
  // Texto libre arriba, entre zona media y columna derecha
  textoLibre: { x: 1250, y: 30, fontSize: 30, maxWidth: 500 },
  precio: {
    cover: { x: 1310, y: 568, w: 110, h: 80 },
    textX: 1357,
    textY: 606,
  },
} as const;

@Component({
  selector: 'app-loteria-navidad',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './loteria-navidad.component.html',
  styleUrl: './loteria-navidad.component.scss',
})
export class LoteriaNavidadComponent implements AfterViewInit {
  @ViewChild('ticketCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  numero = '';
  serie = '';
  fraccion = '';
  importe: number | null = 20;
  texto = '';

  private baseImage: HTMLImageElement | null = null;
  private imageReady = false;

  ngAfterViewInit(): void {
    const img = new Image();
    img.onload = () => {
      this.baseImage = img;
      this.imageReady = true;
      this.renderTicket();
    };
    img.src = 'assets/imgs/decimo-loteria-de-navidad-2026-.jpg';
  }

  /** Solo permite dígitos 0-9 (permite borrar, flechas, Tab y atajos Ctrl/Cmd). */
  onlyNumbers(event: KeyboardEvent): void {
    const allowed = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];
    if (allowed.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPasteDigits(
    event: ClipboardEvent,
    field: 'numero' | 'serie' | 'fraccion' | 'importe',
  ): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '').replace(
      /\D/g,
      '',
    );
    if (!digits) {
      return;
    }
    if (field === 'numero') {
      this.numero = digits.slice(0, 5);
    } else if (field === 'serie') {
      this.serie = digits.slice(0, 3);
    } else if (field === 'fraccion') {
      this.fraccion = digits.slice(0, 3);
    } else {
      const value = parseInt(digits.slice(0, 2), 10);
      this.importe = Number.isNaN(value)
        ? null
        : Math.min(20, Math.max(1, value));
    }
    this.onFieldChange();
  }

  onFieldChange(): void {
    this.numero = this.numero.replace(/\D/g, '').slice(0, 5);
    this.serie = this.serie.replace(/\D/g, '').slice(0, 3);
    this.fraccion = this.fraccion.replace(/\D/g, '').slice(0, 3);
    if (this.importe !== null) {
      if (this.importe < 1) {
        this.importe = 1;
      } else if (this.importe > 20) {
        this.importe = 20;
      } else {
        this.importe = Math.round(this.importe);
      }
    }
    this.renderTicket();
  }

  get canDownload(): boolean {
    return (
      this.imageReady &&
      /^\d{5}$/.test(this.numero) &&
      /^\d{1,3}$/.test(this.serie) &&
      /^\d{1,3}$/.test(this.fraccion) &&
      this.importe !== null &&
      this.importe >= 1 &&
      this.importe <= 20
    );
  }

  downloadTicket(): void {
    if (!this.canDownload) {
      return;
    }
    this.renderTicket();
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }
    const link = document.createElement('a');
    const serieLabel = this.formatOrdinal(this.serie);
    const fraccionLabel = this.formatOrdinal(this.fraccion);
    link.download = `decimo-${this.numero}-s${serieLabel}-f${fraccionLabel}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  }

  /** Sin ceros a la izquierda y con sufijo ordinal: 006 → "6ª." */
  private formatOrdinal(value: string): string {
    return `${parseInt(value, 10)}ª.`;
  }

  private renderTicket(): void {
    const canvas = this.canvasRef?.nativeElement;
    const img = this.baseImage;
    if (!canvas || !img) {
      return;
    }

    canvas.width = TICKET.width;
    canvas.height = TICKET.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.drawImage(img, 0, 0, TICKET.width, TICKET.height);

    const textoLibre = this.texto.trim();
    if (textoLibre) {
      this.drawTextoLibre(ctx, textoLibre);
    }

    const numero = this.numero.replace(/\D/g, '');
    if (numero.length === 5) {
      this.drawNumero(ctx, numero);
    }

    if (/^\d{1,3}$/.test(this.serie)) {
      this.drawCenteredText(
        ctx,
        this.formatOrdinal(this.serie),
        TICKET.serie.x,
        TICKET.serie.y,
        `bold ${TICKET.serie.fontSize}px Arial, Helvetica, sans-serif`,
      );
    }

    if (/^\d{1,3}$/.test(this.fraccion)) {
      this.drawCenteredText(
        ctx,
        this.formatOrdinal(this.fraccion),
        TICKET.fraccion.x,
        TICKET.fraccion.y,
        `bold ${TICKET.fraccion.fontSize}px Arial, Helvetica, sans-serif`,
      );
    }

    if (
      this.importe !== null &&
      this.importe >= 1 &&
      this.importe <= 20 &&
      this.importe !== 20
    ) {
      this.drawPrecio(ctx, this.importe);
    }
  }

  private drawNumero(ctx: CanvasRenderingContext2D, numero: string): void {
    const firstX = TICKET.ballCentersX[0];
    const lastX = TICKET.ballCentersX[TICKET.ballCentersX.length - 1];
    const y = TICKET.ballY;
    const r = TICKET.ballRadius;

    // Franja continua para tapar bolas y la línea que las une
    ctx.fillStyle = TICKET.creamNumero;
    ctx.beginPath();
    ctx.roundRect(
      firstX - r,
      y - r - 18,
      lastX - firstX + r * 2,
      r * 2 + 36,
      r,
    );
    ctx.fill();

    ctx.font = `bold ${TICKET.ballFontSize}px Arial Black, Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';

    for (let i = 0; i < 5; i++) {
      ctx.fillText(
        numero[i],
        TICKET.ballCentersX[i],
        y + TICKET.ballDigitOffsetY,
      );
    }
  }

  private drawTextoLibre(ctx: CanvasRenderingContext2D, text: string): void {
    const { x, y, fontSize, maxWidth } = TICKET.textoLibre;
    ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(text, x, y, maxWidth);
  }

  private drawCenteredText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font: string,
  ): void {
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(text, x, y);
  }

  private drawPrecio(ctx: CanvasRenderingContext2D, importe: number): void {
    const { cover, textX, textY } = TICKET.precio;
    ctx.fillStyle = TICKET.creamPrecio;
    ctx.fillRect(cover.x, cover.y, cover.w, cover.h);

    const fontSize = importe >= 10 ? 70 : 78;
    this.drawCenteredText(
      ctx,
      String(importe),
      textX,
      textY,
      `bold ${fontSize}px Arial Black, Arial, Helvetica, sans-serif`,
    );
  }
}
