const ReportDisplay = ({ selectedReport }) => {
    const formattedReport = selectedReport?.analysis_result
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Convert **bold** to <strong>
      .replace(/\n\*/g, "<br>•") // Convert * to bullet points
      .replace(/\n/g, "<br>"); // Convert newlines to <br>
  
    return (
      <div
        className="whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: formattedReport }}
      />
    );
  };
  
  export default ReportDisplay;
  