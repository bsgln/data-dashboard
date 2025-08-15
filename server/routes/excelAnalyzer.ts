import { RequestHandler } from "express";
import * as XLSX from "xlsx";

const EXCEL_URL = "https://cdn.builder.io/o/assets%2F3a7659bd2c534c9d9609b01504a01464%2Ff59419d538b34c05be6399f805f52cf9?alt=media&token=e811fe30-9a2a-4cd7-b14f-89d904cc8374&apiKey=3a7659bd2c534c9d9609b01504a01464";

export const handleExcelAnalysis: RequestHandler = async (req, res) => {
  try {
    console.log("📊 Downloading Excel file from:", EXCEL_URL);
    
    // Download the Excel file
    const response = await fetch(EXCEL_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to download Excel file: ${response.status}`);
    }

    // Get the file as array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`📁 Excel file downloaded successfully (${Math.round(buffer.length / 1024)} KB)`);
    
    // Parse the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    console.log("📋 Workbook sheets:", workbook.SheetNames);
    
    // Analyze each sheet
    const analysisResults: any = {
      sheets: {},
      totalSheets: workbook.SheetNames.length,
      downloadInfo: {
        size: buffer.length,
        sizeFormatted: `${Math.round(buffer.length / 1024)} KB`,
        timestamp: new Date().toISOString()
      }
    };
    
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`📄 Sheet '${sheetName}' has ${jsonData.length} rows`);
      
      analysisResults.sheets[sheetName] = {
        rowCount: jsonData.length,
        columnCount: jsonData.length > 0 ? (jsonData[0] as any[]).length : 0,
        headers: jsonData.length > 0 ? jsonData[0] : [],
        sampleData: jsonData.slice(0, 5), // First 5 rows for preview
        allData: jsonData // Include all data for processing
      };
    });
    
    res.json({
      success: true,
      message: "Excel file analyzed successfully",
      data: analysisResults
    });
    
  } catch (error) {
    console.error("❌ Error analyzing Excel file:", error);
    res.status(500).json({
      error: "Failed to analyze Excel file",
      message: error instanceof Error ? error.message : "Unknown error",
      url: EXCEL_URL
    });
  }
};
