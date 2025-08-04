<?php

namespace Database\Seeders\Traits;

use Illuminate\Support\Facades\File;

trait CsvImportTrait
{
    /**
     * Imports a CSV file applying $callback row by row.
     * Returns the number of processed rows.
     */
    protected function importCSV(
        string $csvFile,
        string $delimiter,
        callable $callback,
        $console = null
    ): int {
        if (!File::exists($csvFile)) {
            $console?->error("CSV file not found: $csvFile")
                ?: print ("CSV file not found: $csvFile\n");
            return 0;
        }

        $handle = fopen($csvFile, 'r');
        if (!$handle) {
            $console?->error("Could not open CSV: $csvFile")
                ?: print ("Could not open CSV: $csvFile\n");
            return 0;
        }

        $header = fgetcsv($handle, 0, $delimiter);
        if (!$header) {
            $console?->error("CSV header not readable.")
                ?: print ("CSV header not readable.\n");
            fclose($handle);
            return 0;
        }

        $header = array_map('trim', $header);
        $count = 0;

        while ($row = fgetcsv($handle, 0, $delimiter)) {
            if (count($row) !== count($header)) {
                continue;
            }
            $data = array_combine($header, array_map('trim', $row));

            if ($callback($data)) {
                $count++;
            }
        }

        fclose($handle);
        return $count;
    }
}
