// Extracts image XObjects from the (RC4, empty user password) GRILLOO catalogue PDF.
// Usage from PowerShell: see tools/extract-pdf-images.ps1
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

public static class PdfImages
{
    static readonly byte[] Pad = {
        0x28,0xBF,0x4E,0x5E,0x4E,0x75,0x8A,0x41,0x64,0x00,0x4E,0x56,0xFF,0xFA,0x01,0x08,
        0x2E,0x2E,0x00,0xB6,0xD0,0x68,0x3E,0x80,0x2F,0x0C,0xA9,0xFE,0x64,0x53,0x69,0x7A };

    static byte[] Rc4(byte[] key, byte[] data, int off, int len)
    {
        var s = new byte[256];
        for (int i = 0; i < 256; i++) s[i] = (byte)i;
        for (int i = 0, j = 0; i < 256; i++)
        {
            j = (j + s[i] + key[i % key.Length]) & 255;
            var t = s[i]; s[i] = s[j]; s[j] = t;
        }
        var o = new byte[len];
        for (int k = 0, i = 0, j = 0; k < len; k++)
        {
            i = (i + 1) & 255; j = (j + s[i]) & 255;
            var t = s[i]; s[i] = s[j]; s[j] = t;
            o[k] = (byte)(data[off + k] ^ s[(s[i] + s[j]) & 255]);
        }
        return o;
    }

    // Parse a PDF literal string starting at '(' index; returns raw bytes.
    static byte[] Literal(byte[] b, int start)
    {
        var o = new List<byte>(); int depth = 0; int i = start;
        for (; i < b.Length; i++)
        {
            byte c = b[i];
            if (c == '(') { depth++; if (depth == 1) continue; }
            else if (c == ')') { depth--; if (depth == 0) break; }
            else if (c == '\\')
            {
                i++; byte n = b[i];
                switch ((char)n)
                {
                    case 'n': o.Add(10); continue;
                    case 'r': o.Add(13); continue;
                    case 't': o.Add(9); continue;
                    case 'b': o.Add(8); continue;
                    case 'f': o.Add(12); continue;
                    case '\r': if (b[i + 1] == '\n') i++; continue;
                    case '\n': continue;
                }
                if (n >= '0' && n <= '7')
                {
                    int v = 0, k = 0;
                    while (k < 3 && b[i] >= '0' && b[i] <= '7') { v = v * 8 + (b[i] - '0'); i++; k++; }
                    i--; o.Add((byte)v); continue;
                }
                o.Add(n); continue;
            }
            o.Add(c);
        }
        return o.ToArray();
    }

    static byte[] Hex(string h)
    {
        var r = new byte[h.Length / 2];
        for (int i = 0; i < r.Length; i++) r[i] = Convert.ToByte(h.Substring(i * 2, 2), 16);
        return r;
    }

