type HeaderItemProps = {
  name: string;
  content?: React.ReactNode;
  align?: "left" | "right" | "center";
};

export function HeaderItem(props: HeaderItemProps) {
  return <div className="menu-item-content">{props.content}</div>;
}

type HeaderProps = React.ComponentPropsWithoutRef<"ul"> & {
  items: HeaderItemProps[];
};

export function Header(props: HeaderProps) {
  const sortedProps = {
    left: props.items.filter((el) => el.align === "left" || !el.align),
    center: props.items.filter((el) => el.align === "center"),
    right: props.items.filter((el) => el.align === "right"),
  };

  return (
    <ul className="menu">
      {sortedProps.left.length !== 0 && (
        <li className="left menu-item">
          {sortedProps.left.map((props, i) => (
            <HeaderItem key={props.name + i} {...props}></HeaderItem>
          ))}
        </li>
      )}
      {sortedProps.center.length !== 0 && (
        <li className="center menu-item">
          {sortedProps.center.map((props, i) => (
            <HeaderItem key={props.name + i} {...props}></HeaderItem>
          ))}
        </li>
      )}
      {sortedProps.right.length !== 0 && (
        <li className="right menu-item">
          {sortedProps.right.map((props, i) => (
            <HeaderItem key={props.name + i} {...props}></HeaderItem>
          ))}
        </li>
      )}
    </ul>
  );
}
