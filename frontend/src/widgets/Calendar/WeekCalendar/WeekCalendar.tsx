import { DateTime } from "@gravity-ui/date-utils";
import { Card, Col, Flex, Row, Text } from "@gravity-ui/uikit";
import React from "react";

import styles from "./WeekCalendar.module.css";

interface WeekCalendarProps {
  date: DateTime;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({ date }) => {
  const currentDayOfWeek = date.weekday();

  const startDay = date.subtract(currentDayOfWeek, "days");

  const week = Array.from({ length: 7 }, (_, i) => startDay.add(i, "days"));

  return (
    <Flex style={{ width: "100%" }}>
      <Col
        style={{
          backgroundColor: "var(--g-color-base-brand)",
          borderRadius: "var(--g-border-radius-l)",
        }}
        className={styles.column}
      >
        <Row space={0}>
          <Flex
            alignItems="flex-end"
            justifyContent="flex-end"
            className={styles.timeHeader}
          >
            <Text variant="body-1" color="hint">
              {date.timeZone()}
            </Text>
          </Flex>
        </Row>
      </Col>
      {week.map((day) => (
        <Col
          key={String(day.toDate())}
          className={styles.column}
          style={{
            borderRight: "1px solid var(--g-color-base-brand)",
          }}
        >
          <Row space={0}>
            <Card className={styles.dayHeader} view="filled">
              <Flex direction="column" centerContent={true}>
                <div>{day.format("ddd").toLocaleUpperCase()}</div>
                <div>{day.format("DD")}</div>
              </Flex>
            </Card>
          </Row>
        </Col>
      ))}
    </Flex>
  );
};
