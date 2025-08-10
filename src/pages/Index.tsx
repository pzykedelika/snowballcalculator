import CompoundCalculator from "@/components/CompoundCalculator";

const Index = () => {
  return (
    <main>
      <header className="py-8 md:py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
            <a href="/" className="flex items-center gap-3 self-start">
              <img src="/lovable-uploads/1f6463bf-2fce-4417-87f5-aef3f47b0fbd.png" alt="Company logo" className="h-9 w-9 rounded-xl shadow-glow" loading="lazy" />
              <span className="sr-only">Home</span>
            </a>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">Snowball Compound Interest Calculator</h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">This is what your money can become.</p>
              <p className="text-lg text-slate-400">A = P(1 + r/n)<sup>n·t</sup></p>
            </div>
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
