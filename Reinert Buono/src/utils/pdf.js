export async function descargarTablaPdf({
  titulo,
  subtitulo,
  nombreArchivo,
  columnas,
  filas,
}) {
  try {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const documento = new jsPDF({ orientation: "landscape" });
    documento.setFontSize(16);
    documento.text(titulo, 14, 16);

    if (subtitulo) {
      documento.setFontSize(10);
      documento.text(subtitulo, 14, 23);
    }

    autoTable(documento, {
      startY: subtitulo ? 29 : 23,
      head: [columnas],
      body: filas,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [34, 91, 73],
        textColor: 255,
      },
      margin: { left: 14, right: 14 },
    });

    documento.save(nombreArchivo);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    window.alert("No se pudo generar el PDF. Inténtalo de nuevo.");
  }
}
