type MenuItemProps = {
	name: string;
	icon: React.FunctionComponent;
}

export function MenuItem(props: MenuItemProps) {
	function itemImage(icon: MenuItemProps["icon"]) {
		const IconComponent = icon;
		return <IconComponent />;
	}


	return (
		<li className='menu-item'>
			<button className="menu-item-icon">
				{itemImage(props.icon)}
			</button>
		</li>
	);
}

type MenuProps = React.ComponentPropsWithoutRef<'ul'>;

export function Menu(props: MenuProps) {
	return (
		<ul className='menu'>
			{props.children}
		</ul>
	);
}