    public static string Run(string pdfPath, string outDir)
    {
        var b = File.ReadAllBytes(pdfPath);
        var t = Encoding.GetEncoding(28591).GetString(b);
        var log = new StringBuilder();

        // --- encryption key (Algorithm 2, R3, empty user password)
        var em = Regex.Match(t, @"/Encrypt\s+(\d+) 0 R");
        var encObj = Regex.Match(t, @"(?s)\b" + em.Groups[1].Value + @" 0 obj(.*?)endobj");
        int encStart = encObj.Groups[1].Index;
        int oIdx = t.IndexOf("/O(", encStart) + 2;
        var O = Literal(b, oIdx);
        var P = int.Parse(Regex.Match(encObj.Value, @"/P\s+(-?\d+)").Groups[1].Value);
        var id0 = Hex(Regex.Match(t, @"/ID\s*\[\s*<([0-9A-Fa-f]+)>").Groups[1].Value);
        using (var md5 = MD5.Create())
        {
            var buf = new List<byte>(); buf.AddRange(Pad); buf.AddRange(O.Take(32));
            buf.AddRange(BitConverter.GetBytes(P)); buf.AddRange(id0);
            var h = md5.ComputeHash(buf.ToArray());
            for (int i = 0; i < 50; i++) h = md5.ComputeHash(h, 0, 16);
            var key = h.Take(16).ToArray();

            // --- page order
            var objRx = new Regex(@"(?s)(?<!\d)(\d+) 0 obj(.*?)endobj");
            var objs = new Dictionary<int, Match>();
            foreach (Match m in objRx.Matches(t)) { int oid = int.Parse(m.Groups[1].Value); if (!objs.ContainsKey(oid)) objs[oid] = m; }
            int root = objs.First(kv => Regex.IsMatch(kv.Value.Groups[2].Value, @"/Type\s*/Pages\b") && !kv.Value.Groups[2].Value.Contains("/Parent")).Key;
            var pages = new List<int>();
            Action<int> walk = null;
            walk = id =>
            {
                var body = objs[id].Groups[2].Value;
                var dictPart = body.Contains("stream") ? body.Substring(0, body.IndexOf("stream")) : body;
                if (Regex.IsMatch(dictPart, @"/Type\s*/Pages\b"))
                {
                    var kids = Regex.Match(dictPart, @"/Kids\s*\[([^\]]*)\]").Groups[1].Value;
                    foreach (Match k in Regex.Matches(kids, @"(\d+) 0 R")) walk(int.Parse(k.Groups[1].Value));
                }
                else pages.Add(id);
            };
            walk(root);
            log.AppendLine("pages=" + pages.Count);

            Func<int, string> dictOf = id => { var s = objs[id].Groups[2].Value; int k = s.IndexOf("stream"); return k > 0 ? s.Substring(0, k) : s; };
            Func<string, string, string> resolve = (d, name) =>
            {
                var m = Regex.Match(d, "/" + name + @"\s*(\d+) 0 R");
                if (m.Success) return dictOf(int.Parse(m.Groups[1].Value));
                var m2 = Regex.Match(d, "/" + name + @"\s*<<");
                if (!m2.Success) return "";
                int st = m2.Index + m2.Length, dep = 1, q = st;
                while (q < d.Length - 1 && dep > 0) { if (d[q] == '<' && d[q + 1] == '<') { dep++; q += 2; } else if (d[q] == '>' && d[q + 1] == '>') { dep--; q += 2; } else q++; }
                return d.Substring(st, q - st - 2);
            };

            var done = new HashSet<int>();
            var csv = new StringBuilder("page,obj,width,height,colorspace,filter,file\n");
            for (int pi = 0; pi < pages.Count; pi++)
            {
                var pd = dictOf(pages[pi]);
                var res = resolve(pd, "Resources");
                var work = new Queue<string>(); work.Enqueue(res); var seenForm = new HashSet<int>();
                while (work.Count > 0) {
                var xo = resolve(work.Dequeue(), "XObject");
                foreach (Match x in Regex.Matches(xo, @"/[^\s/]+\s*(\d+) 0 R"))
                {
                    int id = int.Parse(x.Groups[1].Value);
                    if (!objs.ContainsKey(id)) continue;
                    var d = dictOf(id);
                    if (Regex.IsMatch(d, @"/Subtype\s*/Form")) { if (seenForm.Add(id)) work.Enqueue(resolve(d, "Resources")); continue; }
                    if (!Regex.IsMatch(d, @"/Subtype\s*/Image")) continue;
                    var w = Regex.Match(d, @"/Width\s+(\d+)").Groups[1].Value;
                    var hgt = Regex.Match(d, @"/Height\s+(\d+)").Groups[1].Value;
                    var cs = Regex.Match(d, @"/ColorSpace\s*(/\w+|\d+ 0 R|\[)").Groups[1].Value;
                    var filt = Regex.Match(d, @"/Filter\s*(/\w+|\[[^\]]*\])").Groups[1].Value;
                    var smask = Regex.Match(d, @"/SMask\s+(\d+) 0 R").Groups[1].Value;
                    string fname = string.Format("p{0:D2}_o{1}.{2}", pi + 1, id, filt.Contains("DCT") ? "jpg" : "bin");
                    if (done.Add(id))
                    {
                        // stream bytes
                        var m = objs[id];
                        int sIdx = t.IndexOf("stream", m.Index) + 6;
                        if (t[sIdx] == '\r') sIdx++;
                        if (t[sIdx] == '\n') sIdx++;
                        int len = int.Parse(Regex.Match(d, @"/Length\s+(\d+)").Groups[1].Value);
                        var ok = new byte[21]; Array.Copy(key, ok, 16);
                        ok[16] = (byte)id; ok[17] = (byte)(id >> 8); ok[18] = (byte)(id >> 16); ok[19] = 0; ok[20] = 0;
                        var oKey = md5.ComputeHash(ok).Take(16).ToArray();
                        File.WriteAllBytes(Path.Combine(outDir, fname), Rc4(oKey, b, sIdx, len));
                    }
                    csv.AppendFormat("{0},{1},{2},{3},{4},{5},{6}{7}\n", pi + 1, id, w, hgt, cs, filt, fname, smask != "" ? ",smask=" + smask : "");
                }
                }
            }
            File.WriteAllText(Path.Combine(outDir, "_index.csv"), csv.ToString());
            log.AppendLine("images=" + done.Count);
        }
        return log.ToString();
    }
}

