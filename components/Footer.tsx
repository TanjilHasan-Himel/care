export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-surface py-12">
      <div className="container flex flex-col gap-10">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="space-y-3">
            <p className="text-xl font-semibold text-white">Care.xyz</p>
            <p className="text-sm text-slate-300">
              Trusted care for children, elderly, and special needs. Book verified caregivers with transparent pricing.
            </p>
            <div className="flex gap-4 text-slate-300">
              <a href="#" aria-label="Facebook" className="hover:text-white">Fb</a>
              <a href="#" aria-label="Twitter" className="hover:text-white">X</a>
              <a href="#" aria-label="Instagram" className="hover:text-white">Ig</a>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Stay in touch</p>
            <p className="text-sm text-slate-300">Get tips and updates:</p>
            <form className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input className="input flex-1 bg-white/90 placeholder:text-slate-400" placeholder="Your email" type="email" />
              <button type="button" className="btn-primary w-full sm:w-auto">Subscribe</button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:justify-items-end">
            <div>
              <p className="text-sm font-semibold text-white">Explore</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li><a href="/service/babysitting" className="hover:text-white">Babysitting</a></li>
                <li><a href="/service/elderly-care" className="hover:text-white">Elderly Care</a></li>
                <li><a href="/service/nursing" className="hover:text-white">Nursing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Support</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li><a href="#trust" className="hover:text-white">Why Care.xyz</a></li>
                <li><a href="/my-bookings" className="hover:text-white">My Bookings</a></li>
                <li><a href="/register" className="hover:text-white">Create Account</a></li>
                <li><a href="/login" className="hover:text-white">Sign In</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-xs text-slate-300 text-center">
          © {year} Care.xyz. All rights reserved. · <a href="#" className="hover:text-white">Privacy</a> · <a href="#" className="hover:text-white">Terms</a> · <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
