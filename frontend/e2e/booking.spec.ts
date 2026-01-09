import { test } from '@playwright/test';
import { BookingPageObject } from './pages/BookingPageObject';

test.describe('Standardized Booking Flow', () => {

  test('Guest user can book a Haircut at Beautiful Salon', async ({ page }) => {
    // Enable console log capture for debugging
    page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
    
    // Increase timeout for cold starts (dev mode)
    test.setTimeout(120000);

    const bookingPage = new BookingPageObject(page);

    await test.step('Navigate and Select Salon', async () => {
      await bookingPage.searchAndSelectSalon('Beautiful Salon');
    });

    await test.step('Start Booking Wizard', async () => {
      await bookingPage.startBooking();
    });

    await test.step('Select Service', async () => {
      await bookingPage.selectService('Haircut');
    });

    await test.step('Select Professional', async () => {
      await bookingPage.selectProfessional();
    });

    await test.step('Select Time', async () => {
      await bookingPage.selectFirstAvailableTime();
    });

    await test.step('Enter Guest Details', async () => {
      await bookingPage.enterGuestDetails('Standard Test User', '555-1234');
    });

    await test.step('Confirm Booking', async () => {
      await bookingPage.submitBooking();
    });

    await test.step('Verify Payment Screen', async () => {
      await bookingPage.verifyPaymentStep();
    });
  });

});
