import { useState } from "react";
import { reportApi, reviewApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

const ReviewsSection = ({ propertyId, reviews, refresh }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [report, setReport] = useState({ reason: "Fake Listing", details: "" });

  const submitReview = async (e) => {
    e.preventDefault();
    await reviewApi.submit(propertyId, form);
    setForm({ rating: 5, comment: "" });
    refresh();
  };

  const reportProperty = async (e) => {
    e.preventDefault();
    await reportApi.create(propertyId, report);
    setReport({ reason: "Fake Listing", details: "" });
    alert("Report submitted");
  };

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h3 className="text-lg font-bold">Reviews</h3>
        <div className="mt-3 space-y-3">
          {reviews.map((item) => (
            <div key={item._id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold">{item.user?.name || "User"} - {item.rating}/5</p>
              <p className="text-sm text-slate-700">{item.comment}</p>
              <button className="mt-1 text-xs text-brand-600" onClick={() => reviewApi.helpful(item._id).then(refresh)}>Helpful ({item.helpfulCount})</button>
            </div>
          ))}
          {!reviews.length && <p className="text-sm text-slate-600">No reviews yet.</p>}
        </div>
      </div>

      <div className="space-y-4">
        <form className="card space-y-3" onSubmit={submitReview}>
          <h3 className="text-lg font-bold">Add Review</h3>
          <select className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star</option>)}
          </select>
          <textarea className="input min-h-24" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button disabled={!user} className="btn-primary disabled:cursor-not-allowed disabled:opacity-50">Submit Review</button>
        </form>

        <form className="card space-y-3" onSubmit={reportProperty}>
          <h3 className="text-lg font-bold">Report Property</h3>
          <select className="input" value={report.reason} onChange={(e) => setReport({ ...report, reason: e.target.value })}>
            <option>Fake Listing</option><option>Sold</option><option>Wrong Info</option><option>Scam</option><option>Other</option>
          </select>
          <textarea className="input min-h-20" placeholder="Details" value={report.details} onChange={(e) => setReport({ ...report, details: e.target.value })} />
          <button disabled={!user} className="btn-outline disabled:cursor-not-allowed disabled:opacity-50">Report</button>
        </form>
      </div>
    </section>
  );
};

export default ReviewsSection;
