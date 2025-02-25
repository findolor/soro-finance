import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-2">SoroFinance</h1>
          <h2 className="text-2xl mb-4">Smart Accounting & Payments for Stellar Projects</h2>
          <p className="text-lg mb-8 mx-auto max-w-2xl">
            A structured way to manage your project&apos;s finances, automate payments, and streamline SCF applications.
          </p>
          <div className="flex justify-center">
            <Link href="https://discord.gg/your-discord-link" target="_blank" rel="noopener noreferrer">
              <Button 
                text="Join the Community" 
                bgColor="#3E63DD" 
                className="text-white"
                size="lg"
              />
            </Link>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <p className="text-lg font-bold mb-2">✅ Budget Management & SCF Preparation</p>
              <p className="text-base">Plan structured budgets with milestone-based calculations.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <p className="text-lg font-bold mb-2">✅ Automated Payment Rules</p>
              <p className="text-base">Set up and execute payments with time-based triggers.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <p className="text-lg font-bold mb-2">✅ Token Swaps for Seamless Transactions</p>
              <p className="text-base">Pay in commonly used currencies found in DEXs.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <p className="text-lg font-bold mb-2">✅ Tranche-Based Funding & Expense Tracking</p>
              <p className="text-base">Ensure transparency and accountability for grant-based funding.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg text-center">
              <p className="text-lg font-bold mb-2">✅ Shareable Budget Breakdowns</p>
              <p className="text-base">Present clear funding plans for SCF and collaborations.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <p className="text-4xl mb-4">1️⃣</p>
              <p className="text-xl font-bold mb-2">Create Your Project</p>
              <p className="text-base">Define milestones, budgets, and funding needs.</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl mb-4">2️⃣</p>
              <p className="text-xl font-bold mb-2">Automate Payments & Track Finances</p>
              <p className="text-base">Set up payment rules and monitor expenses.</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl mb-4">3️⃣</p>
              <p className="text-xl font-bold mb-2">Stay SCF-Ready</p>
              <p className="text-base">Maintain transparency and accountability throughout your project.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Footer */}
        <section className="text-center pt-8 border-t border-gray-200">
          <p className="text-lg font-bold mb-6">🚀 Join us in building the future of Stellar project management.</p>
          <div className="mb-6 flex justify-center">
            <Link href="https://discord.gg/your-discord-link" target="_blank" rel="noopener noreferrer">
              <Button 
                text="Join the Community" 
                bgColor="#3E63DD" 
                className="text-white"
                size="lg"
              />
            </Link>
          </div>
          <p className="text-base mb-4">📩 Want to stay updated? Follow us on Twitter.</p>
          <div className="flex justify-center">
            <Link href="https://twitter.com/your-twitter-handle" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold">
              Twitter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
