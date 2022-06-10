import "./GridSubHeadline.css"

export default function GridSubHeadline(props) {
	let totalCount = 0

	if (!props.matchesPerDay) return
	const subHeadline = props.matchesPerDay?.map((totalCount, i) => (
		<div
			onClick={() => console.log("Cambalam")}
			key={i}
			className={`grid-subheadliner grid-col-${i} subheadline-${i}`}
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
