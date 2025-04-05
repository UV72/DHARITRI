
import React, { useState, useEffect } from "react";
import { useReports } from "@/contexts/ReportContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dietService } from "@/services/api";
import { toast } from "sonner";
import { PieChart, Send, Sparkles, Loader2, FileText } from "lucide-react";

const formSchema = z.object({
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  reportId: z.string().optional(),
});

const Diet: React.FC = () => {
  const { reports, fetchReports } = useReports();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedReportText, setSelectedReportText] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      reportId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setResponse(null);
    
    try {
      const requestData = {
        question: values.question,
        report_text: selectedReportText || undefined,
      };
      
      const result = await dietService.askQuestion(requestData);
      setResponse(result.answer);
    } catch (error) {
      console.error("Diet consultation error:", error);
      toast.error("Failed to get diet consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (reportId: string) => {
    if (reportId === "") {
      setSelectedReportText(null);
      return;
    }
    
    const selectedReport = reports.find(report => report.id.toString() === reportId);
    if (selectedReport) {
      setSelectedReportText(selectedReport.analysis_result);
    }
  };

  // Sample diet-related questions for suggestion
  const sampleQuestions = [
    "Can I eat bananas if I have high blood sugar?",
    "What foods should I avoid with high cholesterol?",
    "Is a keto diet safe with my current health condition?",
    "What nutrients do I need to supplement based on my reports?",
    "Are eggs good for my current health status?",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-health-dark">Diet Consultation</h1>
        <p className="text-muted-foreground">
          Get personalized diet recommendations based on your health reports
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Ask about specific foods or diets based on your health condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reportId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select a report (optional)</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleReportChange(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a report for more personalized advice" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No specific report</SelectItem>
                            {reports.map((report) => (
                              <SelectItem key={report.id} value={report.id.toString()}>
                                {report.report_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Question</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Can I eat bananas if I have high blood sugar?"
                            className="h-24 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-health-primary hover:bg-health-secondary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Getting consultation...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Get Diet Advice
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {response && (
                <div className="p-4 mt-6 border rounded-md bg-health-light">
                  <div className="flex items-center mb-2 text-health-primary">
                    <PieChart className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold">Dietary Recommendation</h3>
                  </div>
                  <div className="whitespace-pre-line">{response}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-health-accent" />
                Suggested Questions
              </CardTitle>
              <CardDescription>Try asking one of these questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left border-health-muted hover:bg-health-muted"
                  onClick={() => form.setValue("question", question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-health-primary" />
                Report Context
              </CardTitle>
              <CardDescription>
                {selectedReportText
                  ? "Using data from your selected report"
                  : "No report selected for context"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {selectedReportText
                  ? "Our AI will consider your report data when providing dietary recommendations."
                  : "Select a report for more personalized advice based on your actual health data."}
              </p>
              {reports.length === 0 && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  You don't have any reports yet. Upload a medical report to get more personalized advice.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diet;
