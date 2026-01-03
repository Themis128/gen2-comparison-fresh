import CustomNavigation from '@/components/CustomNavigation';

export default function CustomNavigationDemo() {
  return (
    <div className="min-h-screen bg-background">
      <CustomNavigation />

      <main className="pt-20">
        <section
          id="hero"
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Welcome Home
            </h1>
            <p className="text-xl text-muted-foreground">
              Custom Navigation Demo - Scroll to see effects
            </p>
          </div>
        </section>

        <section
          id="about"
          className="min-h-screen flex items-center justify-center bg-background"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              About Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn more about our story
            </p>
          </div>
        </section>

        <section
          id="skills"
          className="min-h-screen flex items-center justify-center bg-muted/30"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Skills
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our expertise
            </p>
          </div>
        </section>

        <section
          id="experience"
          className="min-h-screen flex items-center justify-center bg-background"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              Check out our work history
            </p>
          </div>
        </section>

        <section
          id="projects"
          className="min-h-screen flex items-center justify-center bg-muted/30"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              See our latest projects
            </p>
          </div>
        </section>

        <section
          id="ai-generator"
          className="min-h-screen flex items-center justify-center bg-background"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              AI Generator
            </h2>
            <p className="text-lg text-muted-foreground">
              Try our AI-powered tools
            </p>
          </div>
        </section>

        <section
          id="contact"
          className="min-h-screen flex items-center justify-center bg-muted/30"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Contact Us
            </h2>
            <p className="text-lg text-muted-foreground">
              Get in touch with our team
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
