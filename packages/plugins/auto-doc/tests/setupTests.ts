import { beforeAll, afterAll, test, expect } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';

declare global {
  var browser: Browser;
  var context: BrowserContext;
  var page: Page;
}

beforeAll(async () => {
  globalThis.browser = await chromium.launch();
  globalThis.context = await browser.newContext();
  globalThis.page = await context.newPage();
});

afterAll(async () => {
  await globalThis.page.close();
  await globalThis.context.close();
  await globalThis.browser.close();
});

test('sample test', async () => {
  await page.setContent('<html><head><title>Example Domain</title></head><body></body></html>');
  const title = await page.title();
  expect(title).toBe('Example Domain');
});