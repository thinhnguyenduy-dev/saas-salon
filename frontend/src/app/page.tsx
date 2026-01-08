import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/home/hero-search";
import { Logo } from "@/components/ui/logo";
import { CategoryCarousel } from "@/components/marketplace/category-carousel";
import { RecommendedSection } from "@/components/marketplace/recommended-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Marketplace Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <Link href="/" className="flex items-center gap-2">
           <Logo className="h-6 w-auto text-primary" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-700 hover:text-black">
            Log in
          </Link>
          <Link href="/dashboard">
             <Button variant="outline" className="rounded-full border-gray-300 hover:bg-gray-50 h-10 px-6 font-semibold">
                List your business
             </Button>
          </Link>
          <Button variant="outline" className="rounded-full border-gray-300 hover:bg-gray-50 h-10 px-6 font-semibold bg-white">
            Menu
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        {/* Hero Section with Search */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[600px] flex flex-col justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
               <img 
                   src="https://loremflickr.com/1600/900/haircut,salon" 
                   alt="Haircut Background" 
                   className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-black/40" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
              Book local selfcare services
            </h1>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto font-medium drop-shadow-sm">
              Discover top-rated salons, barbers, medspas, wellness studios and beauty experts trusted by millions worldwide
            </p>
            
            <div className="pt-8 w-full flex justify-center">
              <HeroSearch />
            </div>

            <p className="pt-8 text-sm font-medium text-white/90 drop-shadow-sm">
                <span className="font-bold text-white">227,917</span> appointments booked today
            </p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Browse by Category</h2>
          <CategoryCarousel />
        </section>

        {/* Recommended Section (Dynamic) */}
        <RecommendedSection />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h4 className="font-bold text-lg">BeautyBook</h4>
            <p className="text-sm text-muted-foreground">The best way to book beauty and wellness services online.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Near me</Link></li>
              <li><Link href="#">Top Rated</Link></li>
              <li><Link href="#">Categories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Partners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard">For Business</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024 BeautyBook Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
