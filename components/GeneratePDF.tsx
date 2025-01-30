import { jsPDF } from "jspdf";

const generatePDF = (data: {
    referenceno: string;
    clientname: string;
    date: string;
    reason: string;
    amount: number;
    amountinwords: string;
    modeofpayment: string;
    receivedby: string;
    logoUrl?: string;
}) => {
    const doc = new jsPDF();

    // Add header text
    if (data.logoUrl) {
        doc.addImage(data.logoUrl, 'PNG', 20, 15, 50, 25); // Adjust dimensions as needed
    }

    // Add address (right-aligned)
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
        doc.text(line, rightMargin, 20 + (index * 5), {
            align: 'right'
        });
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set line color to blue (RGB values for blue are 0, 0, 255)
    doc.setDrawColor(54, 53, 123);

    // Set line width (thickness)
    doc.setLineWidth(1);

    // Draw the line
    doc.line(10, 50, pageWidth - 10, 50); // (x1, y1, x2, y2)

    // Blue rounded rectangle for "RECEIPT"
    const text = "RECEIPT";
    const padding = 3;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(text);
    const rectWidth = textWidth + padding * 2;
    const rectHeight = 11 + padding;
    const rectX = (pageWidth - rectWidth) / 2;
    const rectY = 55;

    doc.setFillColor(54, 53, 123);
    doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 7, 7, "F");

    doc.setTextColor(255, 255, 255);
    doc.text(text, pageWidth / 2, rectY + rectHeight / 2, {
        align: "center",
        baseline: "middle",
    });

    // Reset text color
    doc.setTextColor(0);
    doc.setFontSize(12);

    // Add "RECEIPT" title
    // doc.setFontSize(24);
    // doc.setTextColor(0, 174, 239); // Light blue color
    // const receiptText = 'RECEIPT';
    // const textWidth = doc.getStringUnitWidth(receiptText) * 24 / doc.internal.scaleFactor;
    // doc.text(receiptText, (210 - textWidth) / 2, 70);

    // Reset text color to black
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Add form fields with data
    const formFields = [
        { label: 'File Reference No:', value: data.referenceno, y: 90 },
        { label: 'Date:', value: data.date, y: 90, x: 120 },
        { label: 'Received From:', value: data.clientname, y: 110 },
        { label: 'Being Payment For:', value: data.reason, y: 130 },
        { label: 'Amount in Words:', value: data.amountinwords, y: 150 }
    ];

    formFields.forEach(field => {
        // Draw label
        doc.setFont("helvetica", "bold");
        doc.text(field.label, field.x || 20, field.y);


        // Draw value
        doc.setFont("helvetica", "normal");
        const labelWidth = doc.getStringUnitWidth(field.label) * 12 / doc.internal.scaleFactor;
        const startX = (field.x || 20) + labelWidth + 5;
        if (field.value) {
            doc.text(field.value, startX, field.y);
        }

        // Draw underline
        if (field.value) {
            doc.text(field.value, startX, field.y);

            // Calculate the width of the value
            const valueWidth = doc.getStringUnitWidth(field.value) * 12 / doc.internal.scaleFactor;

            doc.setDrawColor(54, 53, 123);
            
            // Set thinner line width
            doc.setLineWidth(0.3);

            // Draw underline only under the value
            const lineY = field.y + 2;
            doc.line(startX, lineY, startX + valueWidth + 10, lineY);
        }
    });

    // Add bottom fields with data
    const bottomFields = [
        { label: 'Amount:', value: data.amount.toString() },
        { label: 'Cash/ Cheque No:', value: data.modeofpayment },
        { label: 'Bank Transfer Date:', value: data.date },
        { label: 'Received By:', value: data.receivedby }
    ];

    const fieldWidth = 170 / bottomFields.length;

    bottomFields.forEach((field, index) => {
        const x = 20 + (fieldWidth * index);

        // Draw label
        doc.setFont("helvetica", "bold"); // Bold for the label
        doc.text(field.label, x, 180);

        // Draw value (below the label)
        if (field.value) {
            doc.setFont("helvetica", "normal"); // Normal for the value
            doc.text(field.value, x, 187); // Adjusted y position to be below the label
        }

        // Draw underline
        doc.line(x, 189, x + fieldWidth - 5, 189);
    });


    // Save the PDF with reference number
    doc.save(`Receipt_${data.referenceno}.pdf`);
};

export default generatePDF;