import { NoteGenerator } from "@/components/communication/note-generator";

export default function CommunicationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold tracking-tight">AI Communication Assistant</h1>
        <p className="text-muted-foreground">
          Transcribe conversations and generate draft clinical notes automatically.
        </p>
      </div>
      <NoteGenerator />
    </div>
  );
}
