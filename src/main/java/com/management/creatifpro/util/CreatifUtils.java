package com.management.creatifpro.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class CreatifUtils {

    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static List<LocalDate> getDatesInRange(String startDateString, String endDateString) {

        // Parse the start and end dates
        LocalDate startDate = LocalDate.parse(startDateString, DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(endDateString, DATE_FORMATTER);

        // Create a list to hold the dates in range
        List<LocalDate> datesInRange = new ArrayList<>();

        // Iterate through the range of dates
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            datesInRange.add(date);
        }

        return datesInRange;
    }
}
