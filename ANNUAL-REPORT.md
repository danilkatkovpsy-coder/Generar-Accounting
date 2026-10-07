# Official Annual Report Foundation

Profile: Vaikeettevotja, OU. Source: https://xbrl.eesti.ee/.
The bundled official package is `et-gaap_2026-01-01.zip`, published by RIK.
The catalogue is derived from its XSD and presentation/label linkbases, not a manually authored list of financial rows.

Implemented forms:
- [101000] General information (company name, registry code, annual period).
- [201012] Balance sheet, small OU.
- [301011] Income statement, scheme 1.

This is a draft of the primary statements, not a complete submission-ready annual report.
Notes, management report, signatures, distributions, and applicable RIK business rules are not implemented.
No invoice totals are silently mapped into official facts: missing account mappings and opening balances must not be represented as real zero balances.

## Local Service

```sh
python3 -m venv .annual-report-venv
.annual-report-venv/bin/python -m pip install -r requirements-annual-report.txt
.annual-report-venv/bin/python tools/annual_report_server.py --port 8765
```

Keep using the existing website at http://127.0.0.1:8173/. The isolated API on port 8765 serves only annual-report requests; it does not serve HTML or replace the website server.
The service keeps no report database; payloads and validation files are processed in memory or temporary directories.
PDF and XLSX are labelled drafts. XBRL export requires a fresh Arelle schema, dimensional, presentation and calculation validation.
Technical validation is not a guarantee that the business register accepts an incomplete report.

## PDF Presentation

PDF is an actual downloadable file, not a screenshot or browser-print instruction.
It contains an Estonian cover, company name and registry code, reporting period, EUR and the declared precision of EUR 0.01, official statement headings, comparative dates, embedded Unicode fonts and page numbers.
Rows that are zero or unreported in both periods are omitted from the PDF; absent values are not silently converted into zero.
A4 and the chosen typography are presentation choices, not claimed statutory font or paper-size requirements.

Sources: the current [Raamatupidamise seadus](https://www.riigiteataja.ee/akt/125052012016?leiaKehtiv), especially sections 13-15, 18, 21-22 and 25; [RIK submission instructions](https://abiinfo.rik.ee/majandusaasta-aruannete-esitamine).
The report period is limited to 18 months; longer-than-normal periods still require the applicable legal justification.
The current comparison model assumes an existing enterprise, not the special first-report opening-balance rules in section 26.
A PDF copy does not replace structured reporting, approval or signing in e-ariregister.

## Production

A static-only deployment does not provide the Python endpoints.
Deploy the service behind an authenticated HTTPS reverse proxy with request limits; proxy `/api/annual-report/` on the same origin.
For a separate origin, set `window.ARVESEMU_ANNUAL_REPORT_API` before loading `annual-report.js` and explicitly configure `ANNUAL_REPORT_ALLOWED_ORIGINS` in the service environment.
The service intentionally binds only to loopback. Do not expose it directly as an unauthenticated public service.

## Rebuild The Official Catalogue

```sh
python3 tools/build-annual-taxonomy.py data/annual-report/et-gaap-2026.zip data/annual-report/taxonomy-2026.json
.annual-report-venv/bin/python tools/annual_report_server.py --write-profile data/annual-report/small-ou-2026.json
```

The service verifies the ZIP's SHA-256 against the catalogue. Keep the package, catalogue and profile together when deploying.