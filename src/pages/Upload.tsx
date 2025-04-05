import React, { useState, useRef } from "react";
import { useReports } from "@/contexts/ReportContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Check, X, AlertTriangle, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

const Upload: React.FC = () => {
  const { uploadReport } = useReports();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (fileToValidate: File) => {
    if (fileToValidate.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }
    if (fileToValidate.size > 10 * 1024 * 1024) {
      // 10MB
      toast.error("File size should not exceed 10MB.");
      return;
    }
    setFile(fileToValidate);
    setUploadResult(null);
    setShowAnalysis(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadReport(file);
      setUploadResult(result);
      toast.success("Report uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload report. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadResult(null);
    setShowAnalysis(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  // Format the analysis text by splitting on newlines
  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className={line.startsWith('-') ? "ml-4 mb-1" : "mb-2"}>
        {line}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-health-dark">Upload Medical Report</h1>
        <p className="text-muted-foreground">
          Upload your medical reports for AI analysis and doctor review
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Report</CardTitle>
            <CardDescription>
              Select a PDF file of your medical report to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadResult ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? "border-health-primary bg-health-muted"
                    : "border-border hover:border-health-primary hover:bg-health-light"
                } transition-colors cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <FileUp className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {file ? file.name : "Drag & Drop or Click to Upload"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    : "Supports PDF files up to 10MB"}
                </p>
                {file && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6 bg-health-light rounded-lg border border-health-primary">
                <Check className="w-10 h-10 mx-auto mb-2 text-health-success" />
                <h3 className="mb-2 text-lg font-semibold">Upload Successful!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your report has been processed successfully.
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/reports`)}
                  >
                    View All Reports
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-health-primary"
                    onClick={handleReset}
                  >
                    Upload Another
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-health-primary"
                    onClick={toggleAnalysis}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {showAnalysis ? "Hide Analysis" : "View Analysis"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!uploadResult && (
              <Button
                className="w-full bg-health-primary hover:bg-health-secondary"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4 mr-2" />
                    Upload and Analyze
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>Important information about uploading reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-md bg-health-muted">
              <h3 className="mb-2 font-semibold flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-health-warning" />
                Before You Upload
              </h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Ensure the report is in PDF format</li>
                <li>Check that all text in the PDF is clearly readable</li>
                <li>Maximum file size is 10MB</li>
                <li>Remove any unnecessary pages to speed up processing</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">What Happens Next?</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  <span className="font-medium">AI Analysis:</span> Our system will analyze your report to identify key health indicators
                </li>
                <li>
                  <span className="font-medium">Doctor Review:</span> A healthcare professional will review the analysis
                </li>
                <li>
                  <span className="font-medium">Notifications:</span> You'll be notified when the doctor has reviewed your report
                </li>
                <li>
                  <span className="font-medium">Consultation:</span> Use our diet consultation feature to get personalized advice based on your reports
                </li>
              </ol>
            </div>

            <div className="p-4 rounded-md bg-muted">
              <h3 className="mb-2 font-semibold">Privacy & Security</h3>
              <p className="text-sm text-muted-foreground">
                Your reports are encrypted and stored securely. Only you and your authorized healthcare providers can access them.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Result Section */}
      {uploadResult && showAnalysis && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>
              Automated analysis of your medical report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-health-light rounded-lg border border-health-primary">
              <div className="text-sm space-y-1">
                {formatAnalysis(uploadResult.analysis)}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: This analysis is AI-generated and pending doctor review. Always consult with a healthcare professional.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Upload;