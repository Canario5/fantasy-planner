import { useState } from "react"

import format from "date-fns/format"

import "./GridHeadline.css"
import { el } from "date-fns/locale"

export default function GridHeadline(props) {
	if (!props.dates) return

	/* const [halfWidth, setHalfWidth] = useState(false) */

	/* 	const columnPos = (event) => {
		const headlineEle = [...document.querySelector(".grid-headline").children].slice(1, -1)
		console.log(headlineEle.indexOf(event.target))
		return headlineEle.indexOf(event.target)
	} */

	const headlineBoxes = props.dates?.map((day, i) => (
		<div
			key={i}
			className={`grid-headliner grid-col-${i} headline-box-${i}`}
			/* onClick={props.handleHalfWidth} */
			onContextMenu={(event) => props.handleHalfWidth(event, i)}
			style={
				props.halfWidth[i]
					? { width: "50%", transition: ".35s" }
					: { width: "100%", transition: ".7s" }
			}
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
