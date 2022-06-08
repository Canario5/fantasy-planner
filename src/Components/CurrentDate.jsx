import "./CurrentDate.css"

export default function CurrentDate(props) {
	function forceRefresh() {
		props.setRefresh(true)
		console.log(props.refresh)
	}

	return (
		<div className="current-date-block">
			<div className="prev-week">Prev Week</div>
			<div className="next-week">Next Week</div>
			<div onClick={forceRefresh} className="current-date">{`Week ${props.week}`}</div>
			<div className="add-day">Add Day</div>
			<div className="add-week">Add Week</div>
		</div>
	)
}
