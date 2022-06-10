import { logoNhl } from "./Logos"
import "./GridTeam.css"

export default function GridTeam(props) {
	const { teamId } = props
	let gamesPlayed = 0

	const days = props.schedule.map((oneDay, i) => {
		let homeAway = ""
		oneDay < 9999 && gamesPlayed++
		if (oneDay !== 9999 && oneDay > 0) homeAway = `grid-home`
		if (oneDay !== 9999 && oneDay < 0) homeAway = `grid-away`

		return (
			<div
				key={i}
				className={`grid-team grid-col-${i} grid-${props.shortname} ${homeAway}`}
			>
				<img
					src={logoNhl[Math.abs(oneDay)]}
					className={`grid-logo grid-${props.shortname}`}
				/>
			</div>
		)
	})

	/* function addBox(number) {
		setHeadlineBoxes(() => console.log(number))
	}
	<HeadlineBox className="headline-new" toggle={() => addBox(2)}></HeadlineBox> */

	return (
		<div className={`grid-team-row grid-${props.shortname} grid-col-first`}>
			<div className={`grid-team-home grid-team grid-${props.shortname}`}>
				<img
					src={logoNhl[teamId]}
					className={`grid-logo grid-${props.shortname}`}
					alt={`${props.shortname} logo`}
					title={`${props.shortname}`}
				/>
			</div>
			{days}
			<div className={`grid-total grid-team grid-${props.shortname} grid-col-last`}>
				{gamesPlayed}
			</div>
		</div>
	)
}
