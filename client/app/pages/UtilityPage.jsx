import { ArrowRight, Clock, Heart, KeyRound, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";

const utilityConfig = {
  "forgot-password": {
    title: "Forgot Password",
    kicker: "Account Recovery",
    description: "Request a secure password reset link for your Sagar Infra account.",
    icon: KeyRound,
    action: "Send Reset Link"
  },
  "recently-viewed": {
    title: "Recently Viewed",
    kicker: "Buyer Memory",
    description: "A premium browsing history surface for properties you inspected recently on this device.",
    icon: Clock,
    action: "Explore Properties"
  },
  "compare-property": {
    title: "Compare Property",
    kicker: "Family Shortlist",
    description: "Compare price, area, location, amenities, investment score, and trust signals before calling.",
    icon: RotateCcw,
    action: "Open Marketplace"
  },
  "saved-property": {
    title: "Saved Property",
    kicker: "Wishlist",
    description: "Your saved premium properties, alerts, family shortlist, and visit-ready opportunities.",
    icon: Heart,
    action: "View Properties"
  },
  "404": {
    title: "Page Not Found",
    kicker: "404",
    description: "This address does not exist yet. Return to the premium property marketplace or contact Sagar Infra.",
    icon: RotateCcw,
    action: "Back Home"
  }
};

const UtilityPage = ({ type = "404" }) => {
  const config = utilityConfig[type] || utilityConfig["404"];
  const Icon = config.icon;
  const isForgot = type === "forgot-password";

  return (
    <>
      <Seo title={`${config.title} | ${COMPANY_INFO.name}`} description={config.description} canonical={`${COMPANY_INFO.canonicalUrl}/${type}`} robots={type === "404" ? "noindex, follow" : "index, follow"} />
      <section className="section-shell">
        <div className="mx-auto max-w-3xl rounded-[36px] border border-[#e5e7eb] bg-white p-7 text-center shadow-[0_24px_70px_rgba(17,24,39,0.08)] sm:p-10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f7ecd7] text-gold-700">
            <Icon size={26} />
          </span>
          <p className="section-kicker mt-6">{config.kicker}</p>
          <h1 className="mt-3 font-display text-[clamp(3rem,7vw,5.6rem)] font-semibold leading-[0.9] text-ink-900">
            {config.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-ink-500 sm:text-base">{config.description}</p>

          {isForgot ? (
            <form className="mx-auto mt-7 grid max-w-xl gap-3 sm:grid-cols-[1fr_auto]" onSubmit={(event) => event.preventDefault()}>
              <input className="input-field" type="email" placeholder="Enter your email address" aria-label="Email address" />
              <button className="btn-primary">
                {config.action}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <Link to={type === "404" ? "/" : "/properties"} className="btn-primary mt-7">
              {config.action}
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default UtilityPage;
