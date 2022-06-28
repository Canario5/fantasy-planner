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

	const [halfWidth, setHalfWidth] = useState(Array(7).fill(false))
	const [overlay, setOverlay] = useState([])

	const [loadApiData, setApiData, schedule, teamNames] = useApiData()

	/* console.log(halfWidth) */

	useEffect(() => {
		console.log("useEffect #1")

		const currentWeek = getDates(startOfToday())
		if (dates && dates.length === 0) {
			setDates(currentWeek)
		}

		console.log(halfWidth)

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
	}, [schedule.size, dates, halfWidth])

	function generateElements() {
		console.log({ schedule })
		console.log({ teamNames })
		console.log({ dates })

		const daysWithGame = dates.map((date) =>
			schedule.has(date) ? schedule.get(date) : false
		)
		console.log({ daysWithGame })

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

				gridData.set(teamId, [...value, false]) //False = team is not playing
			})

			return matchCount
		})

		setTeamsWithGame(teamsWithMatch)
		console.log({ gridData })

		const data = [...gridData].map(([homeTeamId, rivalsIds]) => {
			return (
				<GridTeam
					key={homeTeamId}
					teamId={homeTeamId}
					shortname={teamNames.get(homeTeamId)}
					schedule={rivalsIds}
					halfWidth={halfWidth}
				/>
			)
		})
		console.log("GridEle", { data })
		setGridEle(data)
	}

	function prevWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(previousMonday(currentMonday)))
		resetHalfWidth()
	}

	function nextWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(nextMonday(currentMonday)))
		resetHalfWidth()
	}

	const resetHalfWidth = () => setHalfWidth(Array(7).fill(false))

	const prevDay = () => {
		const dayBefore = add(new Date(dates[0]), { days: -1 })
		setDates([format(dayBefore, "yyyy-MM-dd"), ...dates.slice(0, -1)])
		/* setHalfWidth(halfWidth.slice(0, -1)) */
		setHalfWidth([false, ...halfWidth.slice(0, -1)])
	}

	const nextDay = () => {
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates.slice(1), format(dayAfter, "yyyy-MM-dd")])
		setHalfWidth([...halfWidth.slice(1), false])
	}

	const addDay = () => {
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates, format(dayAfter, "yyyy-MM-dd")])
	}

	const removeDay = () => {
		setHalfWidth(halfWidth.slice(0, -1))
		setDates(dates.slice(0, -1))
	}

	const columnPos = (event) => {
		const headlineEle = [...document.querySelector(".grid-headline").children].slice(1, -1)
		return headlineEle.indexOf(event.target)
	}

	/* useEffect(() => {
		console.log(halfWidth)
	}, [halfWidth]) */

	const handleHalfWidth = (event) => {
		if (event.type === "contextmenu") {
			event.preventDefault()
		}

		const colPos = columnPos(event)

		setHalfWidth((oldValue) => {
			const newValues = [...oldValue]
			newValues[colPos] = !newValues[colPos]
			console.log(newValues)
			return newValues
		})
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
			<GridHeadline
				dates={dates}
				prevDay={prevDay}
				nextDay={nextDay}
				handleHalfWidth={handleHalfWidth}
				halfWidth={halfWidth}
			></GridHeadline>
			<GridSubHeadline
				teamsWithGame={teamsWithGame}
				halfWidth={halfWidth}
			></GridSubHeadline>

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
