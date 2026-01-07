import { fetchShops, Shop } from "@/lib/api-shops";
import { ShopCard } from "@/components/marketplace/shop-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function RecommendedSection() {
  let shops: Shop[] = [];
  try {
      const result = await fetchShops({ limit: 4 });
      shops = result.docs.map(s => ({
          ...s,
          image: s.image || "https://placehold.co/600x400?text=Salon",
          rating: s.rating || 5.0, // Should come from API if implemented
          reviewCount: s.reviewCount || 0,
          category: "Full Service", // Or derived from services
      }));
  } catch (error) {
      console.error("Failed to fetch recommended shops:", error);
  }

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto w-full mb-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {shops.map((shop) => (
           <ShopCard key={shop.id} {...shop} address={`${shop.street}, ${shop.district}, ${shop.city}`} />
        ))}
        {shops.length === 0 && <p>No recommendations available.</p>}
      </div>
    </section>
  );
}
