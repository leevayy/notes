import { Calendar as GravityCalendar } from "@gravity-ui/date-components";
import { DateTime, dateTimeParse } from "@gravity-ui/date-utils";
import { Flex } from "@gravity-ui/uikit";
import React from "react";

// import styles from "./Calendar.module.css";
import { WeekCalendar } from "./WeekCalendar/WeekCalendar";

interface CalendarProps {}

export const Calendar: React.FC<CalendarProps> = () => {
  const [selectedDate, setSelectedDate] = React.useState<DateTime | null>(null);

  return (
    <Flex style={{ border: "1px solid gray", height: "50%", width: "100%" }}>
      <GravityCalendar
        value={selectedDate}
        onUpdate={(date) => {
          setSelectedDate(date);
        }}
        // onBlur={() => setSelectedDate(null)}
      />
      <WeekCalendar date={selectedDate ?? dateTimeParse(Date.now())!} />
    </Flex>
  );
};
