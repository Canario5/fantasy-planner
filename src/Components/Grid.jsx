import { useState } from "react"
import GridHeadline from "./GridHeadline"
import TeamsNhl from "./TeamsNhl"

import { logoNhl } from "./Logos"

import "./Grid.css"

export default function Grid() {
	const [headlineBoxes, setHeadlineBoxes] = useState()

	return (
		<div className="grid">
			<GridHeadline></GridHeadline>

			<img src={logoNhl[10]} alt="React Logo" />
			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>
			<TeamsNhl />

			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>

			<img src={logoNhl[52]} alt="React Logo" />
		</div>
	)
}
