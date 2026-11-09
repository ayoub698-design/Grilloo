// Contact sheet of images on a light background (preview helper).
using System; using System.IO; using System.Windows; using System.Windows.Media; using System.Windows.Media.Imaging;
public static class Sheet {
  public static void Run(string[] files, string outPath, int cols, int cw, int ch) {
    int rows = (files.Length + cols - 1) / cols; var dv = new DrawingVisual();
    using (var dc = dv.RenderOpen()) {
      dc.DrawRectangle(new SolidColorBrush(Color.FromRgb(238, 246, 247)), null, new Rect(0, 0, cols * cw, rows * ch));
      for (int i = 0; i < files.Length; i++) {
        var b = new BitmapImage(); b.BeginInit(); b.CacheOption = BitmapCacheOption.OnLoad; b.CreateOptions = BitmapCreateOptions.IgnoreImageCache; b.UriSource = new Uri(files[i]); b.EndInit();
        int c = i % cols, r = i / cols; double s = Math.Min((cw - 8.0) / b.PixelWidth, (ch - 26.0) / b.PixelHeight);
        dc.DrawImage(b, new Rect(c * cw + (cw - b.PixelWidth * s) / 2, r * ch + 20, b.PixelWidth * s, b.PixelHeight * s));
        dc.DrawText(new FormattedText(Path.GetFileNameWithoutExtension(files[i]), System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, new Typeface("Segoe UI"), 14, Brushes.Black, 1.0), new Point(c * cw + 6, r * ch + 2));
      }
    }
    var rt = new RenderTargetBitmap(cols * cw, rows * ch, 96, 96, PixelFormats.Pbgra32); rt.Render(dv);
    var en = new PngBitmapEncoder(); en.Frames.Add(BitmapFrame.Create(rt)); using (var f = File.Create(outPath)) en.Save(f);
  }
}
