import CompoundCalculator from "@/components/CompoundCalculator";

const Index = () => {
  return (
    <main>
      <header className="py-2 md:py-4 gradient-hero">
        <div className="container">
          <div className="flex items-center gap-4 mb-6">
            <a href="/" className="flex items-center gap-3 focus:outline-none focus:ring-0">
              <img src="/snowballdarkmode.png" alt="Company logo" className="h-22 w-20 mt-7 rounded-xl shadow-glow" loading="lazy" />
              <span className="sr-only">Home</span>
            </a>
            <div className="flex-1 text-center">
              <h1 className="text-5xl md:text-5xl font-bold mt-6">Snowball Compound Interest Calculator</h1>
            </div>
          </div>
          <div className="text-center space-y-2 -mt-4 relative z-50">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">This is what your money can become.</p>
            <p className="text-xl max-w-2xl mx-auto text-slate-300">
              A = P(1 + r/n)<sup>nt</sup>
            </p>
          </div>
        </div>
      </header>
      <section className="container -mt-2 md:-mt-4 space-y-8 relative z-10">
        <CompoundCalculator />
      </section>
    </main>
  );
};

export default Index;
