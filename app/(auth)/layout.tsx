import { BrandMark } from "@/components/layout/BrandMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border bg-surface px-4 py-3">
        <BrandMark href="/" />
      </header>
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <p className="border-t border-border px-4 py-3 text-center text-xs text-demo">
        NyayaSetu explains and organises information. It is not a lawyer and does not give legal
        advice.
      </p>
    </div>
  );
}
