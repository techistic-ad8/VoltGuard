package com.example.app.service;

import com.example.app.entity.Meter;
import com.example.app.repository.MeterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.zip.GZIPInputStream;

@Service
public class CsvImportService implements CommandLineRunner {

    private final MeterRepository meterRepository;
    private final MeterService meterService;

    public CsvImportService(MeterRepository meterRepository, MeterService meterService) {
        this.meterRepository = meterRepository;
        this.meterService = meterService;
    }

    @Override
    public void run(String... args) throws Exception {
        String csvGzPath = "D:\\MVVNL_DIV392263_APR_2026.csv.gz";

        System.out.println("--- Starting CSV Data Import from: " + csvGzPath + " ---");

        // Check if database is already populated so we don't duplicate on every startup
        if (meterRepository.count() > 0) {
            System.out.println("Database already contains meters. Skipping CSV import.");
            return;
        }

        try (FileInputStream fileStream = new FileInputStream(csvGzPath);
                GZIPInputStream gzipStream = new GZIPInputStream(fileStream);
                InputStreamReader decoder = new InputStreamReader(gzipStream, "UTF-8");
                BufferedReader reader = new BufferedReader(decoder)) {

            String headerLine = reader.readLine(); // Read header line
            if (headerLine == null)
                return;

            // Find column indices
            String[] headers = headerLine.split(",");
            int meterBadgeIdx = -1;
            int consumptionIdx = -1;

            for (int i = 0; i < headers.length; i++) {
                String cleanHeader = headers[i].replace("\"", "").trim();
                if (cleanHeader.equals("METER_BADGE_NO"))
                    meterBadgeIdx = i;
                if (cleanHeader.equals("CONSUMPTION_KWH"))
                    consumptionIdx = i;
            }

            if (meterBadgeIdx == -1 || consumptionIdx == -1) {
                System.err.println("Required columns METER_BADGE_NO or CONSUMPTION_KWH not found!");
                return;
            }

            String line;
            int count = 0;
            // Read line-by-line (Streaming)
            while ((line = reader.readLine()) != null && count < 100) { // Limit to 100 records for testing first!
                String[] values = line.split(",");
                if (values.length <= Math.max(meterBadgeIdx, consumptionIdx))
                    continue;

                String meterId = values[meterBadgeIdx].replace("\"", "").trim();
                String consumptionRaw = values[consumptionIdx].replace("\"", "").trim();

                if (meterId.isEmpty() || meterId.equals("NULL"))
                    continue;

                double monthlyConsumption = 0.0;
                try {
                    monthlyConsumption = Double.parseDouble(consumptionRaw);
                } catch (NumberFormatException e) {
                    // Ignore invalid format, default to 0
                }

                double dailyBaselineKwh = monthlyConsumption / 30.0;
                if (dailyBaselineKwh <= 0)
                    dailyBaselineKwh = 5.0; // Default fallback

                Meter meter = new Meter(meterId, "ACTIVE", dailyBaselineKwh);
                meterRepository.save(meter);

                double voltage = 230.0;
                double averageCurrent = (dailyBaselineKwh / 24.0 * 1000.0) / voltage; // in Amps
                if (averageCurrent < 0.1)
                    averageCurrent = 0.5;

                double phaseCurrent = averageCurrent;
                double neutralCurrent = averageCurrent;

                // Let's inject a simulated Tampering Anomaly into 10% of the meters to test our
                // engine!
                if (count % 10 == 0) {
                    phaseCurrent = averageCurrent * 0.1; // Physical bypass
                }

                meterService.processMeterPing(meterId, dailyBaselineKwh, voltage, phaseCurrent, neutralCurrent);
                count++;
            }

            System.out.println("--- Imported " + count + " meters and simulated pings successfully! ---");

        } catch (Exception e) {
            System.err.println("Error importing CSV data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}