import { ArrowLeft, MessageCircleMore, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage.jsx";
import Seo from "../components/Seo.jsx";
import { enterpriseBlogs } from "../data/enterprisePages.js";
import { COMPANY_INFO } from "../data/siteContent.js";
import { toWhatsAppHref } from "../utils/format.js";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const post = enterpriseBlogs.find((item) => item.slug === slug) || enterpriseBlogs[0];
  const relatedPosts = enterpriseBlogs.filter((item) => item.slug !== post.slug);

  return (
    <>
      <Seo
        title={`${post.title} | ${COMPANY_INFO.name}`}
        description={post.excerpt}
        canonical={`${COMPANY_INFO.canonicalUrl}/blog/${post.slug}`}
        image={post.image}
        keywords={`${post.tags.join(", ")}, ${COMPANY_INFO.metaKeywords}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: COMPANY_INFO.name }
        }}
      />

      <section className="section-shell pt-8">
        <Link to="/blog" className="btn-ghost mb-6 inline-flex">
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
        <article className="overflow-hidden rounded-[36px] border border-[#e5e7eb] bg-white shadow-[0_24px_70px_rgba(17,24,39,0.08)]">
          <ResponsiveImage src={post.image} alt={post.title} className="max-h-[34rem] w-full object-cover" widths={[720, 960, 1280, 1600]} />
          <div className="grid gap-8 p-6 sm:p-9 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <p className="section-kicker">{post.category}</p>
              <h1 className="mt-4 font-display text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.92] text-ink-900">
                {post.title}
              </h1>
              <p className="mt-4 text-sm text-ink-500">
                {post.author} · {post.date} · {post.readTime}
              </p>
              <div className="mt-8 space-y-6">
                {post.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-9 text-ink-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-[28px] border border-[#e5e7eb] bg-[#fafafa] p-5">
                <p className="section-kicker">Author</p>
                <p className="mt-3 text-xl font-semibold text-ink-900">{post.author}</p>
                <p className="mt-2 text-sm leading-7 text-ink-500">
                  Practical real estate research for premium buyers, investors, owners, and builder partners.
                </p>
              </div>
              <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)]">
                <p className="section-kicker">Newsletter</p>
                <p className="mt-3 text-xl font-semibold text-ink-900">Get premium market notes</p>
                <div className="mt-4 flex gap-2">
                  <input className="input-field" placeholder="Email address" />
                  <button className="btn-primary px-4" aria-label="Subscribe">
                    <Send size={16} />
                  </button>
                </div>
              </div>
              <a
                href={toWhatsAppHref(COMPANY_INFO.whatsappNumber, `Hi Sagar Infra, I read ${post.title} and want property guidance.`)}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircleMore size={16} />
                Discuss on WhatsApp
              </a>
            </aside>
          </div>
        </article>
      </section>

      <section className="section-shell pt-0">
        <p className="section-kicker">Related Articles</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {relatedPosts.map((item) => (
            <Link key={item.slug} to={`/blog/${item.slug}`} className="rounded-[28px] border border-[#e5e7eb] bg-white p-5 shadow-[0_18px_48px_rgba(17,24,39,0.06)] transition hover:-translate-y-1 hover:border-gold-300">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-700">{item.category}</p>
              <p className="mt-3 text-2xl font-semibold text-ink-900">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-ink-500">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogDetailPage;
