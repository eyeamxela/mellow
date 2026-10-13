# Mellow public design preview

The root `index.html` packages the latest supplied Mellow site for public design review. The eventual storefront will run on Shopify. This static preview does not accept contest entries, count community votes, process checkout, or grant access to the private judging application.

## Source

- Original attachment: `/Users/xela/Downloads/Mellow Climbing - Site.html`
- Original size: 20,352,142 bytes
- Original SHA-256: `ef0b1656252079bdfc65a2289c312d74ad87f6b483f2cb5ae8a31278b4d53f7e`
- Release file: `index.html`
- Initial packaged release SHA-256: `496f04ade28de1f94661e6bc3741fb79dce0052d69774f1c37bf9a167bf31a73`

The original attachment is unchanged. The bundled resource manifest, resource mapping, and page order are unchanged. All 51 embedded resources remain in the release, including images, fonts, React, and ReactDOM.

## Narrow release changes

1. Added a persistent notice: **Design preview · Entries, voting and checkout are not live.** It appears outside the React root, survives page navigation, and sits above overlays. Its height is reserved in the page; the four full-screen overlays start below it so their controls stay accessible.
2. Changed the local entry receipt from “SUBMISSION ADMITTED” to “PREVIEW SAVED LOCALLY” and “NO ENTRY SENT · DEMO ONLY.” The console still keeps preview entries in the current browser only.
3. Labeled the brief voter screen as a preview, removed its nonfunctional password field, renamed its username field to display name, and labeled its recorded choice as a preview vote that is not counted. This is not an account system.
4. Disabled both existing checkout buttons and labeled them “CHECKOUT NOT LIVE.”

No judging link, credential, private entry, or submission API token has been added to the public site. The private backend is a separate service with its own access checks. Hiding its URL is not the access control.

## Routes

The attachment uses hash navigation: `/#home`, `/#shop`, `/#product`, `/#magazine`, `/#issue`, `/#rockgames`, `/#about`, `/#youtube`, and `/#coords`. The Rock Games preview is `/#rockgames`.

Older standalone HTML files remain in the repository as the original design-system export; the packaged `index.html` is the latest public release source. Hosting configuration should serve or redirect public navigation to the latest hash routes rather than present the older export as the current site.

## Validation

- Source attachment checksum unchanged after packaging.
- All 51 embedded resources decoded successfully; 15,112,418 decoded bytes.
- Resource manifest, external resource mapping, and page order exactly match the original attachment.
- Nine JavaScript syntax checks passed: seven inline application scripts and two embedded runtime scripts.
- The receipt disclosure, preview notice, removed password field, and both disabled checkout labels were checked in the packaged template.

Browser rendering and deployed-route checks must be recorded by the release operator. This packaging step does not itself deploy the site or connect the existing submission frontend.
