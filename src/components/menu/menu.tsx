type MenuItemProps = {
  name: string;
  icon?: React.FunctionComponent;
  text?: string;
  align?: "left" | "right" | "center";
};

export function MenuItem(props: MenuItemProps) {
  function itemContent(icon: MenuItemProps["icon"], text: MenuItemProps["text"]) {
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
      <button className="menu-item-content">{itemContent(props.icon, props.text)}</button>
  );
}

type MenuProps = React.ComponentPropsWithoutRef<"ul"> & {
  items: MenuItemProps[];
};

export function Menu(props: MenuProps) {
	const sortedProps = {
		left: props.items.filter((el) => el.align === "left" || !el.align),
		center: props.items.filter((el) => el.align === "center"),
		right: props.items.filter((el) => el.align === "right")
	}

  return (
    <ul className="menu">
      {sortedProps.left.length !== 0 && (
				<li className="left menu-item">{sortedProps.left.map((props, i) => <MenuItem key={props.name + i} { ...props}></MenuItem>)}</li>
			)}
      {sortedProps.center.length !== 0 && (
        <li className="center menu-item">{sortedProps.center.map((props, i) => <MenuItem key={props.name + i} {...props}></MenuItem>)}</li>
      )}
      {sortedProps.right.length !== 0 && (
        <li className="right menu-item">{sortedProps.right.map((props, i) => <MenuItem key={props.name + i} {...props}></MenuItem>)}</li>
      )}
    </ul>
  );
}
