import SportMenu from "./SportMenu"
import ToolsMenu from "./ToolsMenu"

import "./Menu.css"

export default function Menu() {
	return (
		<div className="menu-main">
			<div className="menu-toggle">X</div>
			<div className="menu-bg">
				<div className="menu-logo">Raha</div>
			</div>

			<ToolsMenu />
		</div>
	)
}
