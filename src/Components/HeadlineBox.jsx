import { useState } from "react"
import format from "date-fns/format"

import "./HeadlineBox.css"

export default function HeadlineBox(props) {
	const [date, setDate] = useState(0)

	return (
		<div className={props.className} onClick={() => console.log("Bambalam")}>
			{props.dayDate}
		</div>
	)
}
