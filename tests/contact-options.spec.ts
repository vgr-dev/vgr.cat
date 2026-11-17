import { expect, test } from '@playwright/test';
import { ca } from '../src/i18n/ca';
import { en } from '../src/i18n/en';
import { es } from '../src/i18n/es';
import { SERVICE_TYPES } from '../src/worker/index';

/**
 * The contact form's focus options exist in four places that cannot see each other: the three
 * dictionaries (`contact.form.serviceTypes`) and the Worker's accepted-key map. A key missing from
 * any one of them either hides an option from visitors or makes the Worker reject a value the form
 * offers, and the browser E2E suite stubs `/api/contact`, so it would not notice.
 *
 * The Worker's map is imported, not copied: a duplicated test-only list could pass while the real
 * one drifts.
 */

/** The approved keys, in the order the select must offer them. */
const EXPECTED_KEYS = [
  'build',
  'modernize',
  'platform',
  'energy',
  'audit',
  'other',
];

const DICTIONARIES = [
  { locale: 'en', path: '/', serviceTypes: en.contact.form.serviceTypes },
  { locale: 'ca', path: '/ca/', serviceTypes: ca.contact.form.serviceTypes },
  { locale: 'es', path: '/es/', serviceTypes: es.contact.form.serviceTypes },
] as const;

/** What `actual` lacks and what it has beyond `expected`, order ignored. */
function diffKeys(
  expected: readonly string[],
  actual: readonly string[],
): { missing: string[]; extra: string[] } {
  return {
    missing: expected.filter((key) => !actual.includes(key)),
    extra: actual.filter((key) => !expected.includes(key)),
  };
}

test('the key comparison reports a missing and an extra key', () => {
  expect(diffKeys(['a', 'b'], ['a'])).toEqual({ missing: ['b'], extra: [] });
  expect(diffKeys(['a'], ['a', 'z'])).toEqual({ missing: [], extra: ['z'] });
  expect(diffKeys(['a', 'b'], ['b', 'a'])).toEqual({ missing: [], extra: [] });
});

test('the Worker accepts exactly the approved focus keys', () => {
  expect(diffKeys(EXPECTED_KEYS, Object.keys(SERVICE_TYPES))).toEqual({
    missing: [],
    extra: [],
  });
});

for (const { locale, serviceTypes } of DICTIONARIES) {
  test(`the ${locale} dictionary has the Worker's keys, in the approved order`, () => {
    const keys = Object.keys(serviceTypes);
    expect(diffKeys(Object.keys(SERVICE_TYPES), keys)).toEqual({
      missing: [],
      extra: [],
    });
    expect(keys).toEqual(EXPECTED_KEYS);
  });
}

test('the notification labels are the approved English option labels', () => {
  expect(SERVICE_TYPES).toEqual(en.contact.form.serviceTypes);
});

for (const { locale, path, serviceTypes } of DICTIONARIES) {
  test(`the ${locale} home page offers every focus option and nothing else`, async ({
    page,
  }) => {
    await page.goto(path);
    const select = page.locator('#contact-serviceType');
    const options = select.locator('option:not([disabled])');

    const rendered = await options.evaluateAll((nodes) =>
      nodes.map((node) => ({
        value: (node as HTMLOptionElement).value,
        label: node.textContent?.trim() ?? '',
      })),
    );
    const expected = Object.entries(serviceTypes).map(([value, label]) => ({
      value,
      label,
    }));
    // The placeholder carries an empty value; only real choices are compared.
    expect(rendered.filter((option) => option.value !== '')).toEqual(expected);

    for (const key of EXPECTED_KEYS) {
      await select.selectOption(key);
      await expect(select).toHaveValue(key);
    }
  });
}
