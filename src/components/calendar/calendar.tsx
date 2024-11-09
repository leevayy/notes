export function Calendar() {
  return (
    <div className="calendar">
      <span>⚠️</span>
      <p>calendar section will be here stay tuned</p>
      <span>⚠️</span>
    </div>
  );

  return (
    <div className="calendar">
      <ControlPanel></ControlPanel>
      <WeekView></WeekView>
    </div>
  );
}

function ControlPanel() {
  return (
    <div className="control-panel">
      <MiniCalendar></MiniCalendar>
    </div>
  );
}

function MiniCalendar() {
  return <div className="mini-calendar"></div>;
}

function WeekView() {
  return <div className="week-view"></div>;
}
