import { useState } from "react"
import GridHeadline from "./GridHeadline"
import HeadlineBox from "./HeadlineBox"

import "./Grid.css"

export default function Grid() {
	const [headlineBoxes, setHeadlineBoxes] = useState()

	return (
		<div className="grid">
			<GridHeadline></GridHeadline>
			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>

			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>

			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>
		</div>
	)
}
