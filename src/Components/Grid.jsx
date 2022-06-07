import { useState, useEffect } from "react"
import isMonday from "date-fns/isMonday"
import previousMonday from "date-fns/previousMonday"
import format from "date-fns/format"
import add from "date-fns/add"
import eachDayOfInterval from "date-fns/eachDayOfInterval"

import GridHeadline from "./GridHeadline"
import GridTeam from "./GridTeam"
import CurrentDate from "../Components/CurrentDate"
import TeamsNhl from "./TeamsNhl"

import { logoNhl } from "./Logos"

import "./Grid.css"

export default function Grid() {
	const [dates, setDates] = useState([])
	const [gridData, setGridData] = useState()
	const [gridEle, setGridEle] = useState()
	const [teamData, setTeamData] = useState(new Map())
	const [schedule, setSchedule] = useState(new Map())
	const [num, setNum] = useState(false)

	/* if (schedule.size !== 0) {
	} */

	async function getIds() {
		const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
		const data = await res.json()

		const iteData = data.teams.map((teamData) => {
			return [teamData.id, teamData.abbreviation]
		})
		const newData = new Map(iteData.sort((a, b) => String(a[1]).localeCompare(b[1])))

		setTeamData(() => newData)
		localStorage.setItem("teamNames", JSON.stringify([...newData]))
	}

	async function getGameDates() {
		// NHL Season 2021-22 startdate is 12 October 2021; end of regular season 1 may 2022; playoff end during june 2022
		const res = await fetch(
			"https://statsapi.web.nhl.com/api/v1/schedule?startDate=2021-10-11&endDate=2022-07-01"
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

	useEffect(() => {
		if (dates.length === 0) {
			const today = new Date()
			const monday = isMonday(today) ? today : previousMonday(today)
			const sunday = add(monday, { days: 6 })

			setDates(() =>
				eachDayOfInterval({ start: monday, end: sunday }).map((day) =>
					format(day, "yyyy-MM-dd")
				)
			)

			console.log(dates)
		}

		if (localStorage.getItem("teamNames") === null || num) {
			getIds()
		}

		if (localStorage.getItem("teamNames") !== null) {
			setTeamData(() => new Map(JSON.parse(localStorage.getItem("teamNames"))))
		}
		console.log(teamData)

		if (localStorage.getItem("schedule") === null) {
			getGameDates()
		}

		if (localStorage.getItem("schedule") !== null) {
			setSchedule(() => new Map(JSON.parse(localStorage.getItem("schedule"))))
		}

		if (teamData.size > 0) {
			console.log(schedule)
			console.log(dates)

			setGridData(() => {
				/* if (oldValue.size === teamData.size) return oldValue */

				const activeDates = dates.map((date) => {
					if (schedule.has(date)) return schedule.get(date)

					return false
				})

				const tempMap = new Map()
				teamData.forEach((value, key) => tempMap.set(key, new Array()))

				activeDates.map((day) => {
					// VALIDATE
					if (day === false) {
						tempMap.forEach((value, key) => tempMap.set(key, [...value, 9999]))
					}

					// prettier-ignore
					tempMap.forEach((value, key) => {
						if (day.home.indexOf(key) === -1){
							tempMap.set(key, [...value, 9999])
							return
						}
	
						tempMap.set(key, [...value, day.away[day.home.indexOf(key)]])
					})
				})
				console.log(tempMap)
				return tempMap
			})
		}

		function generateGridEle() {
			if (gridData) {
				console.log("bambalam")
				console.log(gridData)
				console.log(teamData)

				setGridEle((old) => {
					let data = []
					gridData.forEach((value, key) =>
						data.push(
							<GridTeam
								key={key}
								teamId={key}
								shortname={teamData.get(key)}
								schedule={value}
							/>
						)
					)
					console.log(data)
					return data
				})
			}
			console.log(gridEle)
		}
		generateGridEle()
	}, [])

	return (
		<div className="grid">
			<CurrentDate />
			<GridHeadline></GridHeadline>
			<GridHeadline></GridHeadline>

			{/* <img src={logoNhl[10]} alt="React Logo" />
			<div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team"></div>
			<GridTeam />
			<GridTeam
				key={2}
				
				schedule={[
					logoNhl[9999],
					logoNhl[1],
					logoNhl[9999],
					logoNhl[22],
					logoNhl[21],
					logoNhl[9999],
				]}
			/>
		
			<TeamsNhl /> */}
			{gridEle}

			{/* <div className="headline-box-team">Team Name</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<div className="headline-box-team">Team</div>
			<img src={logoNhl[9999]} alt="React Logo" />
			<div className="headline-box-team"></div>

			<img src={logoNhl[52]} alt="React Logo" /> */}
		</div>
	)
}
