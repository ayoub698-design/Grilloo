// Removes the white studio background of catalogue product shots (flood fill from the
// borders), softens the edge, trims to content and downsizes. Output: RGBA PNG.
using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Media;
using System.Windows.Media.Imaging;

public static class Cutout
{
    public static string Run(string inPath, string outPath, int maxSide, int tol, int minHole)
    {
        var dec = BitmapDecoder.Create(new Uri(inPath), BitmapCreateOptions.IgnoreColorProfile, BitmapCacheOption.OnLoad);
        BitmapSource src = new FormatConvertedBitmap(dec.Frames[0], PixelFormats.Bgra32, null, 0);
        int w = src.PixelWidth, h = src.PixelHeight; var px = new byte[w * h * 4]; src.CopyPixels(px, w * 4, 0);

        // already has transparency? count transparent border pixels
        int clear = 0; for (int x = 0; x < w; x++) { if (px[x * 4 + 3] < 20) clear++; if (px[((h - 1) * w + x) * 4 + 3] < 20) clear++; }
        bool hasAlpha = clear > w / 2;

        Func<int, bool> bg = i =>
        {
            byte b = px[i * 4], g = px[i * 4 + 1], r = px[i * 4 + 2], a = px[i * 4 + 3];
            if (a < 20) return true;
            int mn = Math.Min(r, Math.Min(g, b)), mx = Math.Max(r, Math.Max(g, b));
            return mn >= 255 - tol && mx - mn < 22;
        };
        var removed = new bool[w * h];
        if (!hasAlpha)
        {
            var q = new Queue<int>();
            for (int x = 0; x < w; x++) { q.Enqueue(x); q.Enqueue((h - 1) * w + x); }
            for (int y = 0; y < h; y++) { q.Enqueue(y * w); q.Enqueue(y * w + w - 1); }
            while (q.Count > 0)
            {
                int i = q.Dequeue(); if (removed[i] || !bg(i)) continue; removed[i] = true;
                int x = i % w, y = i / w;
                if (x > 0) q.Enqueue(i - 1); if (x < w - 1) q.Enqueue(i + 1);
                if (y > 0) q.Enqueue(i - w); if (y < h - 1) q.Enqueue(i + w);
            }
            // second pass: enclosed, perfectly flat white holes (inside hose loops, handles)
            var seen = new bool[w * h];
            Func<int, bool> flat = i => { byte b = px[i * 4], g = px[i * 4 + 1], r = px[i * 4 + 2]; int mn = Math.Min(r, Math.Min(g, b)), mx = Math.Max(r, Math.Max(g, b)); return mn >= 249 && mx - mn < 8; };
            for (int s0 = 0; s0 < w * h; s0++)
            {
                if (seen[s0] || removed[s0] || !flat(s0)) continue;
                var comp = new List<int>(); var st = new Stack<int>(); st.Push(s0); seen[s0] = true;
                while (st.Count > 0)
                {
                    int i = st.Pop(); comp.Add(i); int x = i % w, y = i / w;
                    int[] nb = { x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1 };
                    foreach (int j in nb) if (j >= 0 && !seen[j] && !removed[j] && flat(j)) { seen[j] = true; st.Push(j); }
                }
                if (comp.Count > minHole) foreach (int i in comp) removed[i] = true;
            }
            for (int i = 0; i < w * h; i++) if (removed[i]) px[i * 4 + 3] = 0;
            // soft edge: remaining pixels touching removed ones get alpha from their darkness
            var copy = (byte[])px.Clone();
            for (int y = 1; y < h - 1; y++) for (int x = 1; x < w - 1; x++)
            {
                int i = y * w + x; if (removed[i]) continue;
                int n = (removed[i - 1] ? 1 : 0) + (removed[i + 1] ? 1 : 0) + (removed[i - w] ? 1 : 0) + (removed[i + w] ? 1 : 0);
                if (n == 0) continue;
                int mn = Math.Min(px[i * 4 + 2], Math.Min(px[i * 4 + 1], px[i * 4]));
                double dark = (255 - mn) / 70.0; if (dark > 1) dark = 1;
                double a = Math.Max(0.35, dark) * (n >= 3 ? 0.55 : 0.85);
                copy[i * 4 + 3] = (byte)(255 * a);
            }
            px = copy;
        }
        // trim
        int x0 = w, y0 = h, x1 = 0, y1 = 0;
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) if (px[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        if (x1 <= x0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }
        int pad = 6; x0 = Math.Max(0, x0 - pad); y0 = Math.Max(0, y0 - pad); x1 = Math.Min(w - 1, x1 + pad); y1 = Math.Min(h - 1, y1 + pad);
        var full = BitmapSource.Create(w, h, 96, 96, PixelFormats.Bgra32, null, px, w * 4);
        BitmapSource crop = new CroppedBitmap(full, new System.Windows.Int32Rect(x0, y0, x1 - x0 + 1, y1 - y0 + 1));
        double s = Math.Min(1.0, (double)maxSide / Math.Max(crop.PixelWidth, crop.PixelHeight));
        if (s < 1) crop = new TransformedBitmap(crop, new ScaleTransform(s, s));
        var enc = new PngBitmapEncoder(); enc.Frames.Add(BitmapFrame.Create(crop));
        using (var fs = File.Create(outPath)) enc.Save(fs);
        return string.Format("{0}x{1} alpha={2}", crop.PixelWidth, crop.PixelHeight, hasAlpha);
    }
}

