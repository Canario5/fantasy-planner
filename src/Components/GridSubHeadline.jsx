import "./GridSubHeadline.css"

export default function GridSubHeadline(props) {
	if (!props.teamsWithGame) return

	const subHeadline = props.teamsWithGame?.map((totalCount, i) => (
		<div
			onClick={() => console.log("Cambalam")}
			key={i}
			className={`grid-subheadliner grid-col-${i} subheadline-${i}`}
			style={
				props.halfWidth[i]
					? { width: "50%", transition: ".35s" }
					: { width: "100%", transition: ".7s" }
			}
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
