/**
 * The contact form's rules, shared by `src/worker/index.ts` and the browser script so the two
 * cannot drift apart silently — that drift is what produced UX-006 (a browser-valid address being
 * refused with a generic message).
 *
 * This module holds rules only, never copy. The Worker still answers with exactly the
 * `{"error": "…"}` bodies it always has (plan D-3), and the client maps `response.status` to
 * localised sentences, so nothing here may assume a UI.
 */

/** Longest value accepted for any field, the multi-line message included. */
export const MAX_FIELD_LENGTH = 2000;

/** RFC 5321's practical cap for a whole address. */
export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_LOCAL_MAX_LENGTH = 64;

export const CRLF_RE = /[\r\n]/;

/**
 * Pragmatic RFC 5322 dot-atom form. It rejects quotes, angle brackets, commas, parentheses and
 * control characters in the local part, because the address is handed to the mail provider as a
 * structured recipient and must never be able to widen into a list. Accepted trade-off: punycode
 * TLDs are rejected.
 */
const EMAIL_LOCAL =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const EMAIL_DOMAIN =
  /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

/** Length caps plus a dot-atom local part and a label-validated domain. */
export function isValidEmail(value: string): boolean {
  if (value.length === 0 || value.length > EMAIL_MAX_LENGTH) return false;
  const at = value.lastIndexOf('@');
  if (at <= 0 || at === value.length - 1) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  return (
    local.length <= EMAIL_LOCAL_MAX_LENGTH &&
    EMAIL_LOCAL.test(local) &&
    EMAIL_DOMAIN.test(domain)
  );
}

export type ContactFieldName =
  'name' | 'email' | 'organization' | 'serviceType' | 'message';

export type FieldErrorCode =
  'required' | 'lineBreak' | 'tooLong' | 'emailFormat';

export interface FieldError {
  field: ContactFieldName;
  code: FieldErrorCode;
}

export type ContactValues = Record<ContactFieldName, string>;

export type TextFieldProblem = 'required' | 'lineBreak' | 'tooLong';

/**
 * The rule for a single-line field. CRLF anywhere near a header is email header injection, not a
 * validation nit, so it is a hard rejection rather than a sanitisation step. A value is acceptable
 * when this returns `null`.
 */
export function singleLineProblem(value: string): TextFieldProblem | null {
  if (value.length === 0) return 'required';
  if (value.length > MAX_FIELD_LENGTH) return 'tooLong';
  if (CRLF_RE.test(value)) return 'lineBreak';
  return null;
}

/**
 * The rule for the `message`: the same length and emptiness checks, but line breaks are allowed.
 * The message only ever becomes the body of the notification — it never touches a header — so
 * rejecting CRLF here refused every multi-line project description the textarea invited.
 */
export function messageProblem(value: string): TextFieldProblem | null {
  if (value.length === 0) return 'required';
  if (value.length > MAX_FIELD_LENGTH) return 'tooLong';
  return null;
}

/**
 * The client's mirror of the Worker's field checks, returned in form order so the error summary
 * reads top-down. `serviceType` is checked for presence only: the select can only offer keys the
 * Worker already accepts, and membership stays a server-side decision.
 */
export function validateContact(values: ContactValues): FieldError[] {
  const errors: FieldError[] = [];

  const name = singleLineProblem(values.name.trim());
  if (name) errors.push({ field: 'name', code: name });

  const email = values.email.trim();
  if (email.length === 0) {
    errors.push({ field: 'email', code: 'required' });
  } else if (email.length > EMAIL_MAX_LENGTH) {
    errors.push({ field: 'email', code: 'tooLong' });
  } else if (CRLF_RE.test(email)) {
    errors.push({ field: 'email', code: 'lineBreak' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', code: 'emailFormat' });
  }

  const organization = singleLineProblem(values.organization.trim());
  if (organization) errors.push({ field: 'organization', code: organization });

  if (values.serviceType.trim().length === 0) {
    errors.push({ field: 'serviceType', code: 'required' });
  }

  const message = messageProblem(values.message.trim());
  if (message) errors.push({ field: 'message', code: message });

  return errors;
}
