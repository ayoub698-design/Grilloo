// Converts raw decrypted image streams (from PdfImages.cs) to RGBA PNGs.
// Handles DCT CMYK JPEG (via WPF), Flate Indexed/DeviceCMYK, DeviceGray, and SMask alpha.
using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Media;
using System.Windows.Media.Imaging;

public static class PdfToPng
{
    static readonly byte[] Pad = {
        0x28,0xBF,0x4E,0x5E,0x4E,0x75,0x8A,0x41,0x64,0x00,0x4E,0x56,0xFF,0xFA,0x01,0x08,
        0x2E,0x2E,0x00,0xB6,0xD0,0x68,0x3E,0x80,0x2F,0x0C,0xA9,0xFE,0x64,0x53,0x69,0x7A };
    static byte[] fileKey; static byte[] B; static string T;
    static Dictionary<int, int> objPos = new Dictionary<int, int>();

    static byte[] Rc4(byte[] key, byte[] data, int off, int len)
    {
        var s = new byte[256]; for (int i = 0; i < 256; i++) s[i] = (byte)i;
        for (int i = 0, j = 0; i < 256; i++) { j = (j + s[i] + key[i % key.Length]) & 255; var t = s[i]; s[i] = s[j]; s[j] = t; }
        var o = new byte[len];
        for (int k = 0, i = 0, j = 0; k < len; k++) { i = (i + 1) & 255; j = (j + s[i]) & 255; var t = s[i]; s[i] = s[j]; s[j] = t; o[k] = (byte)(data[off + k] ^ s[(s[i] + s[j]) & 255]); }
        return o;
    }
    static byte[] Literal(byte[] b, int start)
    {
        var o = new List<byte>(); int depth = 0;
        for (int i = start; i < b.Length; i++)
        {
            byte c = b[i];
            if (c == '(') { depth++; if (depth == 1) continue; }
            else if (c == ')') { depth--; if (depth == 0) break; }
            else if (c == '\\')
            {
                i++; byte n = b[i];
                if (n == 'n') { o.Add(10); continue; } if (n == 'r') { o.Add(13); continue; } if (n == 't') { o.Add(9); continue; }
                if (n == 'b') { o.Add(8); continue; } if (n == 'f') { o.Add(12); continue; }
                if (n == '\r') { if (b[i + 1] == '\n') i++; continue; } if (n == '\n') continue;
                if (n >= '0' && n <= '7') { int v = 0, k = 0; while (k < 3 && b[i] >= '0' && b[i] <= '7') { v = v * 8 + (b[i] - '0'); i++; k++; } i--; o.Add((byte)v); continue; }
                o.Add(n); continue;
            }
            o.Add(c);
        }
        return o.ToArray();
    }
    static string Dict(int id)
    {
        int p = objPos[id]; int e = T.IndexOf("endobj", p); string s = T.Substring(p, e - p);
        int k = s.IndexOf("stream"); return k > 0 ? s.Substring(0, k) : s;
    }
    static byte[] Stream(int id)
    {
        string d = Dict(id); int p = objPos[id];
        int sIdx = T.IndexOf("stream", p) + 6; if (T[sIdx] == '\r') sIdx++; if (T[sIdx] == '\n') sIdx++;
        int len = int.Parse(Regex.Match(d, @"/Length\s+(\d+)").Groups[1].Value);
        var ok = new byte[21]; Array.Copy(fileKey, ok, 16);
        ok[16] = (byte)id; ok[17] = (byte)(id >> 8); ok[18] = (byte)(id >> 16);
        using (var md5 = MD5.Create()) return Rc4(md5.ComputeHash(ok).Take(16).ToArray(), B, sIdx, len);
    }
    static byte[] Inflate(byte[] z)
    {
        using (var ms = new MemoryStream(z, 2, z.Length - 2)) using (var ds = new DeflateStream(ms, CompressionMode.Decompress)) using (var o = new MemoryStream()) { ds.CopyTo(o); return o.ToArray(); }
    }
    static byte[] Data(int id) { var raw = Stream(id); return Dict(id).Contains("/FlateDecode") ? Inflate(raw) : raw; }

    static void CmykToRgb(byte c, byte m, byte y, byte k, out byte r, out byte g, out byte bl)
    {
        r = (byte)(255 * (255 - c) * (255 - k) / 65025);
        g = (byte)(255 * (255 - m) * (255 - k) / 65025);
        bl = (byte)(255 * (255 - y) * (255 - k) / 65025);
    }

