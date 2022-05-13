import { useEffect, useState } from "react"
import format from "date-fns/format"

import "./CurrentDate.css"

export default function CurrentDate() {
	const [date, setDate] = useState(0)

	useEffect(() => {
		setDate(() => format(new Date(), "PP"))
	}, [])

	return <div className="current-date">{date}</div>
}
