import { useState, useEffect } from "react"
import isMonday from "date-fns/isMonday"
import previousMonday from "date-fns/previousMonday"
import format from "date-fns/format"
import add from "date-fns/add"
import eachDayOfInterval from "date-fns/eachDayOfInterval"
import getWeek from "date-fns/getWeek"

import GridHeadline from "./GridHeadline"
import GridSubHeadline from "./GridSubHeadline"
import GridTeam from "./GridTeam"
import CurrentDate from "../Components/CurrentDate"
import TeamsNhl from "./TeamsNhl"

import "./Grid.css"

export default function Grid() {
	const [dates, setDates] = useState([])
	const [teamData, setTeamData] = useState(new Map())
	const [schedule, setSchedule] = useState(new Map())

	/* const [gridData, setGridData] = useState()
	 */
	/* 	const [num, setNum] = useState(false) */
	const [forceRefresh, setForceRefresh] = useState(false)
	const [matchesPerDay, setMatchesPerDay] = useState(false)

	const [gridEle, setGridEle] = useState(
		Array(32).fill(<GridTeam schedule={[9999, 9999, 9999, 9999, 9999, 9999, 9999]} />)
	)

	console.log("healthy banana")

	let gridData = 0
	/* let gridEle = 0 */

	useEffect(() => {
		console.log("useEffect #1")

		const currentWeek = getDates()
		if (dates && dates.length === 0) setDates(currentWeek)

		const lastUpdate = localStorage.getItem("lastUpdate") || []
		if (!currentWeek.includes(lastUpdate || forceRefresh)) setTeamData(getIds())

		const storedTeamData =
			new Map(JSON.parse(localStorage.getItem("teamNames"))) || new Map()

		if (teamData.size === 0) {
			console.log("load from localStorage")
			setTeamData(storedTeamData)
		}
	}, [])

	useEffect(() => {
		console.log("useEffect #2")

		const currentWeek = getDates()
		if (dates && dates.length === 0) setDates(currentWeek)

		const lastUpdate = localStorage.getItem("lastUpdate") || []
		if (!currentWeek.includes(lastUpdate || forceRefresh)) setSchedule(getGameDates())

		const storedSchedule =
			new Map(JSON.parse(localStorage.getItem("schedule"))) || new Map()

		if (schedule.size === 0) {
			console.log("load from localStorage")
			setSchedule(storedSchedule)
		}
	}, [])

	/* useEffect(() => {
		console.log("useEffect #1")

		const currentWeek = getDates()
		if (dates === 0) setDates(currentWeek)

		const lastUpdate = localStorage.getItem("lastUpdate") || []
		if (!currentWeek.includes(lastUpdate)) {
			setTeamData(getIds())
			setSchedule(getGameDates())
		}

		const storedTeamData =
			new Map(JSON.parse(localStorage.getItem("teamNames"))) || new Map()
		const storedSchedule =
			new Map(JSON.parse(localStorage.getItem("schedule"))) || new Map()
		if (teamData === 0 || schedule === 0) {
			setTeamData(storedTeamData)
			setSchedule(storedSchedule)
		}
	}, []) */

	useEffect(() => {
		console.log("useEffect #3")

		let matchesPerDayTemp = []

		/* 	if (teamData?.size > 0 && schedule?.size > 0) { */
		console.log(schedule)
		console.log(teamData)
		console.log(dates)

		const daysWithGame = dates.map((date) => {
			if (schedule.has(date)) return schedule.get(date)

			return false
		})

		const tempMap = new Map()
		teamData.forEach((value, key) => tempMap.set(key, new Array()))
		console.log(daysWithGame)

		daysWithGame.map((day) => {
			let matchCount = 0
			// VALIDATE
			if (day === false) {
				tempMap.forEach((value, key) => tempMap.set(key, [...value, 9999]))
				matchesPerDayTemp.push(matchCount)
				return
			}

			// prettier-ignore
			tempMap.forEach((value, key) => {
				
				if (day.home.indexOf(key) !== -1) {
					tempMap.set(key, [...value, day.away[day.home.indexOf(key)]])
					matchCount++
					return
				}
				if (day.away.indexOf(key) !== -1) {
					tempMap.set(key, [...value, day.home[day.away.indexOf(key)]*-1])
					matchCount++
					return
				}

				tempMap.set(key, [...value, 9999])
			})

			if (matchCount !== 0) matchesPerDayTemp.push(matchCount)
			matchCount = 0
		})
		setMatchesPerDay(matchesPerDayTemp)
		console.log(tempMap)
		gridData = tempMap
		/* 	} */

		if (gridData?.size > 0) {
			console.log(gridData)
			console.log(teamData)

			let data = []
			gridData.forEach((value, key) =>
				data.push(
					<GridTeam key={key} teamId={key} shortname={teamData.get(key)} schedule={value} />
				)
			)
			console.log(data)
			setGridEle(data)
		}
	}, [])

	return (
		<div className="grid">
			<CurrentDate
				week={getWeek(new Date(dates?.[0]), { weekStartsOn: 1 })}
				forceRefresh={forceRefresh}
				setForceRefresh={setForceRefresh}
			/>
			<GridHeadline dates={dates}></GridHeadline>
			<GridSubHeadline matchesPerDay={matchesPerDay}></GridSubHeadline>

			{gridEle}
		</div>
	)
}

function getDates() {
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
