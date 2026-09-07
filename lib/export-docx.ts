import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
} from 'docx';

export interface EvaluationData {
  studentName: string;
  studentIdCode: string;
  course: string;
  schedule: string;
  gender: string;
  projectName: string;
  projectUrl: string;
  portfolioUrl: string;
  teacherName: string;
  evaluatorName: string;
  synopsisScore: number;
  uiUxScore: number;
  innovationScore: number;
  reportingScore: number;
  outcomesScore: number;
  groupScore: number;
  presentationScore: number;
  totalScore: number;
  feedback?: string;
  createdAt: Date | string;
}

export async function generateWordEvaluationReport(data: EvaluationData): Promise<Buffer> {
  const tableHeaderStyle = {
    fill: '1E3A8A', // Deep primary blue
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'WESSAM LEARNING SYSTEM (WLS)',
                bold: true,
                size: 32,
                color: '3B82F6',
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ACADEMIC FINAL PROJECT ASSESSMENT REPORT',
                bold: true,
                size: 24,
                color: '1E293B',
                font: 'Calibri',
              }),
            ],
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Student Name: ', bold: true }),
                          new TextRun({ text: data.studentName }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Student ID: ', bold: true }),
                          new TextRun({ text: data.studentIdCode }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Course: ', bold: true }),
                          new TextRun({ text: data.course }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Instructor: ', bold: true }),
                          new TextRun({ text: data.teacherName }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Project Name: ', bold: true }),
                          new TextRun({ text: data.projectName }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Schedule: ', bold: true }),
                          new TextRun({ text: data.schedule }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Evaluation Rubric Title
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: 'Official Evaluation Rubric Breakdown',
                bold: true,
                color: '3B82F6',
              }),
            ],
          }),

          // Rubric Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header Row
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: tableHeaderStyle.fill },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Evaluation Criteria', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: tableHeaderStyle.fill },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Max Marks', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: tableHeaderStyle.fill },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: 'Score Obtained', bold: true, color: 'FFFFFF' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              // Criteria 1
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Idea / Synopsis' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '10' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.synopsisScore}` })] }),
                ],
              }),
              // Criteria 2
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'User / Client Interface and Layout' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '20' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.uiUxScore}` })] }),
                ],
              }),
              // Criteria 3
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Innovation / Creativity' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '30' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.innovationScore}` })] }),
                ],
              }),
              // Criteria 4
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Reporting System / Activity Log' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '10' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.reportingScore}` })] }),
                ],
              }),
              // Criteria 5
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Integration with the Course Outcomes' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '10' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.outcomesScore}` })] }),
                ],
              }),
              // Criteria 6
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Group Involvement' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '10' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.groupScore}` })] }),
                ],
              }),
              // Criteria 7
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Presentation Style' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: '10' })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, text: `${data.presentationScore}` })] }),
                ],
              }),
              // Total Row
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'FINAL EVALUATION SCORE', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '100', bold: true })] })] }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `${data.totalScore} / 100`,
                            bold: true,
                            color: data.totalScore >= 50 ? '059669' : 'DC2626',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Feedback Section
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: 'Evaluator Feedback & Comments', bold: true, color: '1E293B' })],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.feedback || 'No additional remarks provided.',
                italics: true,
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 400 } }),

          // Links section
          new Paragraph({
            children: [
              new TextRun({ text: 'Project URL: ', bold: true }),
              new TextRun({ text: data.projectUrl || 'N/A' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Portfolio URL: ', bold: true }),
              new TextRun({ text: data.portfolioUrl || 'N/A' }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 500 } }),

          // Footer branding
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Evaluated via Wessam Learning System (WLS)',
                bold: true,
                size: 18,
                color: '64748B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Developer & Educator: Wessam Aftab | AI & Software Engineer | Technical Educator',
                size: 16,
                color: '94A3B8',
              }),
            ],
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
