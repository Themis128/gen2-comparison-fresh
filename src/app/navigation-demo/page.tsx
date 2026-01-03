import React from 'react';
import ModernNavigation from '@/components/ModernNavigation';

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-background">
      <ModernNavigation
        logo="TBaltzakis"
        navItems={[
          { label: 'Home', href: '#home' },
          { label: 'About', href: '#about' },
          {
            label: 'Services',
            href: '#services',
            children: [
              { label: 'Web Development', href: '#web-dev' },
              { label: 'Mobile Apps', href: '#mobile' },
              { label: 'Consulting', href: '#consulting' },
            ],
          },
          { label: 'Portfolio', href: '#portfolio' },
          { label: 'Contact', href: '#contact' },
        ]}
        ctaText="Get Started"
      />
      <main className="pt-16">
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">Welcome Home</h1>
            <p className="text-xl text-muted-foreground">Scroll to see the navigation effects</p>
          </div>
        </section>
        <section id="about" className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">About Us</h2>
            <p className="text-lg text-muted-foreground">Learn more about our story</p>
          </div>
        </section>
        <section id="services" className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground">Discover what we can do for you</p>
          </div>
        </section>
        <section id="portfolio" className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Portfolio</h2>
            <p className="text-lg text-muted-foreground">Check out our latest work</p>
          </div>
        </section>
        <section id="contact" className="min-h-screen flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Contact Us</h2>
            <p className="text-lg text-muted-foreground">Get in touch with our team</p>
          </div>
        </section>
      </main>
    </div>
  );
}