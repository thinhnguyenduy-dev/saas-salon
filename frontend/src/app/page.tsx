import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/marketplace/search-bar";
import { CategoryCarousel } from "@/components/marketplace/category-carousel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Marketplace Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur z-50">
        <Link href="/" className="font-bold text-2xl tracking-tight text-primary">
          BeautyBook
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground">
            For Business
          </Link>
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Button>Sign Up</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative py-20 px-6 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Book local beauty <br className="hidden md:block"/> and wellness services
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Find the best salons, spas and barbers near you and book instantly.
            </p>
            
            <div className="translate-y-4">
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-xl font-bold mb-6">Browse by Category</h2>
          <CategoryCarousel />
        </section>

        {/* Recommended Section (Static for now) */}
        <section className="py-12 px-6 max-w-7xl mx-auto w-full bg-muted/30 rounded-3xl mb-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recommended Near You</h2>
              <p className="text-muted-foreground">Top rated venues based on your location</p>
            </div>
            <Button variant="link" className="text-primary font-bold">See all</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group bg-background rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all cursor-pointer">
                <div className="aspect-[4/3] bg-muted relative">
                  {/* Placeholder Image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-100">
                    Venue Image
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                    ⭐ 4.9 (120)
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Luxe Hair Salon</h3>
                  <p className="text-sm text-muted-foreground">1.2km • District 1, HCMC</p>
                  <div className="flex gap-2 pt-2">
                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">Haircut</span>
                    <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">Color</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
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
