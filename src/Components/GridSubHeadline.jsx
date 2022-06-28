import "./GridSubHeadline.css"
import extraStyles from "../Styles/ExtraStyles"

export default function GridSubHeadline(props) {
	if (!props.teamsWithGame) return

	const subHeadline = props.teamsWithGame?.map((totalCount, i) => (
		<div
			onClick={() => console.log("Cambalam")}
			key={i}
			className={`grid-subheadliner grid-col-${i} subheadline-${i}`}
			style={props.halfWidth[i] ? extraStyles.HalfWidth : null}
		>
			{totalCount}
		</div>
	))

	return (
		<div className="grid-subheadline">
			<div className="grid-subheadliner grid-col-first">Team</div>
			{subHeadline}
			<div className="grid-subheadliner grid-col-last">Tot</div>
		</div>
	)
}
