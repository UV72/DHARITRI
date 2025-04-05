import React, { useEffect } from "react";
import { useReports } from "@/contexts/ReportContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, FileText, PieChart, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { reports, fetchReports, loading } = useReports();
  const { user } = useAuth();

  // Fixed useEffect - removed fetchReports from dependency array
  useEffect(() => {
    fetchReports();
    // Empty dependency array means this only runs once when component mounts
  }, []);

  const pendingReports = reports.filter(report => !report.doctor_approval).length;
  const approvedReports = reports.filter(report => report.doctor_approval).length;

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
                      {report.doctor_approval ? (
                        <CheckCircle className="w-5 h-5 text-health-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-health-warning" />
                      )}
                    </div>
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
    </div>
  );
};

export default Dashboard;