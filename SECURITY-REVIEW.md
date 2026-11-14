# Security Review

Review date: 2026-11-14

## Finding summary

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🟠 HIGH | `backend/src/validatiors/user.validator.ts`, `frontend/schemas/profile.schema.ts`, `frontend/components/profile/profileHero.tsx` | 3-6, 31; 3-5, 19; 460-464 | Stored profile website accepts executable URL schemes and is rendered as a link | 9/10 |

## Details

### 1. Stored profile website can use an executable URL scheme

The backend and frontend profile schemas use Zod's `.url()` validation without restricting the URL protocol. This accepts values such as `javascript:...`. The profile page then renders the stored website directly as an anchor's `href`. An attacker who can update a profile can supply such a URL; if another user clicks the profile link, the browser may execute the URL as script in the page's origin.

The link uses `target="_blank"` and `rel="noopener noreferrer"`, which protect against opener access but do not validate or restrict the URL scheme.

**Recommendation:** Restrict profile website URLs to `http:` and `https:` in server-side validation, and apply the same restriction in the frontend form for clear feedback. Validate or normalize the value before rendering links as defense in depth, and consider handling already-stored values that use other schemes.

## Review scope and limitations

The review covered backend auth/session and wallet verification flow, backend request validation, frontend wallet verification flow, and user/profile URL rendering. Production deployment configuration, live wallet-provider behavior, and running database contents were not verified.
