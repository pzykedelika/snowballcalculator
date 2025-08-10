import CompoundCalculator from "@/components/CompoundCalculator";

const Index = () => {
  return (
    <main>
      <header className="py-12 md:py-16 gradient-hero">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <a href="/" className="flex items-center gap-3">
              <img src="/lovable-uploads/1f6463bf-2fce-4417-87f5-aef3f47b0fbd.png" alt="Company logo" className="h-9 w-9 rounded-xl shadow-glow" loading="lazy" />
              <span className="sr-only">Home</span>
            </a>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Snowball Compound Interest Calculator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">This is what your money can become.</p>
          </div>
        </div>
      </header>
      <section className="container -mt-8 md:-mt-12 space-y-8 relative z-10">
        <CompoundCalculator />
      </section>
    </main>
  );
};

export default Index;
