import { fetchShopBySlug } from "@/lib/api-shops";
import { ServiceList, ServiceCategory } from "@/components/marketplace/service-list";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Share2, Heart, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SalonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data;

  try {
    data = await fetchShopBySlug(slug);
  } catch (error) {
    console.error("Error fetching shop for slug:", slug, error);
    return notFound();
  }

  const { shop, services, staff } = data;

  // Transform flat services to categories
  const categoriesMap = new Map<string, ServiceCategory>();
  
  services.forEach((s: any) => {
     const catName = s.category?.name || 'Other';
     const catId = s.category?.id || 'other';
     
     if (!categoriesMap.has(catId)) {
         categoriesMap.set(catId, { id: catId, name: catName, items: [] });
     }
     
     categoriesMap.get(catId)?.items.push({
         id: s.id,
         name: s.name,
         duration: s.duration, // backend is minutes
         price: Number(s.price),
         description: s.description,
     });
  });

  const categories = Array.from(categoriesMap.values());

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Gallery */}
      <div className="relative h-[40vh] md:h-[50vh] bg-muted group">
        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-1">
             {/* Use placeholder images for now since we don't have real ones in DB yet */}
             <div className="col-span-2 row-span-2 relative bg-gray-200 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Salon main" />
             </div>
             <div className="col-span-1 row-span-1 relative bg-gray-300 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Interior" />
             </div>
             <div className="col-span-1 row-span-1 relative bg-gray-300 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Tools" />
             </div>
             <div className="col-span-2 row-span-1 relative bg-gray-300 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Team" />
               <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 text-xs font-bold">Show all photos</Button>
             </div>
        </div>

        {/* Back Button (Absolute) */}
        <Link href="/search" className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 shadow-md bg-white/90 hover:bg-white"><ChevronLeft className="h-5 w-5" /></Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 grid md:grid-cols-[1fr_380px] gap-12 relative">
        {/* Main Content */}
        <div className="space-y-8">
            {/* Header Info */}
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{shop.name}</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="rounded-full"><Heart className="h-4 w-4" /></Button>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1 font-bold">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span>5.0</span>
                        <span className="text-muted-foreground font-normal">(New)</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{shop.street}, {shop.district}, {shop.city}</span>
                    </div>
                     <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                        <Clock className="h-4 w-4" />
                        <span>Open until {shop.businessHours?.[0]?.close || '18:00'}</span>
                    </div>
                </div>
            </div>

            {/* Menu Tabs */}
            <div className="border-b sticky top-0 bg-background z-40 flex gap-6 text-sm font-medium pt-2 scrollbar-hide overflow-x-auto">
                <a href="#services" className="pb-3 border-b-2 border-primary text-primary whitespace-nowrap">Services</a>
                <a href="#about" className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-muted-foreground whitespace-nowrap">About</a>
                <a href="#team" className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-muted-foreground whitespace-nowrap">Team</a>
                <a href="#reviews" className="pb-3 border-b-2 border-transparent hover:border-gray-300 text-muted-foreground whitespace-nowrap">Reviews</a>
            </div>

            {/* Services List */}
            <section id="services">
                <ServiceList categories={categories} />
            </section>

             {/* About Section */}
             <section id="about" className="pt-8 border-t">
                 <h2 className="text-2xl font-bold mb-4">About</h2>
                 <p className="text-muted-foreground leading-relaxed">
                     {shop.description || `Welcome to ${shop.name}, the premier destination for beauty and wellness in ${shop.city}. We offer a wide range of services to help you look and feel your best.`}
                 </p>
             </section>
        </div>

        {/* Sidebar (Desktop Sticky) */}
        <div className="hidden md:block">
            <div className="sticky top-24 bg-background border rounded-2xl shadow-lg p-6 space-y-6">
                <div className="text-center pb-4 border-b">
                     <p className="font-medium text-muted-foreground mb-1">Make an Appointment</p>
                     <p className="text-xs text-muted-foreground mt-1">Select services to proceed</p>
                </div>
                
                <Link href={`/booking?slug=${shop.slug}`}>
                    <Button size="lg" className="w-full text-lg h-12 font-bold">
                        Book Now
                    </Button>
                </Link>
                
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Opening Hours</span>
                        <span className="font-medium">{shop.businessHours?.[0]?.open} - {shop.businessHours?.[0]?.close}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium text-right max-w-[200px]">{shop.street}, {shop.district}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50">
          <Link href={`/booking?slug=${shop.slug}`}>
            <Button size="lg" className="w-full h-12 font-bold text-base shadow-lg">
                Book Now
            </Button>
          </Link>
      </div>
    </div>
  )
}
