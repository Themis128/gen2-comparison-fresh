export default function Home() {
  return (
    <div>
      <header role="banner">
        <nav>Navigation</nav>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Gen2 Comparison Fresh</h1>
        <p className="text-gray-600">Your new page starts here</p>
      </header>

      <main role="main">
        <section>
          <div className="max-w-4xl mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <section id="contact" aria-labelledby="contact-section">
                  <h2 id="contact-section">Contact Us</h2>
                  <form>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" />
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" />
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message"></textarea>
                    <button data-testid="contact-submit" type="submit">Submit</button>
                  </form>
                </section>
              </div>
              <div>
                {/* Additional content can go here */}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer role="contentinfo" className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Themistoklis Baltzakis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
