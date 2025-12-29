import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Users, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            S
          </div>
          SalonPro
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition">Pricing</Link>
          <Link href="#about" className="hover:text-foreground transition">About</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/api/auth/signin">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-6 text-center space-y-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            v1.0 Now Available
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            The modern operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">elite salons</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Streamline appointments, manage staff, and retain customers with the all-in-one platform built for growth.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             <Link href="/dashboard">
              <Button size="lg" className="gap-2 h-12 px-8 text-base">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Book Demo
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/50 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-bold">Everything you need to run your business</h2>
              <p className="text-muted-foreground">Powerful features designed for modern salon workflows.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Calendar className="h-8 w-8 text-blue-500" />}
                title="Smart Booking"
                description="Drag-and-drop calendar with conflict detection and automated reminders."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-purple-500" />}
                title="Customer CRM"
                description="360° client profiles, history tracking, and loyalty tier management."
              />
              <FeatureCard 
                icon={<Scissors className="h-8 w-8 text-pink-500" />}
                title="Service Menu"
                description="Flexible service configuration with categories, add-ons, and variable pricing."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t px-6 bg-background text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 SalonPro Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
