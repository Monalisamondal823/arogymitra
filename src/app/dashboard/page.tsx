"use client";

import { PatientVitals } from "@/components/dashboard/patient-vitals";
import { RiskSummaryCard } from "@/components/dashboard/risk-summary-card";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileScan, MessageSquare } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const conversationsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(
      collection(firestore, "conversations"),
      where(`members.${user.uid}`, "==", true)
      // To get unprocessed ones, we'd need a status field, e.g.
      // where("status", "==", "needs-processing")
    );
  }, [firestore, user?.uid]);

  const { data: conversations, isLoading: isLoadingConversations } = useCollection(conversationsQuery);

  const transcriptsToProcess = conversations?.length ?? 0;


  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">
            Welcome Back, {user?.displayName ? user.displayName.split(' ')[0] : 'Doctor'}
          </h1>
          <p className="text-muted-foreground">
            Here's a quick overview of your key activities and patient data.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <RiskSummaryCard />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileScan className="h-5 w-5 text-primary" />
              Radiology Queue
            </CardTitle>
            <CardDescription>
              New reports are ready for AI-assisted analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-between">
             <p className="text-4xl font-bold">12</p>
            <p className="text-xs text-muted-foreground mb-4">
              reports pending review
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/radiology">
                Analyze Reports <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Communication Hub
            </CardTitle>
            <CardDescription>
              Generate clinical notes from recent patient conversations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start justify-between">
            {isLoadingConversations ? (
              <Skeleton className="h-10 w-10" />
            ) : (
              <p className="text-4xl font-bold">{transcriptsToProcess}</p>
            )}
            <p className="text-xs text-muted-foreground mb-4">
              transcripts to process
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/communication">
                Generate Notes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
        <PatientVitals />
      </div>
    </div>
  );
}
