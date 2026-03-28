package com.management.creatifpro.fichepaie.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import com.management.creatifpro.employees.repositories.EmployeeRepository;
import com.management.creatifpro.pointage.models.entities.PointageEntity;
import com.management.creatifpro.pointage.repositories.PointageRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.itextpdf.io.font.constants.StandardFonts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class FichePaieService {

    private final EmployeeRepository employeeRepository;
    private final PointageRepository pointageRepository;

    // ─── Taux marocains (législation 2024/2025) ────────────────────────
    private static final float CNSS_SALARIAL_RATE = 0.0448f;       // 4.48% CNSS part salariale
    private static final float CNSS_PLAFOND_MENSUEL = 6000f;        // Plafond mensuel CNSS
    private static final float AMO_SALARIAL_RATE = 0.0226f;         // 2.26% AMO part salariale
    private static final float CNSS_PATRONAL_RATE = 0.0893f;        // 8.93% CNSS part patronale (alloc familiales + prestations sociales)
    private static final float AMO_PATRONAL_RATE = 0.0470f;         // 4.70% AMO part patronale (dont taxe formation pro)
    private static final float TAXE_FP_RATE = 0.0160f;              // 1.60% Taxe formation professionnelle

    // ─── Barème IR Maroc annuel ────────────────────────────────────────
    private static final float[][] IR_BAREME = {
            {30000f, 0f, 0f},
            {50000f, 0.10f, 3000f},
            {60000f, 0.20f, 8000f},
            {80000f, 0.30f, 14000f},
            {180000f, 0.34f, 17200f},
            {Float.MAX_VALUE, 0.38f, 24400f},
    };

    private static final DateTimeFormatter MONTH_YEAR_FR = DateTimeFormatter.ofPattern("MMMM yyyy", Locale.FRANCE);

    public byte[] generateFichePaie(Long employeeId, int year, int month) {
        log.info("Generating fiche de paie for employee {} - {}/{}", employeeId, month, year);

        // Validation: pas le mois courant
        YearMonth requested = YearMonth.of(year, month);
        YearMonth current = YearMonth.now();
        if (requested.equals(current) || requested.isAfter(current)) {
            throw new AppException(
                    "Impossible de générer la fiche de paie pour le mois en cours ou un mois futur. Veuillez sélectionner un mois antérieur.",
                    HttpStatus.BAD_REQUEST);
        }

        EmployeeEntity employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException("Employé non trouvé avec l'id: " + employeeId, HttpStatus.NOT_FOUND));

        LocalDate startOfMonth = requested.atDay(1);
        LocalDate endOfMonth = requested.atEndOfMonth();

        // Récupérer les pointages du mois
        List<PointageEntity> pointages = pointageRepository.findByEmployeeIdAndDateRange(employeeId, startOfMonth, endOfMonth);
        Float totalWorkedDays = pointageRepository.sumWorkedDaysByEmployeeAndDateRange(employeeId, startOfMonth, endOfMonth);
        if (totalWorkedDays == null) totalWorkedDays = 0f;

        // Calcul des éléments de paie
        float salaireBrut = calculateSalaireBrut(employee, totalWorkedDays);
        float cnssBase = Math.min(salaireBrut, CNSS_PLAFOND_MENSUEL);
        float cotisationCnss = cnssBase * CNSS_SALARIAL_RATE;
        float cotisationAmo = salaireBrut * AMO_SALARIAL_RATE;
        float totalCotisationsSalariales = cotisationCnss + cotisationAmo;

        // Salaire brut imposable
        float salaireBrutImposable = salaireBrut - totalCotisationsSalariales;

        // Frais professionnels (20% plafonné à 2500 DH/mois pour le secteur privé)
        float fraisProfessionnels = Math.min(salaireBrutImposable * 0.20f, 2500f);

        // Salaire net imposable
        float salaireNetImposable = salaireBrutImposable - fraisProfessionnels;

        // IR
        float irMensuel = calculateIR(salaireNetImposable);

        // Charges patronales
        float cnssPatronal = cnssBase * CNSS_PATRONAL_RATE;
        float amoPatronal = salaireBrut * AMO_PATRONAL_RATE;
        float taxeFP = salaireBrut * TAXE_FP_RATE;
        float totalChargesPatronales = cnssPatronal + amoPatronal + taxeFP;

        // Salaire net
        float salaireNet = salaireBrut - totalCotisationsSalariales - irMensuel;

        try {
            return buildPdf(employee, requested, totalWorkedDays, salaireBrut, cnssBase,
                    cotisationCnss, cotisationAmo, totalCotisationsSalariales, salaireBrutImposable,
                    fraisProfessionnels, salaireNetImposable, irMensuel, salaireNet,
                    cnssPatronal, amoPatronal, taxeFP, totalChargesPatronales, pointages);
        } catch (Exception e) {
            log.error("Erreur lors de la génération du PDF de fiche de paie", e);
            throw new AppException("Erreur lors de la génération de la fiche de paie", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private float calculateSalaireBrut(EmployeeEntity employee, float totalWorkedDays) {
        if (employee.getSalary() != null && employee.getSalary() > 0) {
            // Salaire mensuel fixe: prorata basé sur 26 jours ouvrables
            return (employee.getSalary() / 26f) * totalWorkedDays;
        } else if (employee.getDailyRate() != null && employee.getDailyRate() > 0) {
            return employee.getDailyRate() * totalWorkedDays;
        }
        return 0f;
    }

    private float calculateIR(float salaireNetImposableMensuel) {
        float sni_annuel = salaireNetImposableMensuel * 12;
        float irAnnuel = 0;
        for (float[] tranche : IR_BAREME) {
            if (sni_annuel <= tranche[0]) {
                irAnnuel = sni_annuel * tranche[1] - tranche[2];
                break;
            }
        }
        return Math.max(irAnnuel / 12f, 0f);
    }

    // ─── PDF Generation ───────────────────────────────────────────────
    private byte[] buildPdf(EmployeeEntity employee, YearMonth period, float totalWorkedDays,
                            float salaireBrut, float cnssBase, float cotisationCnss, float cotisationAmo,
                            float totalCotisationsSalariales, float salaireBrutImposable, float fraisProfessionnels,
                            float salaireNetImposable, float irMensuel, float salaireNet,
                            float cnssPatronal, float amoPatronal, float taxeFP, float totalChargesPatronales,
                            List<PointageEntity> pointages) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf, PageSize.A4);
        doc.setMargins(30, 40, 30, 40);

        PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont fontRegular = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont fontItalic = PdfFontFactory.createFont(StandardFonts.HELVETICA_OBLIQUE);

        DeviceRgb primaryColor = new DeviceRgb(41, 98, 255);
        DeviceRgb headerBg = new DeviceRgb(41, 98, 255);
        DeviceRgb lightBg = new DeviceRgb(245, 247, 250);
        DeviceRgb borderColor = new DeviceRgb(200, 210, 230);

        // ─── En-tête Entreprise ─────────────────────────────────────
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{60, 40})).useAllAvailableWidth();

        Cell companyCell = new Cell().setBorder(Border.NO_BORDER).setPadding(10);
        companyCell.add(new Paragraph("CREATIF PRO").setFont(fontBold).setFontSize(20).setFontColor(primaryColor));
        companyCell.add(new Paragraph("Société de services et management").setFont(fontItalic).setFontSize(9).setFontColor(ColorConstants.GRAY));
        companyCell.add(new Paragraph(" ").setFontSize(4));
        companyCell.add(new Paragraph("ICE : _______________").setFont(fontRegular).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY));
        companyCell.add(new Paragraph("IF : _______________").setFont(fontRegular).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY));
        companyCell.add(new Paragraph("CNSS Employeur : _______________").setFont(fontRegular).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY));
        headerTable.addCell(companyCell);

        Cell titleCell = new Cell().setBorder(Border.NO_BORDER).setPadding(10).setTextAlignment(TextAlignment.RIGHT);
        titleCell.add(new Paragraph("BULLETIN DE PAIE").setFont(fontBold).setFontSize(16).setFontColor(primaryColor));
        String periodStr = period.atDay(1).format(MONTH_YEAR_FR);
        periodStr = periodStr.substring(0, 1).toUpperCase() + periodStr.substring(1);
        titleCell.add(new Paragraph(periodStr).setFont(fontRegular).setFontSize(12).setFontColor(ColorConstants.DARK_GRAY));
        headerTable.addCell(titleCell);

        doc.add(headerTable);

        // Séparateur
        doc.add(new Paragraph("").setMarginBottom(5));
        doc.add(createSeparator(primaryColor));
        doc.add(new Paragraph("").setMarginBottom(10));

        // ─── Informations Salarié ───────────────────────────────────
        Table employeeInfoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
        employeeInfoTable.setBorder(new SolidBorder(borderColor, 0.5f));

        Cell leftInfo = new Cell().setBorder(Border.NO_BORDER).setPadding(12).setBackgroundColor(lightBg);
        leftInfo.add(new Paragraph("INFORMATIONS SALARIÉ").setFont(fontBold).setFontSize(9).setFontColor(primaryColor).setMarginBottom(8));
        leftInfo.add(createInfoLine(fontBold, fontRegular, "Nom & Prénom", employee.getLastName() + " " + employee.getFirstName()));
        leftInfo.add(createInfoLine(fontBold, fontRegular, "CIN", employee.getCin() != null ? employee.getCin() : "—"));
        leftInfo.add(createInfoLine(fontBold, fontRegular, "N° CNSS", employee.getNCnss() != null ? employee.getNCnss() : "—"));
        leftInfo.add(createInfoLine(fontBold, fontRegular, "Fonction", employee.getJobRole() != null ? employee.getJobRole() : "—"));
        employeeInfoTable.addCell(leftInfo);

        Cell rightInfo = new Cell().setBorder(Border.NO_BORDER).setPadding(12).setBackgroundColor(lightBg);
        rightInfo.add(new Paragraph("SITUATION").setFont(fontBold).setFontSize(9).setFontColor(primaryColor).setMarginBottom(8));
        rightInfo.add(createInfoLine(fontBold, fontRegular, "Date d'embauche",
                employee.getIntegrationDate() != null ? employee.getIntegrationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "—"));
        rightInfo.add(createInfoLine(fontBold, fontRegular, "Projet",
                employee.getProject() != null ? employee.getProject().getCode() : "—"));
        rightInfo.add(createInfoLine(fontBold, fontRegular, "Chantier", employee.getChantier() != null ? employee.getChantier() : "—"));
        rightInfo.add(createInfoLine(fontBold, fontRegular, "RIB", employee.getRib() != null ? employee.getRib() : "—"));
        employeeInfoTable.addCell(rightInfo);

        doc.add(employeeInfoTable);
        doc.add(new Paragraph("").setMarginBottom(12));

        // ─── Détails de la rémunération ─────────────────────────────
        doc.add(new Paragraph("DÉTAILS DE LA RÉMUNÉRATION").setFont(fontBold).setFontSize(10).setFontColor(primaryColor).setMarginBottom(6));

        Table remuTable = new Table(UnitValue.createPercentArray(new float[]{40, 15, 15, 15, 15})).useAllAvailableWidth();
        remuTable.setBorder(new SolidBorder(borderColor, 0.5f));

        // Header
        addTableHeader(remuTable, fontBold, headerBg, "Libellé", "Base", "Taux / Nbre", "Retenue", "Gain");

        // Salaire de base
        float salaireBase = employee.getSalary() != null && employee.getSalary() > 0 ? employee.getSalary() : 0;
        float tauxJournalier = employee.getDailyRate() != null && employee.getDailyRate() > 0 ? employee.getDailyRate() : (salaireBase / 26f);
        addTableRow(remuTable, fontRegular, lightBg, false,
                "Salaire de base", fmt(salaireBase), String.valueOf(totalWorkedDays) + " j", "—", fmt(salaireBrut));

        // Ancienneté (info ligne)
        addTableRow(remuTable, fontRegular, null, true,
                "Prime d'ancienneté", "—", "—", "—", fmt(0));

        // Ligne: Salaire brut
        addTableTotalRow(remuTable, fontBold, new DeviceRgb(230, 240, 255),
                "SALAIRE BRUT", "", "", "", fmt(salaireBrut));

        doc.add(remuTable);
        doc.add(new Paragraph("").setMarginBottom(12));

        // ─── Cotisations sociales ───────────────────────────────────
        doc.add(new Paragraph("COTISATIONS SOCIALES").setFont(fontBold).setFontSize(10).setFontColor(primaryColor).setMarginBottom(6));

        Table cotisTable = new Table(UnitValue.createPercentArray(new float[]{40, 20, 20, 20})).useAllAvailableWidth();
        cotisTable.setBorder(new SolidBorder(borderColor, 0.5f));

        addTableHeader4(cotisTable, fontBold, headerBg, "Libellé", "Base", "Taux", "Montant");

        // CNSS
        addTableRow4(cotisTable, fontRegular, lightBg, false,
                "CNSS (part salariale)", fmt(cnssBase), fmtPct(CNSS_SALARIAL_RATE), fmt(cotisationCnss));

        // AMO
        addTableRow4(cotisTable, fontRegular, null, true,
                "AMO (part salariale)", fmt(salaireBrut), fmtPct(AMO_SALARIAL_RATE), fmt(cotisationAmo));

        // Total cotisations salariales
        addTableTotalRow4(cotisTable, fontBold, new DeviceRgb(230, 240, 255),
                "TOTAL COTISATIONS SALARIALES", "", "", fmt(totalCotisationsSalariales));

        doc.add(cotisTable);
        doc.add(new Paragraph("").setMarginBottom(12));

        // ─── Calcul IR ──────────────────────────────────────────────
        doc.add(new Paragraph("IMPÔT SUR LE REVENU (IR)").setFont(fontBold).setFontSize(10).setFontColor(primaryColor).setMarginBottom(6));

        Table irTable = new Table(UnitValue.createPercentArray(new float[]{60, 40})).useAllAvailableWidth();
        irTable.setBorder(new SolidBorder(borderColor, 0.5f));

        addIrRow(irTable, fontRegular, lightBg, "Salaire brut imposable (SBI)", fmt(salaireBrutImposable));
        addIrRow(irTable, fontRegular, null, "Frais professionnels (20%, max 2 500 DH)", fmt(fraisProfessionnels));
        addIrRow(irTable, fontRegular, lightBg, "Salaire net imposable (SNI)", fmt(salaireNetImposable));
        addIrRow(irTable, fontBold, new DeviceRgb(230, 240, 255), "IR Mensuel", fmt(irMensuel));

        doc.add(irTable);
        doc.add(new Paragraph("").setMarginBottom(12));

        // ─── Récapitulatif Net à payer ──────────────────────────────
        Table netTable = new Table(UnitValue.createPercentArray(new float[]{60, 40})).useAllAvailableWidth();
        netTable.setBorder(new SolidBorder(new DeviceRgb(41, 98, 255), 1.5f));

        Cell netLabel = new Cell().setBorder(Border.NO_BORDER).setPadding(14)
                .setBackgroundColor(primaryColor);
        netLabel.add(new Paragraph("NET À PAYER").setFont(fontBold).setFontSize(14).setFontColor(ColorConstants.WHITE));
        netTable.addCell(netLabel);

        Cell netValue = new Cell().setBorder(Border.NO_BORDER).setPadding(14)
                .setBackgroundColor(primaryColor).setTextAlignment(TextAlignment.RIGHT);
        netValue.add(new Paragraph(fmt(salaireNet) + " MAD").setFont(fontBold).setFontSize(14).setFontColor(ColorConstants.WHITE));
        netTable.addCell(netValue);

        doc.add(netTable);
        doc.add(new Paragraph("").setMarginBottom(15));

        // ─── Charges patronales (à titre informatif) ────────────────
        doc.add(new Paragraph("CHARGES PATRONALES (à titre informatif)").setFont(fontBold).setFontSize(9).setFontColor(ColorConstants.GRAY).setMarginBottom(4));

        Table patronTable = new Table(UnitValue.createPercentArray(new float[]{40, 20, 20, 20})).useAllAvailableWidth();
        patronTable.setBorder(new SolidBorder(borderColor, 0.5f));

        addTableHeader4(patronTable, fontBold, new DeviceRgb(100, 120, 150), "Libellé", "Base", "Taux", "Montant");
        addTableRow4(patronTable, fontRegular, lightBg, false,
                "CNSS (part patronale)", fmt(cnssBase), fmtPct(CNSS_PATRONAL_RATE), fmt(cnssPatronal));
        addTableRow4(patronTable, fontRegular, null, true,
                "AMO (part patronale)", fmt(salaireBrut), fmtPct(AMO_PATRONAL_RATE), fmt(amoPatronal));
        addTableRow4(patronTable, fontRegular, lightBg, false,
                "Taxe formation professionnelle", fmt(salaireBrut), fmtPct(TAXE_FP_RATE), fmt(taxeFP));
        addTableTotalRow4(patronTable, fontBold, new DeviceRgb(240, 240, 245),
                "TOTAL CHARGES PATRONALES", "", "", fmt(totalChargesPatronales));

        doc.add(patronTable);
        doc.add(new Paragraph("").setMarginBottom(20));

        // ─── Pied de page ───────────────────────────────────────────
        doc.add(createSeparator(borderColor));
        doc.add(new Paragraph("").setMarginBottom(5));

        Table footerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();

        Cell footerLeft = new Cell().setBorder(Border.NO_BORDER);
        footerLeft.add(new Paragraph("Document généré le " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .setFont(fontItalic).setFontSize(7).setFontColor(ColorConstants.GRAY));
        footerLeft.add(new Paragraph("Ce bulletin de paie est établi conformément au Code du Travail marocain (Loi n° 65-99)")
                .setFont(fontItalic).setFontSize(7).setFontColor(ColorConstants.GRAY));
        footerTable.addCell(footerLeft);

        Cell footerRight = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
        footerRight.add(new Paragraph("Signature de l'employeur").setFont(fontRegular).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY).setMarginTop(10));
        footerRight.add(new Paragraph("").setMarginBottom(30));
        footerRight.add(new Paragraph("_______________________").setFont(fontRegular).setFontSize(8).setFontColor(ColorConstants.GRAY));
        footerTable.addCell(footerRight);

        doc.add(footerTable);

        doc.close();
        return baos.toByteArray();
    }

    // ─── Helper Methods ─────────────────────────────────────────────

    private Paragraph createInfoLine(PdfFont bold, PdfFont regular, String label, String value) {
        return new Paragraph()
                .add(new com.itextpdf.layout.element.Text(label + " : ").setFont(bold).setFontSize(8).setFontColor(ColorConstants.DARK_GRAY))
                .add(new com.itextpdf.layout.element.Text(value).setFont(regular).setFontSize(8).setFontColor(ColorConstants.BLACK))
                .setMarginBottom(2);
    }

    private Table createSeparator(DeviceRgb color) {
        Table separator = new Table(1).useAllAvailableWidth();
        Cell sepCell = new Cell().setBorder(Border.NO_BORDER).setHeight(1.5f).setBackgroundColor(color);
        separator.addCell(sepCell);
        return separator;
    }

    // ─── 5-column table helpers ─────────────────────────────────────

    private void addTableHeader(Table table, PdfFont font, DeviceRgb bg, String... headers) {
        for (String h : headers) {
            Cell cell = new Cell().setBackgroundColor(bg).setPadding(7).setBorder(Border.NO_BORDER);
            cell.add(new Paragraph(h).setFont(font).setFontSize(8).setFontColor(ColorConstants.WHITE).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(cell);
        }
    }

    private void addTableRow(Table table, PdfFont font, DeviceRgb bg, boolean alt,
                             String libelle, String base, String taux, String retenue, String gain) {
        DeviceRgb rowBg = bg != null ? bg : (alt ? new DeviceRgb(250, 250, 252) : null);
        String[] values = {libelle, base, taux, retenue, gain};
        for (int i = 0; i < values.length; i++) {
            Cell cell = new Cell().setPadding(6).setBorder(Border.NO_BORDER);
            if (rowBg != null) cell.setBackgroundColor(rowBg);
            TextAlignment align = i == 0 ? TextAlignment.LEFT : TextAlignment.CENTER;
            cell.add(new Paragraph(values[i]).setFont(font).setFontSize(8).setTextAlignment(align));
            table.addCell(cell);
        }
    }

    private void addTableTotalRow(Table table, PdfFont font, DeviceRgb bg,
                                  String libelle, String base, String taux, String retenue, String gain) {
        String[] values = {libelle, base, taux, retenue, gain};
        for (int i = 0; i < values.length; i++) {
            Cell cell = new Cell().setPadding(8).setBorder(Border.NO_BORDER).setBackgroundColor(bg);
            TextAlignment align = i == 0 ? TextAlignment.LEFT : TextAlignment.CENTER;
            cell.add(new Paragraph(values[i]).setFont(font).setFontSize(9).setTextAlignment(align).setFontColor(new DeviceRgb(41, 98, 255)));
            table.addCell(cell);
        }
    }

    // ─── 4-column table helpers ─────────────────────────────────────

    private void addTableHeader4(Table table, PdfFont font, DeviceRgb bg, String... headers) {
        for (String h : headers) {
            Cell cell = new Cell().setBackgroundColor(bg).setPadding(7).setBorder(Border.NO_BORDER);
            cell.add(new Paragraph(h).setFont(font).setFontSize(8).setFontColor(ColorConstants.WHITE).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(cell);
        }
    }

    private void addTableRow4(Table table, PdfFont font, DeviceRgb bg, boolean alt,
                              String libelle, String base, String taux, String montant) {
        DeviceRgb rowBg = bg != null ? bg : (alt ? new DeviceRgb(250, 250, 252) : null);
        String[] values = {libelle, base, taux, montant};
        for (int i = 0; i < values.length; i++) {
            Cell cell = new Cell().setPadding(6).setBorder(Border.NO_BORDER);
            if (rowBg != null) cell.setBackgroundColor(rowBg);
            TextAlignment align = i == 0 ? TextAlignment.LEFT : TextAlignment.CENTER;
            cell.add(new Paragraph(values[i]).setFont(font).setFontSize(8).setTextAlignment(align));
            table.addCell(cell);
        }
    }

    private void addTableTotalRow4(Table table, PdfFont font, DeviceRgb bg,
                                   String libelle, String base, String taux, String montant) {
        String[] values = {libelle, base, taux, montant};
        for (int i = 0; i < values.length; i++) {
            Cell cell = new Cell().setPadding(8).setBorder(Border.NO_BORDER).setBackgroundColor(bg);
            TextAlignment align = i == 0 ? TextAlignment.LEFT : TextAlignment.CENTER;
            cell.add(new Paragraph(values[i]).setFont(font).setFontSize(9).setTextAlignment(align).setFontColor(new DeviceRgb(41, 98, 255)));
            table.addCell(cell);
        }
    }

    // ─── IR table helper ────────────────────────────────────────────

    private void addIrRow(Table table, PdfFont font, DeviceRgb bg, String label, String value) {
        Cell labelCell = new Cell().setPadding(6).setBorder(Border.NO_BORDER);
        if (bg != null) labelCell.setBackgroundColor(bg);
        labelCell.add(new Paragraph(label).setFont(font).setFontSize(8));
        table.addCell(labelCell);

        Cell valueCell = new Cell().setPadding(6).setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
        if (bg != null) valueCell.setBackgroundColor(bg);
        valueCell.add(new Paragraph(value + " MAD").setFont(font).setFontSize(8));
        table.addCell(valueCell);
    }

    // ─── Formatting helpers ─────────────────────────────────────────

    private String fmt(float value) {
        return String.format("%,.2f", value);
    }

    private String fmtPct(float rate) {
        return String.format("%.2f%%", rate * 100);
    }
}

