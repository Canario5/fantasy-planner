import "./HeadlineBox.css"

export default function HeadlineBox(props) {
	return (
		<div className={props.className} onClick={() => console.log("Bambalam")}>
			{props.dayDate}
		</div>
	)
}
