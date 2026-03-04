import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { Badge } from "../ui/badge";

export function RiskSummaryCard() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          High-Risk Patients
        </CardTitle>
        <CardDescription>
          AI-detected risks requiring immediate attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">patients flagged</p>
        <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="destructive">Sepsis Risk</Badge>
            <Badge variant="destructive">Cardiac Event</Badge>
            <Badge variant="destructive">Fall Risk</Badge>
        </div>
        <Button asChild size="sm" className="mt-6">
          <Link href="/dashboard/risk-alerts">
            View Alerts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
