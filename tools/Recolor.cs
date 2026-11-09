// Gradient-map recolouring of an RGBA PNG to the GRILLOO palette (keeps alpha), then trims and resizes.
using System; using System.IO; using System.Windows; using System.Windows.Media; using System.Windows.Media.Imaging;
public static class Recolor {
  static readonly double[] P = { 0, .32, .58, .82, 1 };
  static readonly byte[,] C = { { 0x07, 0x2B, 0x31 }, { 0x0D, 0x55, 0x60 }, { 0x3F, 0xAE, 0xBA }, { 0xBF, 0xEA, 0xEE }, { 0xFF, 0xFF, 0xFF } };
  public static string Run(string inPath, string outPath, int maxSide) {
    var d = BitmapDecoder.Create(new Uri(inPath), BitmapCreateOptions.IgnoreImageCache, BitmapCacheOption.OnLoad);
    BitmapSource src = new FormatConvertedBitmap(d.Frames[0], PixelFormats.Bgra32, null, 0);
    int w = src.PixelWidth, h = src.PixelHeight; var px = new byte[w * h * 4]; src.CopyPixels(px, w * 4, 0);
    double lo = 1, hi = 0; var L = new double[w * h];
    for (int i = 0; i < w * h; i++) { L[i] = (0.2126 * px[i * 4 + 2] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4]) / 255.0; if (px[i * 4 + 3] > 200) { if (L[i] < lo) lo = L[i]; if (L[i] > hi) hi = L[i]; } }
    lo = Math.Max(0, lo - .02); hi = Math.Min(1, hi + .02); if (hi - lo < .1) { lo = 0; hi = 1; }
    int x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (int i = 0; i < w * h; i++) {
      double t = (L[i] - lo) / (hi - lo); t = Math.Max(0, Math.Min(1, t)); t = Math.Pow(t, 0.85);
      int k = 0; while (k < P.Length - 2 && t > P[k + 1]) k++;
      double f = (t - P[k]) / (P[k + 1] - P[k]);
      for (int c = 0; c < 3; c++) { double v = C[k, c] + (C[k + 1, c] - C[k, c]) * f; px[i * 4 + (2 - c)] = (byte)v; }
      if (px[i * 4 + 3] > 20) { int x = i % w, y = i / w; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    var full = BitmapSource.Create(w, h, 96, 96, PixelFormats.Bgra32, null, px, w * 4);
    int pad = 8; x0 = Math.Max(0, x0 - pad); y0 = Math.Max(0, y0 - pad); x1 = Math.Min(w - 1, x1 + pad); y1 = Math.Min(h - 1, y1 + pad);
    BitmapSource crop = new CroppedBitmap(full, new Int32Rect(x0, y0, x1 - x0 + 1, y1 - y0 + 1));
    double s = Math.Min(1.0, (double)maxSide / Math.Max(crop.PixelWidth, crop.PixelHeight));
    if (s < 1) crop = new TransformedBitmap(crop, new ScaleTransform(s, s));
    var e = new PngBitmapEncoder(); e.Frames.Add(BitmapFrame.Create(crop)); using (var fs = File.Create(outPath)) e.Save(fs);
    return crop.PixelWidth + "x" + crop.PixelHeight;
  }
}
