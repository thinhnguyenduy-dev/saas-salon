import BookingWizard from "@/components/marketplace/booking/booking-wizard";
import { fetchShopBySlug } from "@/lib/api-shops";
import apiClient from "@/lib/api-client";
import { notFound } from "next/navigation";

// Since we need to fetch shop data but identify it by ID. 
// Wait, usually bookings are done per shop. URL should probably correspond to shop.
// Current URL: /booking?shopId=...
// I need to fetch shop by ID. `fetchShopBySlug` works by slug. `api-shops` might need `fetchShopById`. 
// For now, I'll fetch by ID using direct API call or add helper.

async function fetchShopById(id: string) {
    try {
        // Backend doesn't have public findById explicitly in ShopsController, only findAll and findOnePublic (slug).
        // However, I can generic find. Or I relies on slug.
        // It's better to use slug in URL: /salon/[slug]/book.
        // BUT, the requirement "Booking Flow" (Phase 3) didn't specify URL structure strictly.
        // Current button goes to `/booking?shopId=...`
        // Let's try to fetch via ID.
        // If API doesn't support public ID fetch, I might need to use findAll with filter or add endpoint.
        // ShopsController has: `findAll(@Query() query)` -> `findAllPublic`. 
        // I can filter by ID there? Not explicitly implemented (only search, lat/lng).
        
        // Quick Fix: Use direct DB access? No, I am frontend.
        // Better: Change URL to `/salon/[slug]/book`? 
        // Or add public getById to backend.
        
        // Let's check `ShopsService.findAllPublic`. It returns `docs`.
        // I'll cheat and assume I can invoke `findAllPublic` with specific criteria if I modified backend, 
        // OR simply implement `findByIdPublic` in backend quickly.
        
        // Actually, for now, let's assumpt the user enters via `/salon/[slug]` -> "Book Now".
        // I can pass the slug in query param: `/booking?slug=...` instead of ID.
        // Check `SalonDetailPage`: `<Link href={/booking?shopId=${shop.id}}>`.
        // I should change that to use `slug`.
        
        // Let's Assume I can fetch by ID. 
        // Wait, I can use `findAll`? No.
        
        // OK, I will update `SalonDetailPage` to pass `slug` instead of `id`.
        // Then I can use `fetchShopBySlug`.
        return null;
    } catch (e) {
        return null;
    }
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const shopId = params.shopId as string;
  const slug = params.slug as string;

  let shop;
  
  if (slug) {
      const data = await fetchShopBySlug(slug);
      shop = data.shop;
      // We also need services and staff.
      // fetchShopBySlug returns { shop, services, staff }
      // So `data` contains everything.
      shop = { ...data.shop, services: data.services, staff: data.staff };
  } else if (shopId) {
      // Fallback or Error if ID not supported
      // I'll update logic to require SLUG.
      return (
          <div className="p-10 text-center">
              Please use the Book button from the Salon page.
          </div>
      )
  }

  if (!shop) {
      return notFound();
  }

  return <BookingWizard shop={shop} />;
}
