import { expect, test, type Page } from '@playwright/test';

/**
 * The contact form's state model. Every request is stubbed at the network boundary, so no Worker,
 * no Turnstile secret and no mail provider is involved.
 *
 * The challenge host is aborted on purpose: the widget's own behaviour is covered by
 * `network.spec.ts`, and letting a third-party CDN decide whether these tests run would make the
 * suite report an outage as a regression. With the script blocked, `ensureWidget()` fails fast and
 * `awaitToken()` returns immediately — which is also how a blocked CDN behaves in production.
 */

const FILLED = {
  name: 'Ana Ruiz',
  email: 'ana@example.com',
  organization: 'ACME SL',
  serviceType: 'iot',
  message: 'Necesito ayuda con EPREL.',
};

async function fillForm(page: Page): Promise<void> {
  await page.locator('#contact-name').fill(FILLED.name);
  await page.locator('#contact-email').fill(FILLED.email);
  await page.locator('#contact-organization').fill(FILLED.organization);
  await page.locator('#contact-serviceType').selectOption(FILLED.serviceType);
  await page.locator('#contact-message').fill(FILLED.message);
}

/** Answers every submission with `status`, counting the calls. */
async function stubSubmit(
  page: Page,
  status: number,
  delayMs = 0,
): Promise<{ calls: () => number }> {
  let calls = 0;
  await page.route('**/api/contact', async (route) => {
    calls += 1;
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: '{"error":"stub"}',
    });
  });
  return { calls: () => calls };
}

test.beforeEach(async ({ page }) => {
  await page.route('**/challenges.cloudflare.com/**', (route) => route.abort());
});

test('an empty submit moves focus to the summary and lists every field', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('button[data-submit]').click();

  const status = page.locator('[data-form-status]');
  await expect(status).toBeVisible();
  await expect(status).toHaveAttribute('role', 'alert');
  await expect(status.locator('[data-status-title]')).toHaveText(/5/);
  await expect(status.locator('[data-status-list] li a')).toHaveCount(5);
  await expect(status).toBeFocused();

  const invalid = page.locator('form [aria-invalid="true"]');
  await expect(invalid).toHaveCount(5);
});

test('a summary link moves focus to its field', async ({ page }) => {
  await page.goto('/');
  await page.locator('button[data-submit]').click();

  await page.locator('[data-status-list] li a').nth(1).click();
  await expect(page.locator('#contact-email')).toBeFocused();
});

test('fixing one field clears its message and lowers the count', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('button[data-submit]').click();
  await expect(page.locator('[data-status-title]')).toHaveText(/5/);

  await page.locator('#contact-name').fill(FILLED.name);
  await page.locator('#contact-email').click();

  await expect(page.locator('[data-status-title]')).toHaveText(/4/);
  await expect(page.locator('#contact-name-error')).toBeEmpty();
  await expect(page.locator('#contact-name')).not.toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

for (const [status, text] of [
  [429, /too many attempts/i],
  [403, /verification check/i],
  [502, /could not be delivered/i],
] as const) {
  test(`a ${status} renders its own message with a mailto link`, async ({
    page,
  }) => {
    const stub = await stubSubmit(page, status);
    await page.goto('/');
    await fillForm(page);
    await page.locator('button[data-submit]').click();

    const status_ = page.locator('[data-form-status]');
    await expect(status_.locator('[data-status-title]')).toHaveText(text);
    await expect(
      status_.locator('[data-status-recovery] a[href^="mailto:"]'),
    ).toHaveCount(1);
    await expect(status_).toBeFocused();
    expect(stub.calls()).toBe(1);
  });
}

test('the busy state keeps focus and blocks a second request', async ({
  page,
}) => {
  const stub = await stubSubmit(page, 502, 400);
  await page.goto('/');
  await fillForm(page);

  const submit = page.locator('button[data-submit]');
  await submit.click();
  await expect(submit).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('form[data-contact-form]')).toHaveAttribute(
    'aria-busy',
    'true',
  );
  await expect(submit).toBeFocused();

  // A second activation while the first is in flight must not reach the network.
  await page.evaluate(() => {
    document
      .querySelector<HTMLFormElement>('form[data-contact-form]')
      ?.requestSubmit();
  });
  await expect(submit).toHaveAttribute('aria-disabled', 'false', {
    timeout: 10_000,
  });
  expect(stub.calls()).toBe(1);
});

test('entered values survive a failure', async ({ page }) => {
  await stubSubmit(page, 502);
  await page.goto('/');
  await fillForm(page);
  await page.locator('button[data-submit]').click();
  await expect(page.locator('[data-status-title]')).toBeVisible();

  await expect(page.locator('#contact-name')).toHaveValue(FILLED.name);
  await expect(page.locator('#contact-email')).toHaveValue(FILLED.email);
  await expect(page.locator('#contact-message')).toHaveValue(FILLED.message);
  await expect(page.locator('#contact-message')).toHaveValue(FILLED.message);
});

test('a multi-line message is accepted', async ({ page }) => {
  const stub = await stubSubmit(page, 502);
  await page.goto('/');
  await fillForm(page);
  await page.locator('#contact-message').fill('Primera línea\nSegunda línea');
  await page.locator('button[data-submit]').click();

  await expect(page.locator('[data-status-title]')).toBeVisible();
  await expect(page.locator('#contact-message')).not.toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(stub.calls()).toBe(1);
});
