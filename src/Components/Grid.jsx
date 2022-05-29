import { useState, useEffect } from "react"
import GridHeadline from "./GridHeadline"
import TeamsNhl from "./TeamsNhl"

import { logoNhl } from "./Logos"

import "./Grid.css"

export default function Grid() {
	const [schedule, setSchedule] = useState(new Map())
	const [num, setNum] = useState(false)

	useEffect(() => {
		console.log("DuckDuck")

		async function getGameDates() {
			// NHL Season 2021-22 startdate is 12 October 2021; end of regular season 1 may 2022; playoff end during june 2022
			const res = await fetch(
				"https://statsapi.web.nhl.com/api/v1/schedule?startDate=2021-10-11&endDate=2022-05-01"
			) // YYYY-MM-DD
			const data = await res.json()

			const matchdates = new Map()
			const newData = data.dates.map((day) => {
				const home = []
				const away = []
				const matches = { home: home, away: away }
				day.games.forEach((gamePlayed) => {
					home.push(gamePlayed.teams.home.team.id)
					away.push(gamePlayed.teams.away.team.id)
				})

				matchdates.set(day.date, matches)
			})
			console.log(matchdates)

			localStorage.setItem("schedule", JSON.stringify([...matchdates]))
			setSchedule(() => matchdates)
		}

		if (localStorage.getItem("schedule") === null) {
			getGameDates()
		}

		if (localStorage.getItem("schedule") !== null) {
			setSchedule(() => new Map(JSON.parse(localStorage.getItem("schedule"))))
			console.log(schedule)
		}
	}, [])

	return (
		<div className="grid">
			<GridHeadline></GridHeadline>

			<img src={logoNhl[10]} alt="React Logo" />
			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>
			<TeamsNhl />

			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<img src={logoNhl[9999]} alt="React Logo" />
			<div className="headline-box-team"></div>

			<img src={logoNhl[52]} alt="React Logo" />
		</div>
	)
}
