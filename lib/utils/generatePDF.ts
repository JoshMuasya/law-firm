import { jsPDF } from "jspdf";

const generatePDF = (data: {
    referenceno: string;
    date: string;
    revenue: number;
    expenses: number;
    logoUrl?: string;
}) => {
    const doc = new jsPDF();

    // Automatically calculate balance
    const balance = data.revenue - data.expenses;

    // Add logo if provided
    if (data.logoUrl) {
        doc.addImage(data.logoUrl, 'PNG', 20, 15, 50, 25);
    }

    // Add business address
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const address = [
        'Westlands Commercial Center,',
        'Block B 1st Floor Room 3,',
        'Westlands, Nairobi, Kenya,',
        'P.O. BOX 19318 - 00100',
        'Tel: +254 726 479027,',
        'Email: nyihamathenge@gmail.com'
    ];
    const rightMargin = 190;
    address.forEach((line, index) => {
        doc.text(line, rightMargin, 20 + (index * 5), { align: 'right' });
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add horizontal line
    doc.setDrawColor(54, 53, 123);
    doc.setLineWidth(1);
    doc.line(10, 50, pageWidth - 10, 50);

    // Add statement title in a rounded rectangle
    const title = "Profit and Loss Statement";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const titleWidth = doc.getTextWidth(title);
    const rectX = (pageWidth - titleWidth - 16) / 2;
    doc.setFillColor(54, 53, 123);
    doc.roundedRect(rectX, 55, titleWidth + 16, 18, 7, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageWidth / 2, 65, { align: "center" });

    // Reset text color for the rest of the document
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Form fields
    const formFields = [
        { label: 'File Reference No:', value: data.referenceno, y: 90 },
        { label: 'Date:', value: data.date, y: 90, x: 120 },
    ];

    formFields.forEach(field => {
        doc.setFont("helvetica", "bold");
        doc.text(field.label, field.x || 20, field.y);
        doc.setFont("helvetica", "normal");
        const labelWidth = doc.getStringUnitWidth(field.label) * 12 / doc.internal.scaleFactor;
        const startX = (field.x || 20) + labelWidth + 5;
        if (field.value) {
            doc.text(field.value, startX, field.y);
            doc.setDrawColor(54, 53, 123);
            doc.setLineWidth(0.3);
            const valueWidth = doc.getStringUnitWidth(field.value) * 12 / doc.internal.scaleFactor;
            doc.line(startX, field.y + 2, startX + valueWidth + 10, field.y + 2);
        }
    });

    // Bottom Fields
    const bottomFields = [
        { label: 'Total Revenue:', value: `$${data.revenue.toFixed(2)}` },
        { label: 'Total Expenses:', value: `$${data.expenses.toFixed(2)}` },
        { label: 'Profit/Loss:', value: `$${balance.toFixed(2)}` },
    ];

    const fieldWidth = 170 / bottomFields.length;
    bottomFields.forEach((field, index) => {
        const x = 20 + (fieldWidth * index);
        doc.setFont("helvetica", "bold");
        doc.text(field.label, x, 180);
        doc.setFont("helvetica", "normal");
        doc.text(field.value, x, 187);
        doc.line(x, 189, x + fieldWidth - 5, 189);
    });

    // Save the PDF
    doc.save(`statement_${data.referenceno}.pdf`);
};

export default generatePDF;
