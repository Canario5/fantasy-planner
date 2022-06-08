import { logoNhl } from "./Logos"
import "./GridTeam.css"

export default function GridTeam(props) {
	const { teamId } = props

	const days = props.schedule.map((oneDay, i) => (
		<div key={i} className={`grid-team grid-col-${i} grid-${props.shortname}`}>
			<img
				src={logoNhl[oneDay]}
				className={`grid-logo grid-${props.shortname}`}
				alt={`${props.shortname} logo`}
			/>
		</div>
	))

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
					title={`${props.shortname}`}
				/>
			</div>
			{days}
			<div className={`grid-total grid-team grid-${props.shortname}`}>Total</div>
		</div>
	)
}
