import { BarChart3, Bell, CalendarCheck, FileText, Heart, MessageSquareMore, WalletCards } from "lucide-react";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const dashboardConfig = {
  buyer: {
    title: "Buyer Dashboard",
    description: "Saved properties, visits, alerts, comparisons, documents, and messages for premium buyers.",
    cards: ["Saved Properties", "Recently Viewed", "Property Alerts", "Visit Appointments", "Documents", "Messages"]
  },
  owner: {
    title: "Owner Dashboard",
    description: "Manage owner listings, leads, documents, site visits, payments, and property management tasks.",
    cards: ["Listings", "Leads", "Documents", "Payments", "Visit Requests", "Reports"]
  },
  dealer: {
    title: "Dealer Dashboard",
    description: "A verified expert workspace for listings, leads, analytics, team follow-ups, and service revenue.",
    cards: ["Inventory", "Lead Pipeline", "Analytics", "Messages", "Subscriptions", "Reports"]
  },
  user: {
    title: "User Dashboard",
    description: "Your personal Sagar Infra command center for property discovery, preferences, and support.",
    cards: ["Profile", "Saved", "Alerts", "Messages", "Documents", "Support"]
  }
};

const icons = [Heart, CalendarCheck, Bell, MessageSquareMore, FileText, WalletCards, BarChart3];

const RoleDashboardPage = ({ role = "user" }) => {
  const config = dashboardConfig[role] || dashboardConfig.user;

  return (
    <>
      <Seo title={`${config.title} | ${COMPANY_INFO.name}`} description={config.description} canonical={`${COMPANY_INFO.canonicalUrl}/${role}-dashboard`} robots="noindex, nofollow" />
      <section className="section-shell pt-8">
        <div className="glass-panel p-7 sm:p-9">
          <p className="section-kicker">Dashboard</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.9] text-ink-900">
            {config.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">{config.description}</p>
        </div>
      </section>
      <section className="section-shell pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {config.cards.map((card, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={card} className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_58px_rgba(17,24,39,0.07)]">
                <Icon size={19} className="text-gold-600" />
                <p className="mt-4 text-2xl font-semibold text-ink-900">{card}</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Production-ready workspace panel prepared for API-backed activity, permissions, notifications, and reporting.
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default RoleDashboardPage;
