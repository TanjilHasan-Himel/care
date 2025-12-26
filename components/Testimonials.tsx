const testimonials = [
  {
    name: 'আমিনা রহমান',
    role: 'অভিভাবক, ঢাকা',
    quote:
      'সাপ্তাহিক ছুটিতে বেবিসিটার বুক করেছিলাম—দাম পরিষ্কার, কেয়ারগিভার ভেরিফাইড—পুরো প্রক্রিয়াটা খুবই ঝামেলাহীন ছিল।'
  },
  {
    name: 'ফরিদ আলম',
    role: 'পিতা-মাতার অভিভাবক, চট্টগ্রাম',
    quote:
      'কেয়ারগিভার ঠিক সময়ে এসেছে, খুব যত্নশীল ছিল, আর ওষুধের আপডেট নিয়মিত জানিয়েছে—বিশ্বাস করতে সুবিধা হয়েছে।'
  },
  {
    name: 'সাদিয়া করিম',
    role: 'রোগী সেবাদানকারী, সিলেট',
    quote:
      'লোকেশন আর ডিউরেশন নিজের মতো সেট করতে পারা—দারুণ। বুকিং কনফার্ম হলেই ইমেলে ইনভয়েস চলে আসে, ট্র্যাকিংও সহজ।'
  }
];

export function Testimonials() {
  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="badge">Testimonials</p>
          <h3 className="text-2xl font-semibold text-slate-900">What families say</h3>
        </div>
      </div>
      <div className="grid-auto-fit">
        {testimonials.map((t) => (
          <article key={t.name} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-slate-700">“{t.quote}”</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{t.name}</p>
            <p className="text-xs text-slate-500">{t.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
