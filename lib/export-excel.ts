import ExcelJS from 'exceljs';

export interface MarksheetRecord {
  studentIdCode: string;
  studentName: string;
  course: string;
  schedule: string;
  gender: string;
  projectName: string;
  projectUrl: string;
  portfolioUrl: string;
  participation: number; // Max 10
  attendance: number;    // Max 10
  quizzes: number;       // Max 20
  assignments: number;   // Max 20
  synopsisScore: number; // Max 10
  uiUxScore: number;     // Max 20
  innovationScore: number;// Max 30
  reportingScore: number; // Max 10
  outcomesScore: number; // Max 10
  groupScore: number;    // Max 10
  presentationScore: number;// Max 10
  totalScore: number;    // Max 100
  grandTotalScore: number; // Out of 160 (Participation 10 + Attendance 10 + Quizzes 20 + Assignments 20 + Project Evaluation 100)
  status: string;
}

export async function generateExcelMarksheet(teacherName: string, records: MarksheetRecord[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Wessam Learning System (WLS)';
  workbook.lastModifiedBy = teacherName;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Student Consolidated Results', {
    views: [{ showGridLines: true }],
  });

  // Banner Header
  worksheet.mergeCells('A1', 'U1');
  const bannerCell = worksheet.getCell('A1');
  bannerCell.value = 'WESSAM LEARNING SYSTEM (WLS) - CONSOLIDATED ACADEMIC MARKSHEET';
  bannerCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFF' } };
  bannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
  bannerCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.mergeCells('A2', 'U2');
  const subBannerCell = worksheet.getCell('A2');
  subBannerCell.value = `Instructor: ${teacherName} | Generated: ${new Date().toLocaleDateString()} | Total Students: ${records.length}`;
  subBannerCell.font = { name: 'Calibri', size: 11, italic: true, color: { argb: '3B82F6' } };
  subBannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };
  subBannerCell.alignment = { horizontal: 'center', vertical: 'middle' };

  worksheet.addRow([]); // Blank row

  // Table Headers
  const headers = [
    'Student ID',
    'Student Name',
    'Course',
    'Schedule',
    'Gender',
    'Class Participation (10)',
    'Attendance (10)',
    'Quizzes (20)',
    'Assignments (20)',
    'Synopsis (10)',
    'UI/UX Layout (20)',
    'Innovation (30)',
    'Reporting Log (10)',
    'Outcomes (10)',
    'Group Work (10)',
    'Presentation (10)',
    'Project Score (100)',
    'Grand Total Marks (160)',
    'Evaluation Status',
    'Final Project Link',
    'Portfolio Link',
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.height = 28;

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: '94A3B8' } },
      left: { style: 'thin', color: { argb: '94A3B8' } },
      bottom: { style: 'medium', color: { argb: '1E293B' } },
      right: { style: 'thin', color: { argb: '94A3B8' } },
    };
  });

  // Populate Data Rows
  records.forEach((record) => {
    const row = worksheet.addRow([
      record.studentIdCode,
      record.studentName,
      record.course,
      record.schedule,
      record.gender,
      record.participation,
      record.attendance,
      record.quizzes,
      record.assignments,
      record.synopsisScore,
      record.uiUxScore,
      record.innovationScore,
      record.reportingScore,
      record.outcomesScore,
      record.groupScore,
      record.presentationScore,
      record.totalScore,
      record.grandTotalScore,
      record.status,
      record.projectUrl,
      record.portfolioUrl,
    ]);

    row.height = 22;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle' };

      // Center numbers and status
      if (colNumber >= 6 && colNumber <= 19) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }

      // Highlight status
      if (colNumber === 19) {
        if (record.status === 'EVALUATED') {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '059669' } };
        } else {
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'D97706' } };
        }
      }

      // Links styling
      if (colNumber >= 20) {
        cell.font = { name: 'Calibri', size: 10, color: { argb: '2563EB' }, underline: true };
      }

      cell.border = {
        top: { style: 'thin', color: { argb: 'E2E8F0' } },
        left: { style: 'thin', color: { argb: 'E2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
        right: { style: 'thin', color: { argb: 'E2E8F0' } },
      };
    });
  });

  // Adjust column widths automatically
  worksheet.columns.forEach((column) => {
    let maxLength = 12;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const columnValue = cell.value ? cell.value.toString() : '';
      if (columnValue.length > maxLength && columnValue.length < 50) {
        maxLength = columnValue.length;
      }
    });
    column.width = maxLength + 4;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
