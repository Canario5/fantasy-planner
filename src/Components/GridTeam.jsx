import { useEffect, useState } from "react"

import HeadlineBox from "./HeadlineBox"

import "./GridTeam.css"

export default function GridTeam(props) {
	const [dates, setDates] = useState([])

	function generateDays() {
		setHeadlineBoxes((oldValues) => {
			console.log("SetHeadlineBoxes() start")

			if (headlineBoxes?.length === dates?.length) return oldValues

			console.log("SetHeadlineBoxes() run")
			return dates.map((dateText, i) => (
				<HeadlineBox
					key={i}
					className={`grid-headliner headline-box-${i}`}
					dayDate={format(new Date(dateText), "d iii")}
				/>
			))
		})
	}

	/* function addBox(number) {
		setHeadlineBoxes(() => console.log(number))
	}
	<HeadlineBox className="headline-new" toggle={() => addBox(2)}></HeadlineBox> */

	return (
		<div className="grid-team-idname">
			<div className="grid-headliner headline-box-team">Team</div>
			{headlineBoxes}
			<div className="grid-headliner headline-box-total">Total</div>
		</div>
	)
}
