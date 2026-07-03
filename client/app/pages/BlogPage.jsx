import { ArrowRight, Search, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import Seo from "../components/Seo.jsx";
import { enterpriseBlogs } from "../data/enterprisePages.js";
import { COMPANY_INFO } from "../data/siteContent.js";

const BlogPage = () => (
  <>
    <Seo
      title={`Real Estate Blog | ${COMPANY_INFO.name}`}
      description="Premium real estate articles on investment, legal checks, luxury homes, plots, builders, and buyer guidance."
      canonical={`${COMPANY_INFO.canonicalUrl}/blog`}
      image={`${COMPANY_INFO.canonicalUrl}/og-image.svg`}
      keywords={`real estate blog, property investment, legal checklist, ${COMPANY_INFO.metaKeywords}`}
    />

    <section className="section-shell pt-8">
      <div className="glass-panel p-7 sm:p-9">
        <p className="section-kicker">Editorial Desk</p>
        <div className="mt-4 grid gap-6 xl:grid-cols-[1fr_0.62fr]">
          <div>
            <h1 className="font-display text-[clamp(3.2rem,7vw,6.7rem)] font-semibold leading-[0.9] text-ink-900">
              Premium property intelligence for serious buyers.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-ink-500 sm:text-base">
              Guides, market notes, legal explainers, builder insights, investment thinking, and practical real estate
              decision frameworks from Sagar Infra.
            </p>
          </div>
          <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)]">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Search size={16} className="text-gold-600" />
              Search and categories
            </p>
            <div className="mt-4 grid gap-3">
              <input className="input-field" placeholder="Search investment, legal, villas..." />
              <div className="flex flex-wrap gap-2">
                {["Investment", "Buyer Guide", "Legal", "Luxury Homes", "Plots"].map((tag) => (
                  <span key={tag} className="search-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="section-shell pt-0">
      <div className="grid gap-6 lg:grid-cols-3">
        {enterpriseBlogs.map((post) => (
          <article key={post.slug} className="overflow-hidden rounded-[32px] border border-[#e5e7eb] bg-white shadow-[0_20px_58px_rgba(17,24,39,0.08)]">
            <ResponsiveImage
              src={post.image}
              alt={post.title}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
              sizes="(min-width: 1024px) 31vw, 100vw"
              widths={[480, 720, 960, 1280]}
            />
            <div className="p-6">
              <p className="section-kicker">{post.category}</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink-900">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-500">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="badge border-[#e5e7eb] bg-[#fafafa] text-ink-600">
                    <Tags size={12} className="text-gold-600" />
                    {tag}
                  </span>
                ))}
              </div>
              <Link to={`/blog/${post.slug}`} className="btn-primary mt-6 w-full">
                Read Article
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default BlogPage;
