import CompoundCalculator from "@/components/CompoundCalculator";

const Index = () => {
  return (
    <main>
      <header className="py-12 md:py-16 gradient-hero">
        <div className="container text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Compound Interest Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Show clients clear, visual projections of their savings growth with contributions, compounding, and inflation adjustments.</p>
        </div>
      </header>
      <section className="container -mt-8 md:-mt-12 space-y-8 relative z-10">
        <CompoundCalculator />
      </section>
    </main>
  );
};

export default Index;
