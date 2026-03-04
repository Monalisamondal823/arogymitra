"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AIRadiologyReportAnalysisOutput, aiRadiologyReportAnalysis } from "@/ai/flows/ai-radiology-report-analysis";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bot, FileScan, ListChecks, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  radiologyReportText: z.string().min(1, "Radiology report text is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function ReportAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRadiologyReportAnalysisOutput | null>(null);
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      radiologyReportText: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const { id } = toast({
      title: "Analyzing Report...",
      description: "The AI is interpreting the radiology report.",
    });

    try {
      const response = await aiRadiologyReportAnalysis(values);
      setResult(response);
      dismiss(id);
      toast({
        title: "Analysis Complete",
        description: "Report analysis is ready for review.",
      });
    } catch (error) {
      console.error(error);
      dismiss(id);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze the report.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const sampleReport = `PATIENT: Smith, John
MRN: 12345678
DATE: 2023-10-27
EXAM: CT CHEST WITH CONTRAST
HISTORY: 55-year-old male with chronic cough.
FINDINGS:
Lungs: The lungs are clear. There is a 8mm nodule in the right lower lobe, stable from prior exam.
Mediastinum: No lymphadenopathy.
Pleura: No pleural effusion.
Incidental Findings: A 2.5 cm low-density lesion is seen in the liver, indeterminate.
IMPRESSION:
1. 8mm pulmonary nodule, stable.
2. Indeterminate 2.5 cm liver lesion. Recommend abdominal MRI for further characterization.`;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Radiology Report Input</CardTitle>
          <CardDescription>Paste the report text below to begin analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="radiologyReportText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full text of the radiology report here..."
                        rows={15}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileScan className="mr-2 h-4 w-4" />
                      Analyze Report
                    </>
                  )}
                </Button>
                <Button type="button" variant="secondary" onClick={() => form.setValue("radiologyReportText", sampleReport)}>
                  Load Sample
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">AI Analysis Results</h2>
        {isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px]">
                    <Bot className="h-16 w-16 mb-4 text-primary animate-pulse" />
                    <p className="text-lg font-semibold">AI is analyzing the report...</p>
                    <p className="text-muted-foreground">Extracting findings and recommendations.</p>
                </CardContent>
            </Card>
        )}
        {result ? (
          <div className="space-y-4">
            {result.incidentalFindingsDetected && (
              <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle />
                    Critical Follow-up Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300">
                    {result.followUpRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary"/>Structured Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Finding</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.structuredFindings.map((finding, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{finding.finding}</TableCell>
                        <TableCell>{finding.location}</TableCell>
                        <TableCell>
                           <Badge variant={finding.severity === 'critical' || finding.severity === 'severe' ? 'destructive' : 'secondary'}>
                            {finding.severity}
                           </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : !isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px] text-center">
                    <Bot className="h-16 w-16 mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">Awaiting Report</p>
                    <p className="text-muted-foreground">Paste a report to get structured AI analysis.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
