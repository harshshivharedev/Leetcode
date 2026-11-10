

import { Link } from "react-router";

function HeroSection() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-[#d97706]">
            <span className="h-2 w-2 rounded-full bg-[#ffa116]" />
            Learn. Practice. Improve.
          </div>

          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build your coding skills, one problem at a time.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Practice hand-picked coding problems, track your progress, and prepare
            for your next technical interview with CodeArena.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn border-0 bg-[#ffa116] px-6 text-white hover:bg-[#e89000]" to="/problems">
              Start solving
            </Link>
            <Link className="btn btn-outline px-6" to="/signup">
              Create free account
            </Link>
          </div>

          <div className="mt-10 flex gap-8 text-sm text-gray-500">
            <span><strong className="text-xl text-gray-900">100+</strong><br />Problems</span>
            <span><strong className="text-xl text-gray-900">3</strong><br />Difficulty levels</span>
            <span><strong className="text-xl text-gray-900">24/7</strong><br />Practice</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-4 rounded-3xl bg-orange-100 blur-2xl" />
          <div className="relative rounded-2xl border border-gray-200 bg-gray-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-800 pb-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-500">two-sum.js</span>
            </div>
            <pre className="overflow-x-auto text-sm leading-7 text-gray-300"><code><span className="text-purple-400">function</span> <span className="text-blue-300">twoSum</span>(nums, target) {'{'}{"\n"}  <span className="text-purple-400">const</span> seen = <span className="text-yellow-300">new</span> Map();{"\n"}{"\n"}  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; nums.length; i++) {'{'}{"\n"}    <span className="text-purple-400">const</span> complement = target - nums[i];{"\n"}    <span className="text-purple-400">if</span> (seen.has(complement)) {'{'}{"\n"}      <span className="text-purple-400">return</span> [seen.get(complement), i];{"\n"}    {'}'}{"\n"}    seen.set(nums[i], i);{"\n"}  {'}'}{"\n"}{'}'}</code></pre>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-900 px-4 py-3 text-sm">
              <span className="text-gray-400">Accepted</span>
              <span className="font-semibold text-green-400">✓ Runtime: 42 ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
