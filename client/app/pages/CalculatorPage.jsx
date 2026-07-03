import { BadgeIndianRupee, Calculator, FileText, Home } from "lucide-react";
import { useMemo, useState } from "react";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import { formatCurrency } from "../utils/format.js";

const calculateEmi = ({ value, downPayment, rate, years }) => {
  const principal = Math.max(0, Number(value || 0) - Number(downPayment || 0));
  const months = Math.max(1, Number(years || 1) * 12);
  const monthlyRate = Number(rate || 0) / 1200;
  const emi = monthlyRate ? (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1) : principal / months;

  return {
    principal,
    emi,
    interest: emi * months - principal,
    total: emi * months
  };
};

const CalculatorPage = ({ type = "emi" }) => {
  const [form, setForm] = useState({
    value: "8500000",
    downPayment: "1500000",
    rate: "8.35",
    years: "20",
    stampRate: "7.5",
    registration: "50000"
  });
  const result = useMemo(() => calculateEmi(form), [form]);
  const stampDuty = useMemo(() => (Number(form.value || 0) * Number(form.stampRate || 0)) / 100 + Number(form.registration || 0), [form]);
  const isStamp = type === "stamp-duty";
  const title = isStamp ? "Stamp Duty Calculator" : type === "mortgage" ? "Mortgage Calculator" : "EMI Calculator";

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <>
      <Seo
        title={`${title} | ${COMPANY_INFO.name}`}
        description={`Plan your property purchase with the Sagar Infra ${title.toLowerCase()}.`}
        canonical={`${COMPANY_INFO.canonicalUrl}/${type === "emi" ? "emi-calculator" : `${type}-calculator`}`}
      />

      <section className="section-shell pt-8">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="glass-panel p-7 sm:p-9">
            <p className="section-kicker">Finance Lab</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.3rem)] font-semibold leading-[0.9] text-ink-900">
              {title}
            </h1>
            <p className="mt-5 text-sm leading-8 text-ink-500 sm:text-base">
              Estimate affordability before scheduling visits. These tools support premium buyers with quick planning for
              home loans, mortgage sizing, down payment, interest, tenure, registration, and stamp duty.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Loan planning", icon: Home },
                { label: "EMI clarity", icon: Calculator },
                { label: "Document cost", icon: FileText }
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-[#e5e7eb] bg-white p-4">
                  <item.icon size={17} className="text-gold-600" />
                  <p className="mt-3 text-sm font-semibold text-ink-900">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[#e5e7eb] bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.08)] sm:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Property Value</span>
                <input className="input-field" type="number" min="0" name="value" value={form.value} onChange={update} />
              </label>
              {!isStamp ? (
                <>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-ink-700">Down Payment</span>
                    <input className="input-field" type="number" min="0" name="downPayment" value={form.downPayment} onChange={update} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-ink-700">Interest Rate (%)</span>
                    <input className="input-field" type="number" min="0" step="0.01" name="rate" value={form.rate} onChange={update} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-ink-700">Tenure (Years)</span>
                    <input className="input-field" type="number" min="1" name="years" value={form.years} onChange={update} />
                  </label>
                </>
              ) : (
                <>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-ink-700">Stamp Duty Rate (%)</span>
                    <input className="input-field" type="number" min="0" step="0.1" name="stampRate" value={form.stampRate} onChange={update} />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-semibold text-ink-700">Registration / Other Charges</span>
                    <input className="input-field" type="number" min="0" name="registration" value={form.registration} onChange={update} />
                  </label>
                </>
              )}
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {(isStamp
                ? [
                    ["Estimated Stamp Duty + Registration", formatCurrency(stampDuty)],
                    ["Approx Total Purchase Cost", formatCurrency(Number(form.value || 0) + stampDuty)]
                  ]
                : [
                    ["Loan Principal", formatCurrency(result.principal)],
                    ["Monthly EMI", formatCurrency(result.emi)],
                    ["Total Interest", formatCurrency(result.interest)],
                    ["Total Repayment", formatCurrency(result.total)]
                  ]
              ).map(([label, value]) => (
                <div key={label} className="rounded-[26px] border border-[#e5e7eb] bg-[#f8f9fa] p-5">
                  <BadgeIndianRupee size={18} className="text-gold-600" />
                  <p className="mt-4 text-sm text-ink-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 rounded-[24px] border border-[#e5e7eb] bg-[#fafafa] p-4 text-sm leading-7 text-ink-500">
              Estimates are for planning only. Final loan, mortgage, duty, and registration amounts depend on lender,
              state rules, property type, buyer profile, and legal documentation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CalculatorPage;
