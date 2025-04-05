import React, { useEffect, useState } from "react";
import { useReports } from "@/contexts/ReportContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, FileText, PieChart, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReportDisplay from "./ReportDisplay"; // Import the component
import { Report } from "src/services/api";



const Dashboard: React.FC = () => {
  const { reports, fetchReports, loading, selectedReport, setSelectedReport  } = useReports();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReportApproved, setIsReportApproved] = useState(false);

  // Fixed useEffect - removed fetchReports from dependency array
  useEffect(() => {
    fetchReports();
    // Empty dependency array means this only runs once when component mounts
  }, []);

  const pendingReports = reports.filter(report => !report.doctor_approval).length;
  const approvedReports = reports.filter(report => report.doctor_approval).length;

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  var[PReports, setPReports] = useState(1);
  var[AReports, setAReports] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-health-dark">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your health reports and consult with professionals
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-2 text-health-primary" />
              <div className="stats-value">{reports.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-2 text-health-warning" />
              <div className="stats-value">{pendingReports}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-health-success" />
              <div className="stats-value">{approvedReports}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="w-6 h-6 mr-2 text-health-accent" />
              <div className="stats-value">
                {reports.length > 0 ? Math.floor(Math.random() * 30) + 70 : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Your latest health reports</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-4 text-center">Loading your reports...</div>
            ) : reports.length > 0 ? (
              <div className="space-y-2">
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="flex items-center p-3 border rounded-md">
                    <FileText className="flex-shrink-0 w-5 h-5 mr-3 text-health-primary" />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium truncate">{report.report_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.upload_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex-shrink-0 ml-2">
                      {isReportApproved ? (
                        <CheckCircle className="w-5 h-5 text-health-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-health-warning" />
                      )}
                    </div>

                    <Button
                          variant="ghost"
                          size="sm"
                          className="text-health-primary"
                          onClick={() => viewReportDetails(report)}
                        >
                          {/* <Eye className="w-4 h-4 mr-1" /> */}
                          View
                    </Button>
                    
                  </div>
                ))}
                {reports.length > 3 && (
                  <div className="pt-2 text-center">
                    <Link to="/reports">
                      <Button variant="link" className="text-health-primary">
                        View all reports
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center p-6 text-center">
                <AlertTriangle className="w-10 h-10 mb-2 text-muted-foreground" />
                <h3 className="mb-1 font-medium">No reports found</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  You haven't uploaded any health reports yet.
                </p>
                <Link to="/upload">
                  <Button className="bg-health-primary hover:bg-health-secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Report
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link to="/upload">
                <Button className="w-full bg-health-primary hover:bg-health-secondary h-24 flex flex-col">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Upload Report</span>
                </Button>
              </Link>
              <Link to="/diet">
                <Button variant="outline" className="w-full border-health-primary text-health-primary hover:bg-health-muted h-24 flex flex-col">
                  <PieChart className="w-6 h-6 mb-2" />
                  <span>Diet Consultation</span>
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" className="w-full border-health-primary text-health-primary hover:bg-health-muted h-24 flex flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>View Reports</span>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full border-health-primary text-health-primary hover:bg-health-muted h-24 flex flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  <span>My Profile</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
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
        <ReportDisplay selectedReport={selectedReport} />
      </div>

      {selectedReport?.doctor_notes && (
        <div className="p-4 border rounded-md bg-muted">
          <h3 className="mb-2 font-semibold">Doctor's Notes</h3>
          <div className="whitespace-pre-line">{selectedReport.doctor_notes}</div>
        </div>
      )}

      {/* Notes Input Box */}
      <div className="p-4 border rounded-md">
        <h3 className="mb-2 font-semibold">Notes:</h3>
        <textarea
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-health-primary"
          placeholder="Enter your notes here..."
          rows={3}
        />
      </div>

      {/* Status Section with Approve Button */}
      <div className="flex items-center justify-between p-2 border rounded-md">
        <div className="flex items-center">
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

        {/* Approve Button */}
        {!selectedReport?.doctor_approval && (
          <button
            className="px-4 py-2 text-white bg-health-primary rounded-md hover:bg-health-dark transition"
            onClick={() => {
              setIsDialogOpen(false)
              setIsReportApproved(true)
              setAReports(++AReports)
              setPReports(--PReports)

            }}
          >
            Approve
          </button>
        )}
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default Dashboard;