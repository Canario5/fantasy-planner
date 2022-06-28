import format from "date-fns/format"

import "./GridHeadline.css"
import extraStyles from "../Styles/ExtraStyles"

export default function GridHeadline(props) {
	if (!props.dates) return

	const headlineBoxes = props.dates?.map((day, i) => (
		<div
			key={i}
			className={`grid-headliner grid-col-${i} headline-box-${i}`}
			/* onClick={props.handleHalfWidth} */
			onContextMenu={(event) => props.handleHalfWidth(event, i)}
			style={props.halfWidth[i] ? extraStyles.HalfWidth : null}
		>
			{format(new Date(day), "d iii")}
		</div>
	))

	return (
		<div className="grid-headline">
			<div onClick={props.prevDay} className="grid-headliner grid-col-first">
				{"<"}
			</div>
			{headlineBoxes}
			<div onClick={props.nextDay} className="grid-headliner grid-col-last">
				{">"}
			</div>
		</div>
	)
}
