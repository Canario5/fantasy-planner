import { useEffect, useState } from "react"
/* import { formatDistance, subDays } from "date-fns" */
import format from "date-fns/format"

import "./CurrentDate.css"

export default function CurrentDate() {
	const [date, setDate] = useState(0)

	useEffect(() => {
		/* const today = new Date()
		const dateText = `${today.getDate()}. ${today.toLocaleString("default", {
			month: "long",
		})}`
		setDate(() => dateText) */

		setDate(() => format(new Date(), "PP")) //=> '6. listopad'

		console.log("its alive!")
	}, [])

	return <div className="current-date">{date}</div>
}
