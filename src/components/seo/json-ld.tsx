type JsonLdProps = {
  data: unknown;
};

/** Renders JSON-LD for search engines (safe: JSON.stringify escapes). */
export function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? JSON.stringify(data) : JSON.stringify(data);
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} suppressHydrationWarning />
  );
}
