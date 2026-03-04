import { HealthRiskForm } from "@/components/risk-alerts/health-risk-form";

export default function RiskAlertsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Health Risk Prediction</h1>
        <p className="text-muted-foreground">
          Proactively identify patients at high risk for adverse events or disease progression.
        </p>
      </div>
      <HealthRiskForm />
    </div>
  );
}