    public static string Run(string pdfPath, string outDir, string idsCsv)
    {
        B = File.ReadAllBytes(pdfPath); T = Encoding.GetEncoding(28591).GetString(B);
        foreach (Match m in Regex.Matches(T, @"(?<!\d)(\d+) 0 obj")) { int id = int.Parse(m.Groups[1].Value); if (!objPos.ContainsKey(id)) objPos[id] = m.Index; }
        var em = Regex.Match(T, @"/Encrypt\s+(\d+) 0 R"); int encId = int.Parse(em.Groups[1].Value);
        string encD = T.Substring(objPos[encId], 400);
        var O = Literal(B, objPos[encId] + encD.IndexOf("/O(") + 2);
        int P = int.Parse(Regex.Match(encD, @"/P\s+(-?\d+)").Groups[1].Value);
        var hid = Regex.Match(T, @"/ID\s*\[\s*<([0-9A-Fa-f]+)>").Groups[1].Value;
        var id0 = new byte[hid.Length / 2]; for (int i = 0; i < id0.Length; i++) id0[i] = Convert.ToByte(hid.Substring(i * 2, 2), 16);
        using (var md5 = MD5.Create())
        {
            var buf = new List<byte>(Pad); buf.AddRange(O.Take(32)); buf.AddRange(BitConverter.GetBytes(P)); buf.AddRange(id0);
            var h = md5.ComputeHash(buf.ToArray()); for (int i = 0; i < 50; i++) h = md5.ComputeHash(h, 0, 16);
            fileKey = h.Take(16).ToArray();
        }
        var log = new StringBuilder();
        foreach (var part in idsCsv.Split(','))
        {
            var kv = part.Split(':'); int id = int.Parse(kv[0]); string name = kv[1];
            try
            {
                string d = Dict(id);
                int w = int.Parse(Regex.Match(d, @"/Width\s+(\d+)").Groups[1].Value);
                int h = int.Parse(Regex.Match(d, @"/Height\s+(\d+)").Groups[1].Value);
                var px = new byte[w * h * 4];
                if (d.Contains("/DCTDecode"))
                {
                    var jpg = Stream(id);
                    bool adobe = false; for (int i = 0; i < Math.Min(jpg.Length - 5, 4000); i++) if (jpg[i] == 0xFF && jpg[i + 1] == 0xEE) { adobe = true; break; }
                    var dec = new JpegBitmapDecoder(new MemoryStream(jpg), BitmapCreateOptions.PreservePixelFormat | BitmapCreateOptions.IgnoreColorProfile, BitmapCacheOption.OnLoad);
                    var f = dec.Frames[0];
                    if (f.Format == PixelFormats.Cmyk32)
                    {
                        var cm = new byte[w * h * 4]; f.CopyPixels(cm, w * 4, 0);
                        for (int i = 0; i < w * h; i++)
                        {
                            byte c = cm[i * 4], m = cm[i * 4 + 1], y = cm[i * 4 + 2], k = cm[i * 4 + 3];
                            if (adobe) { c = (byte)(255 - c); m = (byte)(255 - m); y = (byte)(255 - y); k = (byte)(255 - k); }
                            byte r, g, bl; CmykToRgb(c, m, y, k, out r, out g, out bl);
                            px[i * 4] = bl; px[i * 4 + 1] = g; px[i * 4 + 2] = r; px[i * 4 + 3] = 255;
                        }
                        log.Append(name + " cmyk adobe=" + adobe + "; ");
                    }
                    else
                    {
                        var cv = new FormatConvertedBitmap(f, PixelFormats.Bgra32, null, 0); cv.CopyPixels(px, w * 4, 0);
                        log.Append(name + " " + f.Format + "; ");
                    }
                }
                else
                {
                    var raw = Data(id);
                    var csm = Regex.Match(d, @"/ColorSpace\s*(\d+) 0 R");
                    if (csm.Success)
                    {
                        string cs = T.Substring(objPos[int.Parse(csm.Groups[1].Value)], 120);
                        var im = Regex.Match(cs, @"/Indexed\s*/DeviceCMYK\s+(\d+)\s+(\d+) 0 R");
                        var pal = Data(int.Parse(im.Groups[2].Value));
                        for (int i = 0; i < w * h; i++)
                        {
                            int ix = raw[i] * 4; byte r, g, bl;
                            CmykToRgb(pal[ix], pal[ix + 1], pal[ix + 2], pal[ix + 3], out r, out g, out bl);
                            px[i * 4] = bl; px[i * 4 + 1] = g; px[i * 4 + 2] = r; px[i * 4 + 3] = 255;
                        }
                        log.Append(name + " indexed; ");
                    }
                    else if (d.Contains("/DeviceCMYK"))
                    {
                        for (int i = 0; i < w * h; i++) { byte r, g, bl; CmykToRgb(raw[i * 4], raw[i * 4 + 1], raw[i * 4 + 2], raw[i * 4 + 3], out r, out g, out bl); px[i * 4] = bl; px[i * 4 + 1] = g; px[i * 4 + 2] = r; px[i * 4 + 3] = 255; }
                    }
                }
                var sm = Regex.Match(d, @"/SMask\s+(\d+) 0 R");
                if (sm.Success) try
                {
                    int sid = int.Parse(sm.Groups[1].Value); string sd = Dict(sid);
                    int sw = int.Parse(Regex.Match(sd, @"/Width\s+(\d+)").Groups[1].Value);
                    int sh = int.Parse(Regex.Match(sd, @"/Height\s+(\d+)").Groups[1].Value);
                    var a = Data(sid);
                    for (int y = 0; y < h; y++) for (int x = 0; x < w; x++)
                        px[(y * w + x) * 4 + 3] = a[(y * sh / h) * sw + (x * sw / w)];
                    log.Append("(alpha) ");
                } catch (Exception ax) { log.Append("(alpha skipped: " + ax.Message + ") "); }
                var bmp = BitmapSource.Create(w, h, 96, 96, PixelFormats.Bgra32, null, px, w * 4);
                var enc = new PngBitmapEncoder(); enc.Frames.Add(BitmapFrame.Create(bmp));
                using (var fs = File.Create(Path.Combine(outDir, name + ".png"))) enc.Save(fs);
            }
            catch (Exception ex) { log.Append(name + " ERROR " + ex.Message + "; "); }
        }
        return log.ToString();
    }
}

