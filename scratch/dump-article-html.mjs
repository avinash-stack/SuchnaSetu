import http from "http";

http.get("http://localhost:3008/news/no-rain-but-massive-deluge-what-really-triggered-nepals-sudden-destructive-flash-bf6e24", (res) => {
  let body = "";
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => {
    console.log("STATUS:", res.statusCode);
    console.log("BODY LENGTH:", body.length);
    const sections = body.match(/<section[\s\S]*?<\/section>/gi) || [];
    console.log("TOTAL SECTIONS FOUND:", sections.length);
    sections.forEach((s, idx) => {
      const headingMatch = s.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i) || s.match(/<span[^>]*>(.*?)<\/span>/i);
      console.log(`SECTION ${idx}:`, headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : s.slice(0, 100));
    });
  });
});

