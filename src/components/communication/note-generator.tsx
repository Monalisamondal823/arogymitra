"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AIClinicalNoteGenerationOutput, aiClinicalNoteGeneration } from "@/ai/flows/ai-clinical-note-generation-flow";

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
import { Separator } from "@/components/ui/separator";
import { Bot, ClipboardEdit, Loader2, MessageSquare, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  conversation: z.string().min(1, "Conversation transcript is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function NoteGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIClinicalNoteGenerationOutput | null>(null);
  const { toast, dismiss } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const { id } = toast({
      title: "Generating Note...",
      description: "The AI is summarizing the conversation and drafting a note.",
    });

    try {
      const response = await aiClinicalNoteGeneration(values);
      setResult(response);
      dismiss(id);
      toast({
        title: "Generation Complete",
        description: "Clinical note is ready for review.",
      });
    } catch (error) {
      console.error(error);
      dismiss(id);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate the clinical note.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const sampleConversation = `Doctor: "Good morning, Mr. Davis. What brings you in today?"
Patient: "Hi, Doctor. I've been having this persistent cough for about three weeks now. It's dry and it gets worse at night."
Doctor: "Any other symptoms? Fever, shortness of breath, chest pain?"
Patient: "No fever. Maybe a little short of breath when I walk up the stairs. And some tightness in my chest sometimes with the cough."
Doctor: "Okay, I'm going to listen to your lungs. Please take a deep breath."
(Sounds of examination)
Doctor: "Your lungs sound mostly clear, but I hear some faint wheezing. Given your symptoms, it could be a touch of bronchitis or perhaps adult-onset asthma. I'm going to prescribe an inhaler to see if that helps with the cough and chest tightness. Let's try it for two weeks and have a follow-up then."`;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Conversation Transcript</CardTitle>
          <CardDescription>Paste the doctor-patient conversation below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="conversation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transcript Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the conversation transcript here..."
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <ClipboardEdit className="mr-2 h-4 w-4" />
                      Generate Note
                    </>
                  )}
                </Button>
                 <Button type="button" variant="secondary" onClick={() => form.setValue("conversation", sampleConversation)}>
                  Load Sample
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline font-bold">AI-Generated Output</h2>
        {isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px]">
                    <Bot className="h-16 w-16 mb-4 text-primary animate-pulse" />
                    <p className="text-lg font-semibold">AI is drafting the note...</p>
                    <p className="text-muted-foreground">This may take a moment.</p>
                </CardContent>
            </Card>
        )}
        {result ? (
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-2"><BookOpen className="text-primary"/>Conversation Summary</h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">{result.summary}</p>
              </div>
              <Separator />
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold mb-2"><ClipboardEdit className="text-primary"/>Draft Clinical Note</h3>
                <div className="text-sm whitespace-pre-wrap p-4 border rounded-lg font-mono text-xs leading-relaxed">
                  {result.clinicalNote}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !isLoading && (
            <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center h-[400px] text-center">
                    <Bot className="h-16 w-16 mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold">Awaiting Conversation</p>
                    <p className="text-muted-foreground">Paste a transcript to generate a summary and clinical note.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
