
import React, { createContext, useContext, useState } from "react";
import { reportService, Report } from "@/services/api";
import { toast } from "sonner";

interface ReportContextType {
  reports: Report[];
  fetchReports: () => Promise<void>;
  uploadReport: (file: File) => Promise<any>;
  loading: boolean;
  selectedReport: Report | null;
  setSelectedReport: (report: Report | null) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const fetchedReports = await reportService.getUserReports();
      setReports(fetchedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch your reports");
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async (file: File) => {
    setLoading(true);
    try {
      const result = await reportService.uploadReport(file);
      toast.success("Report uploaded and analyzed successfully");
      // Refresh reports after upload
      await fetchReports();
      return result;
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error("Failed to upload report");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        fetchReports,
        uploadReport,
        loading,
        selectedReport,
        setSelectedReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
