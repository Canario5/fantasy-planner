import format from "date-fns/format"

import HeadlineBox from "./HeadlineBox"

import "./GridHeadline.css"

export default function GridHeadline(props) {
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
