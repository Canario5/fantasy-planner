import { useEffect, useState } from "react"
import "./GridHeadline.css"

export default function GridHeadline() {
	const [date, setDate] = useState(0)

	useEffect(() => {
		const today = new Date()
		const dateText = `${today.getDate()}. ${today.toLocaleString("default", {
			month: "long",
		})}`
		setDate(() => dateText)
		console.log("its alive!")
	}, [])

	return (
		<div className="grid-headlines">
			<div className="headline-teams"></div>
			<div className="headline-mon"></div>
			<div className="headline-tue"></div>
			<div className="headline-wed"></div>
			<div className="headline-thu"></div>
			<div className="headline-fri"></div>
			<div className="headline-sat"></div>
			<div className="headline-sun"></div>
			<div className="headline-new"></div>
		</div>
	)
}
