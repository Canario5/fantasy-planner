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
	const [teamNames, setTeamNames] = useState([])
	const [schedule, setSchedule] = useState(new Map())

	const [isLoading, setIsLoading] = useState(true)
	const [forceRefresh, setForceRefresh] = useState(false)

	const [teamsWithGame, setTeamsWithGame] = useState([])
	const [gridEle, setGridEle] = useState(null)

	useEffect(() => {
		console.log("useEffect #1")

		const currentWeek = getDates()
		if (dates && dates.length === 0) setDates(currentWeek)

		const lastUpdate = localStorage.getItem("lastUpdate") || []
		if (!currentWeek.includes(lastUpdate) || forceRefresh) {
			getTeamNames()
			getSchedule()
			return setIsLoading(false)
		}

		loadFromLocalStorage()
	}, [forceRefresh])

	useEffect(() => {
		console.log("useEffect #2")

		if (isLoading) return

		generateElements()
	}, [schedule.size, dates[0]])

	function generateElements() {
		console.log(schedule)
		console.log(teamNames)
		console.log(dates)

		const daysWithGame = dates.map((date) => {
			if (schedule.has(date)) return schedule.get(date)

			return false
		})

		const gridData = new Map([...teamNames.keys()].map((teamId) => [teamId, new Array()]))

		const teamsWithMatch = daysWithGame.map((day) => {
			let matchCount = 0

			if (!day) {
				gridData.forEach((value, key) => gridData.set(key, [...value, 9999]))
				return matchCount
			}

			gridData.forEach((value, key) => {
				if (day.home.includes(key)) {
					gridData.set(key, [...value, day.away[day.home.indexOf(key)]])
					return matchCount++
				}
				if (day.away.includes(key)) {
					gridData.set(key, [...value, day.home[day.away.indexOf(key)] * -1])
					return matchCount++
				}

				gridData.set(key, [...value, 9999])
			})

			return matchCount
		})

		setTeamsWithGame(teamsWithMatch)

		if (gridData.size > 0) {
			const data = [...gridData].map(([homeTeamId, rivalIds]) => {
				return (
					<GridTeam
						key={homeTeamId}
						teamId={homeTeamId}
						shortname={teamNames.get(homeTeamId)}
						schedule={rivalIds}
					/>
				)
			})

			setGridEle(data)
		}
	}

	async function getSchedule() {
		try {
			const res = await fetch(
				"https://statsapi.web.nhl.com/api/v1/schedule?startDate=2021-10-11&endDate=2022-07-01"
			) // YYYY-MM-DD; Season 21-22 starts 12 October 2021

			if (!res.ok) throw new Error(`This is an HTTP error: ${res.status}`)

			const data = await res.json()

			const matchDates = new Map(
				data.dates.map((day) => {
					const matchesPerDay = { home: [], away: [] }
					day.games.forEach((gamePlayed) => {
						matchesPerDay.home = [...matchesPerDay.home, gamePlayed.teams.home.team.id]
						matchesPerDay.away = [...matchesPerDay.away, gamePlayed.teams.away.team.id]
					})

					return [day.date, matchesPerDay]
				})
			)

			localStorage.setItem("schedule", JSON.stringify([...matchDates]))
			localStorage.setItem("lastUpdate", format(new Date(), "yyyy-MM-dd"))

			setSchedule(matchDates)
		} catch (err) {
			console.log(err.message)
		}
	}

	async function getTeamNames() {
		try {
			const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
			if (!res.ok) throw new Error(`This is an HTTP error: ${res.status}`)

			const data = await res.json()

			const sortedNames = new Map(
				data.teams
					.map((teamData) => [teamData.id, teamData.abbreviation])
					.sort((a, b) => String(a[1]).localeCompare(b[1]))
			)

			localStorage.setItem("teamNames", JSON.stringify([...sortedNames]))

			setTeamNames(sortedNames)
		} catch (err) {
			console.log(err.message)
		}
	}

	function loadFromLocalStorage() {
		const storedTeamNames =
			new Map(JSON.parse(localStorage.getItem("teamNames"))) || new Map()
		const storedSchedule =
			new Map(JSON.parse(localStorage.getItem("schedule"))) || new Map()

		console.log("load from localStorage")
		setTeamNames(storedTeamNames)
		setSchedule(storedSchedule)
		setIsLoading(false)
	}

	return (
		<div className="grid">
			<CurrentDate
				week={getWeek(new Date(dates?.[0]), { weekStartsOn: 1 })}
				forceRefresh={forceRefresh}
				setForceRefresh={setForceRefresh}
			/>
			<GridHeadline dates={dates}></GridHeadline>
			<GridSubHeadline teamsWithGame={teamsWithGame}></GridSubHeadline>

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
