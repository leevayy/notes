type HeaderItemProps = {
  name: string;
  icon?: React.FunctionComponent;
  text?: string;
  align?: "left" | "right" | "center";
};

export function HeaderItem(props: HeaderItemProps) {
  function itemContent(
    icon: HeaderItemProps["icon"],
    text: HeaderItemProps["text"],
  ) {
    if (icon) {
      const IconComponent = icon;

      return <IconComponent />;
    }

    if (text) {
      return <h1 className="board-name">{text}</h1>;
    }

    return;
  }

  return (
    <button className="menu-item-content">
      {itemContent(props.icon, props.text)}
    </button>
  );
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
