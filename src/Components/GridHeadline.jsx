import { useEffect, useState } from "react"
import isMonday from "date-fns/isMonday"
import previousMonday from "date-fns/previousMonday"
import format from "date-fns/format"
import add from "date-fns/add"
import eachDayOfInterval from "date-fns/eachDayOfInterval"

import HeadlineBox from "./HeadlineBox"

import "./GridHeadline.css"

export default function GridHeadline() {
	const [dates, setDates] = useState([])
	const [headlineBoxes, setHeadlineBoxes] = useState()

	useEffect(() => {
		if (dates?.length === 0) {
			const today = new Date()
			const monday = isMonday(today) ? today : previousMonday(today)
			const sunday = add(monday, { days: 6 })

			setDates(() =>
				eachDayOfInterval({ start: monday, end: sunday }).map((day) =>
					format(day, "yyyy-MM-dd")
				)
			)
		}

		console.log(dates)
		generateBoxes()
	}, [dates])

	function generateBoxes() {
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
		<div className="grid-headline">
			<div className="grid-headliner headline-box-team">Team</div>
			{headlineBoxes}
			<div className="grid-headliner headline-box-total">Total</div>
		</div>
	)
}
