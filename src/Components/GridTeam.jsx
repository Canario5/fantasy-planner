import { logoNhl } from "./Logos"
import "./GridTeam.css"
import extraStyles from "../Styles/ExtraStyles"

export default function GridTeam(props) {
	const { teamId, halfWidth } = props

	let gamesPlayed = 0

	const days = props.schedule.map((oneDay, i) => {
		let homeAway = ""
		if (oneDay) gamesPlayed++

		if (oneDay > 0) homeAway = `grid-home`
		if (oneDay < 0) homeAway = `grid-away`

		return (
			<div
				key={i}
				className={`grid-team grid-col-${i} grid-${props.shortname} ${homeAway} `}
				style={halfWidth[i] ? extraStyles.HalfWidth : null}
			>
				{oneDay && (
					<img
						src={logoNhl[Math.abs(oneDay)]}
						className={`grid-logo grid-${props.shortname}`}
					/>
				)}
			</div>
		)
	})

	return (
		<div className={`grid-team-row grid-${props.shortname}`}>
			<div className={`grid-team-home grid-team grid-${props.shortname} grid-col-first`}>
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
