import { DiagnosticAssistantForm } from "@/components/diagnostics/diagnostic-assistant-form";

export default function DiagnosticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">AI Diagnostic Assistant</h1>
        <p className="text-muted-foreground">
          Integrate and analyze patient data for preliminary diagnostic insights.
        </p>
      </div>
      <DiagnosticAssistantForm />
    </div>
  );
}
