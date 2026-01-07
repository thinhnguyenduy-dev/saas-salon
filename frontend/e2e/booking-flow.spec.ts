import { test, expect } from '@playwright/test';

test.describe('Booking Flow (Integration)', () => {
  
  test('User can find "Beautiful Salon" and make a booking', async ({ page }) => {
    test.setTimeout(120000);
    // 1. Go to Search Page with query to find the specific seeded salon
    await page.goto('/search?search=Beautiful Salon');

    // 2. Select the Salon
    // Wait for the card to appear. Retry reload if backend is warming up.
    await expect(async () => {
        await page.reload();
        // Target the specific shop card heading/link
        await expect(page.getByRole('heading', { name: 'Beautiful Salon', level: 3 })).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 60000 }); // Wait up to 60s for backend to start
    
    // Click the card (or the link within it)
    await page.getByRole('heading', { name: 'Beautiful Salon', level: 3 }).click();

    // 3. Verify Salon Details Page
    await expect(page).toHaveURL(/.*\/salon\/beautiful-salon/);
    await expect(page.getByRole('heading', { name: 'Beautiful Salon' })).toBeVisible();

    // 4. Click "Book Now" to enter Wizard
    // There are two "Book Now" buttons (desktop sidebar, mobile bottom).
    // Let's click the first visible one.
    await page.getByRole('button', { name: /Book Now/i }).first().click();

    // 5. Booking Wizard - Step 1: Select Service
    // Wait for Wizard to load
    await expect(page).toHaveURL(/.*\/booking\?slug=beautiful-salon/);
    
    // In Wizard, find and select Haircut.
    await expect(page.getByText('Haircut', { exact: false })).toBeVisible();
    await page.getByText('Haircut', { exact: false }).first().click();
    
    // Click Continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // 6. Booking Wizard - Step 2: Select Staff
    await expect(page.getByText('Choose Professional')).toBeVisible();
    
    // Select 'Any Staff' implies skipping selection or selecting a specific option "Any Professional"
    // If StepStaff list has items, click one.
    // If we assume seeded data has NO staff (as suspected), then what?
    // If no staff, StepStaff might show empty?
    // Let's assume we can pick "Any Professional" if implemented, or just pick the first available if any.
    // Or if checking seeded data, there might be NO staff seeded for "Beautiful Salon" in `seed.ts`?
    // I need to check if lack of staff blocks flow.
    // If seed.ts didn't add staff to shop, `StepStaff` might be empty.
    // Let's click "Continue" if it's visible (meaning optional?) or select first item if available.
    // Actually, `BookingService` `create` requires `staffId` unless `Any` logic handles it.
    // Let's try to click the first staff card if exists, or Continue.
    
    // Debug: Check if there are staff cards.
    // const staffCards = page.locator('.p-4'); // Generic
    
    // Let's just try to click "Continue" first. 
    // If validation prevents it, we fail.
    // If we need to select staff, let's try selecting the first visible one.
    const staffItem = page.locator('h4').first();
    if (await staffItem.isVisible()) {
        await staffItem.click();
    }
    
    await page.getByRole('button', { name: 'Continue' }).click();

    // 7. Booking Wizard - Step 3: Select Time
    await expect(page.getByText('Select time')).toBeVisible();
    
    // Select a date (today/tomorrow)
    // Assuming react-day-picker. Click a valid day.
    // By default today/tomorrow might be selected or we pick one.
    // Then select a time slot.
    await page.getByRole('button', { name: /:/ }).first().click(); // Click first available time slot e.g. "09:00"
    
    await page.getByRole('button', { name: 'Continue' }).click();

    // 8. Booking Wizard - Step 4: Checkout
    await expect(page.getByText('Review and Confirm')).toBeVisible();
    
    await page.getByPlaceholder(/Name/i).fill('Playwright Guest');
    await page.getByPlaceholder(/Phone/i).fill('555-0199');
    
    await page.getByRole('button', { name: /Confirm Booking/i }).click();

    // 9. Verify Success
    await expect(page.getByText(/Booking Confirmed/i)).toBeVisible({ timeout: 10000 });
    
  });
});
