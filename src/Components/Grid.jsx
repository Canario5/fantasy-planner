import { useState, useEffect } from "react"
import isMonday from "date-fns/isMonday"
import previousMonday from "date-fns/previousMonday"
import format from "date-fns/format"
import add from "date-fns/add"
import eachDayOfInterval from "date-fns/eachDayOfInterval"
import getWeek from "date-fns/getWeek"

import GridHeadline from "./GridHeadline"
import GridTeam from "./GridTeam"
import CurrentDate from "../Components/CurrentDate"
import TeamsNhl from "./TeamsNhl"

import "./Grid.css"

export default function Grid() {
	const [dates, setDates] = useState([])
	const [teamData, setTeamData] = useState()
	const [schedule, setSchedule] = useState()

	const [gridData, setGridData] = useState()
	const [gridEle, setGridEle] = useState()
	/* 	const [num, setNum] = useState(false) */
	const [refresh, setRefresh] = useState(false)

	useEffect(() => {
		console.log("useEffect #1")
		const currentWeek = getDate()
		const lastUpdate = localStorage.getItem("lastUpdate") || []
		setDates(currentWeek)

		if (currentWeek.indexOf(lastUpdate) === -1) {
			console.log("test")
			setTeamData(getIds())
			setSchedule(getGameDates())
		} else {
			const storedTeamData = new Map(JSON.parse(localStorage.getItem("teamNames")))
			setTeamData(storedTeamData)

			const storedSchedule = new Map(JSON.parse(localStorage.getItem("schedule")))
			setSchedule(storedSchedule)
		}
	}, [])

	useEffect(() => {
		console.log("useEffect #2")
		if (teamData?.size > 0 && schedule?.size > 0) {
			console.log(schedule)
			console.log(dates)

			const daysWithGame = dates.map((date) => {
				if (schedule.has(date)) return schedule.get(date)

				return false
			})

			const tempMap = new Map()
			teamData.forEach((value, key) => tempMap.set(key, new Array()))
			console.log(daysWithGame)

			daysWithGame.map((day) => {
				// VALIDATE
				if (day === false) {
					tempMap.forEach((value, key) => tempMap.set(key, [...value, 9999]))
					return
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
			setGridData(tempMap)
		}
	}, [dates, teamData, schedule])

	useEffect(() => {
		console.log("useEffect #3")
		if (gridData?.size > 0) {
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
	}, [gridData])

	/* if (localStorage.getItem("teamNames") === null || refresh) {
			getIds()
			console.log("Refreshujeme")
			setRefresh(false)
		} */

	/* if (localStorage.getItem("teamNames") !== null) {
			console.log("LOADER")
			setTeamData(new Map(JSON.parse(localStorage.getItem("teamNames"))))
			console.log(teamData)
		}
		console.log(teamData) */

	/* if (localStorage.getItem("schedule") === null) {
			getGameDates()
		} */

	/* if (localStorage.getItem("schedule") !== null) {
			setSchedule(() => new Map(JSON.parse(localStorage.getItem("schedule"))))
		} */

	/* async function getIds() {
		const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
		const data = await res.json()

		const iteData = data.teams.map((teamData) => {
			return [teamData.id, teamData.abbreviation]
		})
		const newData = new Map(iteData.sort((a, b) => String(a[1]).localeCompare(b[1])))

		setTeamData(() => newData)
		localStorage.setItem("teamNames", JSON.stringify([...newData]))
	} */

	/* async function getGameDates() {
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
	} */

	return (
		<div className="grid">
			<CurrentDate
				week={getWeek(new Date(dates[0]), { weekStartsOn: 1 })}
				refresh={refresh}
				setRefresh={setRefresh}
			/>
			<GridHeadline dates={dates}></GridHeadline>
			<GridHeadline dates={dates}></GridHeadline>

			{gridEle}
		</div>
	)
}

function getDate() {
	const today = new Date()
	const monday = isMonday(today) ? today : previousMonday(today)
	const sunday = add(monday, { days: 6 })

	return eachDayOfInterval({ start: monday, end: sunday }).map((day) =>
		format(day, "yyyy-MM-dd")
	)
}

async function getIds() {
	const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
	const data = await res.json()

	const iteData = data.teams.map((teamData) => {
		return [teamData.id, teamData.abbreviation]
	})

	const sortedData = new Map(iteData.sort((a, b) => String(a[1]).localeCompare(b[1])))
	localStorage.setItem("teamNames", JSON.stringify([...sortedData]))

	console.log(sortedData)
	return sortedData
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

	localStorage.setItem("schedule", JSON.stringify([...matchdates]))
	localStorage.setItem("lastUpdate", format(new Date(), "yyyy-MM-dd"))
	console.log(matchdates)
	return matchdates
}
