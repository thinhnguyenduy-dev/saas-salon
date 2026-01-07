import { FilterBar } from "@/components/marketplace/filter-bar";
import { ShopCard } from "@/components/marketplace/shop-card";
import { MapView } from "@/components/marketplace/map-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchShops } from "@/lib/api-shops";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { category, search, lat, lng, sort, price } = params;
  
  // Prepare query for API
  const query: any = {
      limit: 20,
      search: typeof search === 'string' ? search : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      price: typeof price === 'string' ? price : undefined,
  };

  if (typeof category === 'string') {
    query.category = category; // Note: Backend needs to support filter by Category Name or ID.
  }

  if (lat && lng) {
      query.lat = lat;
      query.lng = lng;
  }

  // Fetch real data
  let shopsData;
  try {
      shopsData = await fetchShops(query);
  } catch (error) {
      console.error("Failed to fetch shops", error);
      shopsData = { docs: [], totalDocs: 0 };
  }

  const shops = shopsData.docs.map(shop => ({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      image: shop.image || "https://placehold.co/600x400?text=Salon",
      rating: shop.rating || 5.0, // Default to 5.0 (New)
      reviewCount: shop.reviewCount || 0,
      address: `${shop.street}, ${shop.district}, ${shop.city}`,
      category: "Full Service", // We need to update backend to return categories or main category
  }));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
       {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b shrink-0 z-20 bg-background">
        <Link href="/" className="font-bold text-2xl tracking-tight text-primary mr-8">
          BeautyBook
        </Link>
        <div className="flex-1 max-w-2xl hidden md:block">
            <div className="scale-90 origin-left">
                <div className="flex items-center border rounded-full px-4 py-2 bg-muted/30 text-sm text-muted-foreground w-full cursor-pointer hover:bg-muted/50 transition">
                    <span className="font-medium text-foreground">{typeof search === 'string' ? search : 'Any Treatment'}</span>
                    <span className="mx-2">•</span>
                    <span>Current Location</span>
                    <span className="mx-2">•</span>
                    <span>Any Date</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Button size="sm">Sign Up</Button>
        </div>
      </header>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: List View */}
        <div className="w-full lg:w-[60%] xl:w-[55%] flex flex-col h-full border-r overflow-hidden relative z-10 bg-background shadow-xl lg:shadow-none">
            {/* Filters */}
            <div className="px-6 py-4 border-b shrink-0">
                <FilterBar />
                <div className="mt-4 flex items-center justify-between">
                    <h1 className="font-bold text-lg">{shopsData.totalDocs} results found {typeof search === 'string' && `for "${search}"`}</h1>
                    <span className="text-sm text-muted-foreground">Sorted by: Recommended</span>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-6">
                {shops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                        {shops.map(shop => (
                            <ShopCard key={shop.id} {...shop} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        No shops found matching your criteria.
                    </div>
                )}
            </div>
        </div>

        {/* Right: Map View (Hidden on mobile for now, or toggled) */}
        <div className="hidden lg:block flex-1 bg-slate-100 relative h-full">
            <MapView />
        </div>
      </div>
      
      {/* Mobile Map Toggle (Floating) */}
      <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
           <Button className="rounded-full shadow-xl px-6 h-12 gap-2">
               Map View
           </Button>
      </div>
    </div>
  )
}
