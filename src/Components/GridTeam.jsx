import { useState, useEffect } from "react"

/* import HeadlineBox from "./HeadlineBox" */
import { logoNhl } from "./Logos"
import "./GridTeam.css"

export default function GridTeam(props) {
	const [days, setDays] = useState([])
	const { teamId } = props
	console.log(props)

	useEffect(() => {
		if (props.schedule && days.length !== props.schedule.length) {
			console.log("carstan")
			setDays(() => {
				return props.schedule.map((oneDay, i) => (
					<div key={i} className={`grid-team grid-${props.shortname}`}>
						<img
							src={logoNhl[oneDay]}
							className={`grid-logo grid-${props.shortname}`}
							alt={`${props.shortname} logo`}
						/>
					</div>
				))

				/* return props.schedule.map((oneDay, i) => (
				<div key={i} className={`grid-team-${props.shortname}`}>
					<div className="grid-headliner headline-box-team">Team</div>
					<div className={`grid-headliner headline-box-${i}`}>
						<img src={oneDay} alt="React Logo" />
					</div>
					<div className="grid-headliner headline-box-total">Total</div>
				</div>
			)) */
			})
		}
		console.log(days)
	})
	/* setDays((oldValues) => {
		console.log("team days start")

		if (oldValues?.length === props?.schedule?.length) return oldValues

		console.log("team days run")
		return props.schedule.map((oneDay, i) => (
			<div key={i} className={`grid-headliner headline-box-${i}`}>
				<img src={logoNhl[{ oneDay }]} alt="React Logo" />
			</div>
		))

		if (props.schedule) console.log("YES")
	}) */

	/* function addBox(number) {
		setHeadlineBoxes(() => console.log(number))
	}
	<HeadlineBox className="headline-new" toggle={() => addBox(2)}></HeadlineBox> */

	return (
		<div className={`grid-team-row grid-${props.shortname}`}>
			<div className={`grid-team-home grid-team grid-${props.shortname}`}>
				<img
					src={logoNhl[teamId]}
					className={`grid-logo grid-${props.shortname}`}
					alt={`${props.shortname} logo`}
				/>
			</div>
			{days}
			<div className={`grid-total grid-team grid-${props.shortname}`}>Total</div>
		</div>
	)
}
