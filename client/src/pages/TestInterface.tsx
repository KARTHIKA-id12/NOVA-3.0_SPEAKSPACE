import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function TestInterface() {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Error",
                description: "Please enter a prompt",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const res = await apiRequest("POST", "/api/process", {
                prompt,
                note_id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
            });

            const data = await res.json();
            setResult(data);

            toast({
                title: "Success",
                description: "Request processed successfully",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to process request",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Safety Net AI - Test Interface</h1>
                    <p className="text-gray-500 mt-2">Test the emergency detection and email reporting system</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Input Scenario</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="Enter a scenario to test (e.g., 'I am being followed and I feel unsafe...')"
                                className="min-h-[200px]"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <Button
                                onClick={handleSubmit}
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Submit Incident Report"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>API Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {result ? (
                                <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-[400px]">
                                    <pre className="text-sm font-mono whitespace-pre-wrap">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[200px] text-gray-400 border-2 border-dashed rounded-md">
                                    Response will appear here
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
