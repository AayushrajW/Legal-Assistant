import { APP_NAME } from "@/lib/constants";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { FileSearch, ListChecks, MessageCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main id="main">
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              For people, not law firms
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Understand a legal paper before you panic.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/85">
              {APP_NAME} helps you read notices, contracts, and confusing situations in everyday
              language. You still decide what to do. A qualified advocate still gives legal advice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center rounded-xl bg-accent px-5 font-semibold text-white"
              >
                Start with a demo case
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex min-h-12 items-center rounded-xl border border-border px-5 font-semibold text-navy"
              >
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-sm text-demo">
              This prototype uses sample files. It does not file cases or contact courts.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-extrabold text-navy">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: FileSearch,
              title: "Read the paper",
              body: "Upload a notice or describe what happened. We organise it into short sections.",
            },
            {
              icon: ListChecks,
              title: "See risks and dates",
              body: "Deadlines, duties, and missing information are listed so nothing hides in a paragraph.",
            },
            {
              icon: MessageCircle,
              title: "Ask about this file",
              body: "The assistant stays on your case. Every answer is labelled as a demo in this version.",
            },
            {
              icon: Shield,
              title: "Stay in control",
              body: "No “you will win”. No pretending to be your lawyer. Official help links stay visible.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <item.icon className="size-6 text-accent" aria-hidden />
              <h3 className="mt-3 font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-extrabold text-navy">Trust, and limits</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-bold text-navy">What {APP_NAME} is</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/85">
                <li>A reading and organising tool for ordinary citizens in India.</li>
                <li>A place to prepare questions and a paper checklist.</li>
                <li>A preview of how you might later find an advocate.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-navy">What it is not</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/85">
                <li>Not an advocate, law firm, or court filing service.</li>
                <li>Not a guarantee of any outcome.</li>
                <li>Not live legal research in this prototype — sample analyses are labelled Demo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-extrabold text-navy">Made for first-time users</h2>
        <p className="mt-3 max-w-2xl text-ink/85">
          Large buttons, short sentences, and details hidden until you ask. Works on a phone,
          because that is how most people will open a notice.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-accent px-5 font-semibold text-white"
        >
          Open the citizen demo
        </Link>
      </section>
    </main>
  );
}
