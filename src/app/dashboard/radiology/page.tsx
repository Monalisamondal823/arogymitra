import { ReportAnalyzer } from "@/components/radiology/report-analyzer";

export default function RadiologyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">AI Radiology Report Analysis</h1>
        <p className="text-muted-foreground">
          Interpret free-text radiology reports to extract structured findings and recommendations.
        </p>
      </div>
      <ReportAnalyzer />
    </div>
  );
}
