import React, { useEffect, useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Search, Eye, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Report } from "@/services/api";

const Reports: React.FC = () => {
  const { reports, fetchReports, loading, selectedReport, setSelectedReport } = useReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fixed useEffect - removed fetchReports from dependency array
  useEffect(() => {
    fetchReports();
    // Empty dependency array means this only runs once when component mounts
  }, []);

  const filteredReports = reports.filter((report) =>
    report.report_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-health-dark">Medical Reports</h1>
        <p className="text-muted-foreground">
          View and manage all your medical reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div>
              <CardTitle>Your Reports</CardTitle>
              <CardDescription>
                All of your uploaded medical reports
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-6">
              <div className="w-8 h-8 border-4 border-t-health-primary rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">Loading reports...</span>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-health-primary" />
                          {report.report_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(report.upload_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {report.doctor_approval ? (
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-health-success" />
                            <span>Approved</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-health-warning" />
                            <span>Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-health-primary"
                          onClick={() => viewReportDetails(report)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center p-6 text-center">
              <AlertTriangle className="w-10 h-10 mb-2 text-muted-foreground" />
              <h3 className="mb-1 font-medium">No reports found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No reports match your search."
                  : "You haven't uploaded any reports yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-health-primary">
              {selectedReport?.report_name}
            </DialogTitle>
            <DialogDescription>
              Uploaded on {selectedReport && new Date(selectedReport.upload_date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="p-4 border rounded-md bg-health-light">
              <h3 className="mb-2 font-semibold">Analysis Result</h3>
              <div className="whitespace-pre-line">{selectedReport?.analysis_result}</div>
            </div>
            
            {selectedReport?.doctor_notes && (
              <div className="p-4 border rounded-md bg-muted">
                <h3 className="mb-2 font-semibold">Doctor's Notes</h3>
                <div className="whitespace-pre-line">{selectedReport.doctor_notes}</div>
              </div>
            )}
            
            <div className="flex items-center p-2 border rounded-md">
              <div className="font-medium">Status:</div>
              <div className="flex items-center ml-2">
                {selectedReport?.doctor_approval ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 text-health-success" />
                    <span className="text-health-success">Approved by doctor</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-1 text-health-warning" />
                    <span className="text-health-warning">Pending doctor's review</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;