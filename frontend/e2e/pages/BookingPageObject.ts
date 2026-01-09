import { Page, expect, Locator } from '@playwright/test';

/**
 * BookingPageObject
 * 
 * This class implements the Page Object Model (POM) pattern.
 * It encapsulates the logic for finding and interacting with elements
 * on the Booking Flow pages. This makes tests cleaner, reusable, and
 * easier to maintain.
 */
export class BookingPageObject {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the search page and selects a specific salon.
   */
  async searchAndSelectSalon(salonName: string) {
    await this.page.goto(`/search?search=${encodeURIComponent(salonName)}`);
    
    // Retry mechanism ensuring backend is awake and shop list is loaded
    await expect(async () => {
        await this.page.reload();
        await expect(this.page.getByRole('heading', { name: salonName, level: 3 })).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 60000 });

    await this.page.getByRole('heading', { name: salonName, level: 3 }).click();
    
    // Verify we landed on a salon page
    await expect(this.page).toHaveURL(new RegExp(`/salon/.*`));
    await expect(this.page.getByRole('heading', { name: salonName })).toBeVisible();
  }

  /**
   * Initiates the booking wizard from the Salon Details page.
   */
  async startBooking() {
    // There might be multiple book buttons (desktop/mobile), take the first visible one
    await this.page.getByRole('button', { name: /Book Now/i }).first().click();
    await expect(this.page).toHaveURL(/.*\/booking\?slug=.*/);
  }

  /**
   * Wizard Step 1: Select a service by name.
   */
  async selectService(serviceName: string) {
    await expect(this.page.getByText('Select Service')).toBeVisible();
    
    const serviceLocator = this.page.getByText(serviceName, { exact: false }).first();
    await expect(serviceLocator).toBeVisible();
    await serviceLocator.click();
    
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  /**
   * Wizard Step 2: Select a professional.
   * Logic: Selects the first available professional, or proceeds if logic implies 'Any'.
   */
  async selectProfessional() {
    await expect(this.page.getByText('Choose Professional')).toBeVisible();
    
    // Try to click the first "h4" which usually represents a staff name card
    // This is a naive selector - in production you might use test-ids e.g. data-testid="staff-card"
    const staffItem = this.page.locator('h4').first();
    if (await staffItem.isVisible()) {
        await staffItem.click();
    }
    
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  /**
   * Wizard Step 3: Select a time slot.
   * Logic: Selects the first available time slot.
   */
  async selectFirstAvailableTime() {
    await expect(this.page.getByText('Select time')).toBeVisible();
    
    // Select first button that looks like a time slot (usually contains :)
    const timeSlot = this.page.getByRole('button', { name: /:/ }).first();
    await expect(timeSlot).toBeVisible();
    await timeSlot.click();
    
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  /**
   * Wizard Step 4: Enter Guest Details (authenticated or guest)
   */
  async enterGuestDetails(name: string, phone: string, email: string = 'test@example.com') {
    await expect(this.page.getByText('Review and Confirm')).toBeVisible();
    
    await this.page.getByPlaceholder('John Doe').fill(name);
    await this.page.getByPlaceholder('+1 234 567 890').fill(phone);
    await this.page.getByPlaceholder('john@example.com').fill(email);
  }

  /**
   * Submits the booking.
   */
  async submitBooking() {
    await this.page.getByRole('button', { name: /Confirm Booking/i }).click();
  }

  /**
   * Verifies that the payment flow (Stripe) is presented.
   */
  async verifyPaymentStep() {
    try {
      await expect(this.page.getByText('Payment', { exact: true })).toBeVisible({ timeout: 15000 });
      // Check for ID typically assigned to Stripe wrapper or iframe container
      await expect(this.page.locator('#payment-element')).toBeVisible();
    } catch (e) {
      // Check for error message in the UI
      const styles = await this.page.locator('.text-red-500').count();
      if (styles > 0) {
        const errorMsg = await this.page.locator('.text-red-500').allTextContents();
        throw new Error(`Booking failed with error shown in UI: ${errorMsg.join(', ')}`);
      }
      throw e;
    }
  }
}
