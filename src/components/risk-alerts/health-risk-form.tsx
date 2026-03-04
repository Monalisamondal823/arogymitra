"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HealthRiskAlertsOutput, predictHealthRisk } from "@/ai/flows/ai-health-risk-alerts";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bot, HeartPulse, Loader2, ShieldCheck, Siren, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required."),
  age: z.coerce.number().min(0, "Age must be a positive number."),
  gender: z.enum(['Male', 'Female', 'Other']),
  medicalHistorySummary: z.string().min(1, "Medical history is required."),
  labResultsSummary: z.string().min(1, "Lab results summary is required."),
  socialDeterminants: z.string().optional(),
  heartRate: z.coerce.number().optional(),
  bloodPressureSystolic: z.coerce.number().optional(),
  bloodPressureDiastolic: z.coerce.number().optional(),
  temperature: z.coerce.number().optional(),
  oxygenSaturation: z.coerce.number().optional(),
  bloodSugar: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function HealthRiskForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthRiskAlertsOutput | null>(null);
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "PID-98765",
      age: 68,
      gender: "Male",
      medicalHistorySummary: "History of Type 2 Diabetes, hypertension, and a previous MI 5 years ago. Family history of coronary artery disease.",
      labResultsSummary: "High cholesterol (LDL 160 mg/dL), elevated A1C (7.8%).",
      socialDeterminants: "Lives alone, limited mobility.",
      heartRate: 95,
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 90,
      oxygenSaturation: 94,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const { id } = toast({
      title: "Predicting Health Risk...",
      description: "The AI is analyzing the patient's data profile.",
    });

    try {
      const response = await predictHealthRisk({
        patientId: values.patientId,
        age: values.age,
        gender: values.gender,
        medicalHistorySummary: values.medicalHistorySummary,
        labResultsSummary: values.labResultsSummary,
        socialDeterminants: values.socialDeterminants,
        currentVitals: {
          heartRate: values.heartRate,
          bloodPressureSystolic: values.bloodPressureSystolic,
          bloodPressureDiastolic: values.bloodPressureDiastolic,
          temperature: values.temperature,
          oxygenSaturation: values.oxygenSaturation,
          bloodSugar: values.bloodSugar,
        },
      });
      setResult(response);
      dismiss(id);
      toast({
        title: "Prediction Complete",
        description: "Health risk profile is ready for review.",
      });
    } catch (error) {
      console.error(error);
      dismiss(id);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to predict health risk.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Patient Health Data</CardTitle>
          <CardDescription>Enter patient data to assess health risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="patientId" render={({ field }) => ( <FormItem><FormLabel>Patient ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="age" render={({ field }) => ( <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
              </div>
               <FormField control={form.control} name="medicalHistorySummary" render={({ field }) => ( <FormItem><FormLabel>Medical History</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="labResultsSummary" render={({ field }) => ( <FormItem><FormLabel>Lab Results Summary</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem> )} />
               <h3 className="text-sm font-medium pt-2">Current Vitals (Optional)</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="heartRate" render={({ field }) => ( <FormItem><FormLabel>Heart Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="bloodPressureSystolic" render={({ field }) => ( <FormItem><FormLabel>Systolic BP</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem> )} />
                    <FormField control={form.control} name="oxygenSaturation" render={({ field }) => ( <FormItem><FormLabel>O2 Saturation</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem> )} />
                </div>
              <Button type="submit" disabled={isLoading} className="mt-4">
                {isLoading ? ( <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assessing...</> ) : ( <><HeartPulse className="mr-2 h-4 w-4" /> Assess Risk</> )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">AI Risk Profile</h2>
        {isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px]">
                    <Bot className="h-16 w-16 mb-4 text-primary animate-pulse" />
                    <p className="text-lg font-semibold">AI is calculating risk...</p>
                    <p className="text-muted-foreground">Please wait.</p>
                </CardContent>
            </Card>
        )}
        {result ? (
          <Card className={result.highRisk ? "border-destructive bg-destructive/5" : "border-green-500 bg-green-500/5"}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${result.highRisk ? "text-destructive" : "text-green-600"}`}>
                {result.highRisk ? <Siren /> : <ShieldCheck />}
                {result.highRisk ? "High Risk Alert" : "Low Risk Profile"}
              </CardTitle>
              <CardDescription>{result.riskDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{result.riskScore} / 100</span>
                    </div>
                    <Progress value={result.riskScore} className={result.highRisk ? "[&>div]:bg-destructive" : "[&>div]:bg-green-500"} />
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><Activity/>Predicted Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                        {result.predictedConditions.map((cond, i) => <Badge key={i} variant={result.highRisk ? "destructive" : "secondary"}>{cond}</Badge>)}
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2"><AlertTriangle/>Recommended Interventions</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        {result.recommendedInterventions.map((int, i) => <li key={i}>{int}</li>)}
                    </ul>
                </div>
            </CardContent>
          </Card>
        ) : !isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px] text-center">
                    <Bot className="h-16 w-16 mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">Awaiting Patient Data</p>
                    <p className="text-muted-foreground">Fill out the form to generate a risk profile.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
