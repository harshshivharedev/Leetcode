import { Link } from "react-router";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <Navbar />
      <main>
        <HeroSection />

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#d97706]">What you can do</p>
              <h2 className="text-3xl font-bold text-gray-900">Everything you need to improve</h2>
            </div>
            <Link className="hidden text-sm font-semibold text-[#d97706] sm:block" to="/problems">View problems →</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-xl">⌘</div>
              <h3 className="text-lg font-semibold text-gray-900">Curated problems</h3>
              <p className="mt-2 leading-7 text-gray-600">Solve problems across arrays, strings, trees, graphs, and more.</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-xl">↗</div>
              <h3 className="text-lg font-semibold text-gray-900">Track progress</h3>
              <p className="mt-2 leading-7 text-gray-600">Review submissions and understand how your problem-solving improves.</p>
            </article>
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-xl">✓</div>
              <h3 className="text-lg font-semibold text-gray-900">Instant feedback</h3>
              <p className="mt-2 leading-7 text-gray-600">Submit your code and get results with runtime and memory details.</p>
            </article>
          </div>
        </section>

        <section className="border-y border-gray-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ready to sharpen your skills?</h2>
              <p className="mt-2 text-gray-600">Start with one problem today.</p>
            </div>
            <Link className="btn border-0 bg-[#ffa116] px-7 text-white hover:bg-[#e89000]" to="/problems">Explore problems</Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 px-4 py-8 text-center text-sm text-gray-400">
        © 2026 CodeArena. Keep learning, keep coding.
      </footer>
    </div>
  );
}

export default HomePage
