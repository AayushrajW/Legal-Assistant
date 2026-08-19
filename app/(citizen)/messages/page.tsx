import { Badge, Card } from "@/components/ui/Display";
import { Calendar, CreditCard, FileText, FolderOpen, Paperclip, Phone, Send, Video } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col px-4 py-6">
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-bold text-navy">Adv. Kavita Sharma</p>
            <p className="text-xs text-success">Sample layout · not online</p>
          </div>
          <div className="flex gap-1 text-demo">
            <Phone className="size-5" aria-hidden />
            <Video className="size-5" aria-hidden />
          </div>
        </div>
        <div className="space-y-3 bg-bg px-4 py-4">
          <Badge tone="demo">Preview chat — nothing is sent</Badge>
          <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-surface px-3 py-2 text-sm text-ink shadow-sm">
            Sample message: please share the notice dates when you are ready.
          </p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-navy px-3 py-2 text-sm text-white">
            Sample reply: I uploaded the rent notice in My Cases.
          </p>
        </div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <Paperclip className="size-4 text-demo" aria-hidden />
            <input
              disabled
              className="min-h-11 flex-1 rounded-2xl border border-border bg-bg px-3 text-sm"
              placeholder="Messaging is not live yet"
            />
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-white">
              <Send className="size-4" aria-hidden />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-demo">
            <span className="flex flex-col items-center gap-1">
              <FolderOpen className="size-5" aria-hidden />
              Case details
            </span>
            <span className="flex flex-col items-center gap-1">
              <FileText className="size-5" aria-hidden />
              Documents
            </span>
            <span className="flex flex-col items-center gap-1">
              <Calendar className="size-5" aria-hidden />
              Schedule
            </span>
            <span className="flex flex-col items-center gap-1">
              <CreditCard className="size-5" aria-hidden />
              Payments
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
