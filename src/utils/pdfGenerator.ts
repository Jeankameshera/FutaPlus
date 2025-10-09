import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Remplace les placeholders {{...}} par les valeurs du data
export const generatePDF = async (templateHtml: string, data: Record<string, any>, fileName: string) => {
  let htmlContent = templateHtml;

  // Remplacer tous les placeholders {{key}}
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    htmlContent = htmlContent.replace(regex, data[key]);
  });

  // Créer un élément caché pour rendre le HTML
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  document.body.appendChild(div);

  // Convertir en canvas
  const canvas = await html2canvas(div, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'pt', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);

  document.body.removeChild(div);
};
