import { useEffect, useState } from "react"
import format from "date-fns/format"

import "./CurrentDate.css"

export default function CurrentDate() {
	const [date, setDate] = useState(0)

	useEffect(() => {
		setDate(() => format(new Date(), "PP"))
	}, [])

	return (
		<div className="current-date-block">
			<div className="prev-week">Prev Week</div>
			<div className="next-week">Next Week</div>
			<div className="current-date">{date}</div>
			<div className="add-day">Add Day</div>
			<div className="add-week">Add Week</div>
		</div>
	)
}
