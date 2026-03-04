"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { AIDiagnosticInsightOutput, aiDiagnosticInsight } from "@/ai/flows/ai-diagnostic-insight";
import { PlaceHolderImages } from "@/lib/placeholder-images";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bot, BrainCircuit, Lightbulb, Loader2, Microscope, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  patientHistory: z.string().min(1, "Patient history is required."),
  labResults: z.string().optional(),
  imagingFile: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DiagnosticAssistantForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIDiagnosticInsightOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientHistory: "",
      labResults: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("imagingFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const { id } = toast({
      title: "Analyzing Patient Data...",
      description: "The AI assistant is processing the information.",
    });

    try {
      let imagingDataUri: string | undefined = undefined;
      if (values.imagingFile) {
        imagingDataUri = await fileToBase64(values.imagingFile);
      }

      const response = await aiDiagnosticInsight({
        patientHistory: values.patientHistory,
        labResults: values.labResults,
        imagingDataUri,
      });

      setResult(response);
      dismiss(id);
      toast({
        title: "Analysis Complete",
        description: "Diagnostic insights are ready for review.",
      });
    } catch (error) {
      console.error(error);
      dismiss(id);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get diagnostic insights.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const xrayImage = PlaceHolderImages.find((img) => img.id === 'xray-chest');

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Patient Data Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient History & Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 58 y/o male with a history of hypertension, presents with chest pain..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="labResults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Results</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Troponin: 0.5 ng/mL, CBC: WNL, BMP: K+ 3.2..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imagingFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imaging File (X-ray, MRI, etc.)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </FormControl>
                    <FormDescription>
                      Optional. Upload an imaging file for analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {preview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <Image
                    src={preview}
                    alt="Imaging preview"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                   <BrainCircuit className="mr-2 h-4 w-4" />
                    Get AI Insights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">AI Diagnostic Insights</h2>
        {isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-96">
                    <Bot className="h-16 w-16 mb-4 text-primary animate-pulse" />
                    <p className="text-lg font-semibold">AI is analyzing the data...</p>
                    <p className="text-muted-foreground">This may take a moment.</p>
                </CardContent>
            </Card>
        )}
        {result ? (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Stethoscope className="text-primary"/>Preliminary Diagnosis</CardTitle>
                <Badge variant={result.confidenceLevel === 'High' ? 'default' : result.confidenceLevel === 'Medium' ? 'secondary' : 'destructive'}>{result.confidenceLevel} Confidence</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{result.preliminaryDiagnosis}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>Diagnostic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.diagnosticInsights}</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertCircle className="text-destructive"/>Potential Health Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {result.potentialHealthRisks.map((risk, i) => <li key={i}>{risk}</li>)}
                </ul>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Microscope className="text-primary"/>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendedNextSteps.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : !isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-96 text-center">
                    <Bot className="h-16 w-16 mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">Awaiting Patient Data</p>
                    <p className="text-muted-foreground">Fill out the form to generate diagnostic insights.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
