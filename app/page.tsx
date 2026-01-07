import About from '@/components/About';
import Achievements from '@/components/Achievements';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import { ContactMessagesManager } from '@/components/ContactMessages';
import Experience from '@/components/Experience';
import Hero from '@/components/Hero';
import { TodoManager } from '@/components/TodoManager';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import { personalData } from '@/lib/personal-data';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero data={personalData} />
      <About data={personalData} />
      <Skills data={personalData} />
      <Projects data={personalData} />
      <Experience data={personalData} />
      <Certifications data={personalData} />
      <Achievements data={personalData} />
      <Contact data={personalData} />

      {/* Portfolio Management Tools */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Portfolio Management</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <ContactMessagesManager />
            <TodoManager />
          </div>
        </div>
      </section>
    </main>
  );
}
