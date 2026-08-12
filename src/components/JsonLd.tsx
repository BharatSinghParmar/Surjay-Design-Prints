/**
 * Renders a schema.org object as a JSON-LD script tag.
 *
 * `<script>` is a raw-text element: the HTML parser decodes no character
 * references inside it and ends the element at the first `</script` sequence.
 * So a literal `&` in the data is safe and passes straight through to
 * JSON.parse, but a stray `<` is not — it can terminate the script early and
 * spill the rest of the JSON into the page as markup. Replacing every `<` with
 * its unicode escape keeps the JSON valid and parses back to the same string.
 *
 * This matters now that FAQ answers — free prose, edited by non-developers —
 * are serialised through here alongside the fixed organisation schema.
 */

/**
 * U+2028 and U+2029 are legal inside JSON strings but are line terminators in
 * JavaScript, so any consumer that evaluates rather than parses this would
 * break on them. Built from char codes on purpose: written literally these two
 * characters are invisible in an editor, so a stray autoformat or a careless
 * copy-paste could delete them and quietly disable the escaping.
 */
const LINE_SEPARATORS = new RegExp(`[${String.fromCharCode(0x2028, 0x2029)}]`, "g");

export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEPARATORS, (char) =>
      char.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029"
    );

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
