/* import { useEffect, useState } from "react" */
import format from "date-fns/format"

import HeadlineBox from "./HeadlineBox"

import "./GridHeadline.css"

export default function GridHeadline(props) {
	/* const [dates, setDates] = useState([]) */
	/* const [headlineBoxes, setHeadlineBoxes] = useState() */

	/* 	generateBoxes() */
	/* function addBox(number) {
		setHeadlineBoxes(() => console.log(number))
	}
	<HeadlineBox className="headline-new" toggle={() => addBox(2)}></HeadlineBox> */

	if (!props.dates) return
	const headlineBoxes = props.dates?.map((day, i) => (
		<HeadlineBox
			key={i}
			className={`grid-headliner grid-col-${i} headline-box-${i}`}
			dayDate={format(new Date(day), "d iii")}
		/>
	))

	return (
		<div className="grid-headline">
			<div className="grid-headliner grid-col-first">Team</div>
			{headlineBoxes}
			<div className="grid-headliner grid-col-last">Total</div>
		</div>
	)
}
