import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const currency = new Intl.NumberFormat('en-AU', { style: "currency", currency: "AUD" });

function monthlyRateFromNominal(annualPercent: number, frequencyPerYear: number) {
  const r = annualPercent / 100;
  const f = Math.max(1, frequencyPerYear);
  return Math.pow(1 + r / f, f / 12) - 1;
}

function clampNumber(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function CompoundCalculator() {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [yearsInput, setYearsInput] = useState("10");
  const [frequency, setFrequency] = useState("12");
  
  const [contribType, setContribType] = useState("monthly");
  const [customPerYear, setCustomPerYear] = useState(12);

  const { data, finalBalance, totalContrib, interestEarned } = useMemo(() => {
    const months = clampNumber(Math.round(years * 12), 1, 1200);
    const f = parseInt(frequency);
    const mRate = monthlyRateFromNominal(rate, f);
    const baseYear = new Date().getFullYear();

    // Normalize contribution to a monthly equivalent
    const baseAmount = monthly;
    const contribPerMonth =
      contribType === "weekly"
        ? baseAmount * (52 / 12)
        : contribType === "fortnightly"
        ? baseAmount * (26 / 12)
        : contribType === "custom"
        ? baseAmount * (customPerYear / 12)
        : baseAmount;

    let balance = initial;
    let contrib = initial;
    const series: { idx: number; label: string; balance: number; contribution: number }[] = [];

    for (let i = 1; i <= months; i++) {
      balance = balance * (1 + mRate) + contribPerMonth;
      contrib += contribPerMonth;
      const year = Math.ceil(i / 12);
      const month = ((i - 1) % 12) + 1;
      const label = month === 1 ? String(baseYear + year - 1) : "";
      series.push({ idx: i, label, balance, contribution: contrib });
    }

    const finalBalance = balance;
    const totalContrib = contrib;
    const interestEarned = finalBalance - totalContrib;

    return { data: series, finalBalance, totalContrib, interestEarned };
  }, [initial, monthly, rate, years, frequency, contribType, customPerYear]);

  return (
    <section aria-label="Compound interest calculator" className="space-y-8 mt-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="initial">Initial Contribution</Label>
            <Input
              id="initial"
              type="number"
              min={0}
              className="mt-2"
              value={initial}
              onChange={(e) => setInitial(Math.max(0, parseFloat(e.target.value || "0")))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly">Contribution Amount</Label>
            <Input
              id="monthly"
              type="number"
              min={0}
              className="mt-2"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, parseFloat(e.target.value || "0")))}
            />
          </div>
          <div className="space-y-2">
            <Label>Contribution Frequency</Label>
            <Select value={contribType} onValueChange={setContribType}>
              <SelectTrigger>
                <SelectValue placeholder="Select contribution frequency" />
              </SelectTrigger>
            <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="fortnightly">Fortnightly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {contribType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="perYear">Contributions per year</Label>
              <Input
                id="perYear"
                type="number"
                min={1}
                className="mt-2"
                value={customPerYear}
                onChange={(e) => setCustomPerYear(Math.max(1, parseFloat(e.target.value || "1")))}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              min={0}
              step={0.1}
              className="mt-2"
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value || "0")))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Years</Label>
            <Input
              id="years"
              type="number"
              min={1}
              max={100}
              step={0.1}
              className="mt-2"
              value={yearsInput}
              onChange={(e) => {
                const v = e.target.value;
                // Allow empty, partial decimals, up to 3 digits before decimal
                if (v === "" || /^\d{0,3}(?:\.?\d*)?$/.test(v)) {
                  setYearsInput(v);
                  const num = parseFloat(v);
                  if (!isNaN(num)) {
                    setYears(clampNumber(num, 1, 100));
                  }
                }
              }}
              onBlur={() => {
                const num = clampNumber(parseFloat(yearsInput || ""), 1, 100);
                if (isNaN(num)) {
                  setYears(1);
                  setYearsInput("1");
                } else {
                  setYears(num);
                  setYearsInput(String(num));
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semiannually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="365">Daily (approx)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button
              className="px-6 bg-blue-700/40 backdrop-blur-md border border-blue-600/60 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800/50 transition-all duration-300"
            >
              Recalculate
            </Button>
            <Button variant="outline" onClick={() => {
              setInitial(10000); setMonthly(500); setRate(7); setYears(10); setYearsInput("10"); setFrequency("12");
            }}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Final Balance!</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{currency.format(finalBalance)}</CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Total Contribution</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{currency.format(totalContrib)}</CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Interest Earned</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{currency.format(interestEarned)}</CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`hsl(var(--sidebar-ring))`} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={`hsl(var(--sidebar-ring))`} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`hsl(var(--muted-foreground))`} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={`hsl(var(--muted-foreground))`} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval={11}
                  tick={{ fontSize: 12, fill: "#9fb0c6" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9fb0c6" }}
                  tickFormatter={(v) =>
                    currency.format(v).replace("$", "").replace(/\.00$/, "")
                  }
                  width={100}
                />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  formatter={(value: any, name: any) => [currency.format(value as number), name === "balance" ? "Balance" : "Contrib."]}
                />
                <Area type="monotone" dataKey="contribution" stroke={`hsl(var(--muted-foreground))`} fillOpacity={1} fill="url(#contribGrad)" />
                <Area type="monotone" dataKey="balance" stroke={`hsl(var(--sidebar-ring))`} strokeWidth={2} fillOpacity={1} fill="url(#balanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How is compound interest calculated?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We model monthly growth using an effective monthly rate derived from your nominal annual rate and compounding frequency, adding contributions each month."
                }
              }
            ]
          })
        }}
      />
    </section>
  );
}
