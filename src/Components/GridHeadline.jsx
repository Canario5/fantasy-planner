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
		if (!dates?.length) {
			const today = new Date()
			const monday = isMonday(today) ? today : previousMonday(today)
			const sunday = add(monday, { days: 6 })

			setDates(() => eachDayOfInterval({ start: monday, end: sunday }))
		}

		console.log(dates)
		generateBoxes()

		console.log(headlineBoxes)
		/*
		console.log(dates.length) */
	}, [dates])

	function generateBoxes() {
		setHeadlineBoxes((oldValues) => {
			console.log("SetHeadlineBoxes() start")

			console.log(oldValues?.length + " vs " + dates?.length)
			if (headlineBoxes?.length === dates?.length) return oldValues

			console.log("SetHeadlineBoxes() run")
			return dates.map((dateText, i) => (
				<HeadlineBox
					key={i}
					className={`headline-box-${i}`}
					dayDate={format(dateText, "d iii")}
				/>
			))
		})
	}

	/* function addBox(number) {
		setHeadlineBoxes(() => console.log(number))
	}
	<HeadlineBox className="headline-new" toggle={() => addBox(2)}></HeadlineBox> */

	return (
		<>
			<div className="headline-box-team">Team</div>
			{headlineBoxes}
			<div className="headline-box-last">Add</div>
		</>
	)
}
