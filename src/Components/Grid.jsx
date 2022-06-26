import { useState, useEffect } from "react"

import isMonday from "date-fns/isMonday"
import previousMonday from "date-fns/previousMonday"
import nextMonday from "date-fns/nextMonday"
import format from "date-fns/format"
import add from "date-fns/add"
import eachDayOfInterval from "date-fns/eachDayOfInterval"
import startOfToday from "date-fns/startOfToday"

import GridHeadline from "./GridHeadline"
import GridSubHeadline from "./GridSubHeadline"
import GridTeam from "./GridTeam"
import CurrentDate from "../Components/CurrentDate"

import useApiData from "./useData"
import loadFromLocalStorage from "./loadLocalStorage"

import "./Grid.css"

export default function Grid() {
	const [dates, setDates] = useState(getDates(startOfToday()))

	const [isLoading, setIsLoading] = useState(true)
	const [forceRefresh, setForceRefresh] = useState(false)

	const [teamsWithGame, setTeamsWithGame] = useState([])
	const [gridEle, setGridEle] = useState(null)

	const [loadApiData, setApiData, schedule, teamNames] = useApiData()

	useEffect(() => {
		console.log("useEffect #1")

		const currentWeek = getDates(startOfToday())
		if (dates && dates.length === 0) {
			setDates(currentWeek)
		}

		const lastUpdate = localStorage.getItem("lastUpdate") || []
		if (!currentWeek.includes(lastUpdate) || forceRefresh) {
			loadApiData()
			setForceRefresh(false)
			return setIsLoading(false)
		}

		const [storedTeamNames, storedSchedule] = loadFromLocalStorage()
		setApiData(storedTeamNames, storedSchedule)
		setIsLoading(false)
	}, [forceRefresh])

	useEffect(() => {
		console.log("useEffect #2")

		if (isLoading) return

		generateElements()
	}, [schedule.size, dates])

	function generateElements() {
		console.log({ schedule })
		console.log({ teamNames })
		console.log({ dates })

		const daysWithGame = dates.map((date) =>
			schedule.has(date) ? schedule.get(date) : false
		)

		const gridData = new Map([...teamNames.keys()].map((teamId) => [teamId, new Array()]))

		const teamsWithMatch = daysWithGame.map((day) => {
			let matchCount = 0

			if (!day) {
				gridData.forEach((value, key) => gridData.set(key, [...value, false]))
				return matchCount
			}

			gridData.forEach((value, teamId) => {
				if (day.home.includes(teamId)) {
					gridData.set(teamId, [...value, day.away[day.home.indexOf(teamId)]]) //Pos value = game played at home
					return matchCount++
				}
				if (day.away.includes(teamId)) {
					gridData.set(teamId, [...value, day.home[day.away.indexOf(teamId)] * -1]) //Negative value = team plays away
					return matchCount++
				}

				gridData.set(teamId, [...value, false]) //False value = team is not playing
			})

			return matchCount
		})

		setTeamsWithGame(teamsWithMatch)
		console.log({ gridData })
		if (gridData.size > 0) {
			const data = [...gridData].map(([homeTeamId, rivalsIds]) => {
				return (
					<GridTeam
						key={homeTeamId}
						teamId={homeTeamId}
						shortname={teamNames.get(homeTeamId)}
						schedule={rivalsIds}
					/>
				)
			})
			console.log("GridEle", { data })
			setGridEle(data)
		}
	}

	function prevWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(previousMonday(currentMonday)))
	}

	function nextWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(nextMonday(currentMonday)))
	}

	const prevDay = () => {
		const dayBefore = add(new Date(dates[0]), { days: -1 })
		setDates([format(dayBefore, "yyyy-MM-dd"), ...dates.slice(0, -1)])
	}

	const nextDay = () => {
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates.slice(1), format(dayAfter, "yyyy-MM-dd")])
	}

	const addDay = () => {
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates, format(dayAfter, "yyyy-MM-dd")])
	}

	const removeDay = () => {
		setDates(dates.slice(1))
	}

	return (
		<div className="grid">
			<CurrentDate
				month={dates?.length ? format(new Date(dates[0]), "MMMM") : "blank"}
				setForceRefresh={setForceRefresh}
				nextWeek={nextWeek}
				prevWeek={prevWeek}
				addDay={addDay}
				removeDay={removeDay}
			/>
			<GridHeadline dates={dates} prevDay={prevDay} nextDay={nextDay}></GridHeadline>
			<GridSubHeadline teamsWithGame={teamsWithGame}></GridSubHeadline>

			{gridEle}
		</div>
	)
}

function getDates(today) {
	const monday = isMonday(today) ? today : previousMonday(today)
	const sunday = add(monday, { days: 6 })

	return eachDayOfInterval({ start: monday, end: sunday }).map((day) =>
		format(day, "yyyy-MM-dd")
	)
}
