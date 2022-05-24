import CurrentDate from "../Components/CurrentDate"
import Grid from "../Components/Grid"
import "./Main.css"

export default function Main() {
	return (
		<main>
			<div className="main-container">
				<CurrentDate />

				<Grid />
			</div>
		</main>
	)
}
