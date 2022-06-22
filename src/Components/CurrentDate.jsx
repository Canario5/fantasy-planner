import "./CurrentDate.css"

export default function CurrentDate(props) {
	return (
		<div className="current-date-block">
			<div onClick={props.prevWeek} className="prev-week">
				Prev Week
			</div>

			<div onClick={props.nextWeek} className="next-week">
				Next Week
			</div>

			<div
				onClick={() => props.setForceRefresh(true)}
				className="current-date"
			>{`${props.month}`}</div>

			<div onClick={props.removeDay} className="remove-day">
				Remove Day
			</div>

			<div onClick={props.addDay} className="add-day">
				Add Day
			</div>
		</div>
	)
}
