import { useState } from "react"

export default function TeamsNhl() {
	const [num, setNum] = useState(false)

	const klikuj = () => setNum(true)

	return (
		<div
			style={{ backgroundColor: "beige", color: "black", width: "100px" }}
			onClick={klikuj}
			className="headline-box-team"
		>
			Refresh API Button
		</div>
	)
}
