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
	const [loadApiData, setApiData, setTeamNames, schedule, teamNames, teamNamesDefault] =
		useApiData()
	const [dates, setDates] = useState(getDates(startOfToday()))

	const [isLoading, setIsLoading] = useState(true)
	const [forceRefresh, setForceRefresh] = useState(false)

	const [matchesPerDay, setMatchesPerDay] = useState([])
	const [matchesPerTeam, setMatchesPerTeam] = useState([])
	const [gridTable, setGridTable] = useState(null)

	const [halfWidth, setHalfWidth] = useState(Array(7).fill(false))
	const [showBigTeamInfo, setShowBigTeamInfo] = useState(Array(32).fill(false))

	useEffect(() => {
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
		if (isLoading) return

		generateElements()
	}, [schedule.size, dates, halfWidth, teamNames])

	function generateElements() {
		const days = dates.map((date) => (schedule.has(date) ? schedule.get(date) : false))

		const gridData = new Map([...teamNames.keys()].map((teamId) => [teamId, new Array()]))

		const matchCountPerDay = days.map((day, i) => {
			if (!day) {
				gridData.forEach((value, key) => gridData.set(key, [...value, false]))
				return 0
			}

			gridData.forEach((value, teamId) => {
				if (day.home.includes(teamId)) {
					return gridData.set(teamId, [...value, day.away[day.home.indexOf(teamId)]]) //Pos value = game played at home
				}
				if (day.away.includes(teamId)) {
					return gridData.set(teamId, [...value, day.home[day.away.indexOf(teamId)] * -1]) //Negative value = team plays away
				}

				gridData.set(teamId, [...value, false]) //False = team is not playing
			})

			const tempCountPerDay = [...gridData.values()].reduce((sumPerDay, team) => {
				return sumPerDay + (team[i] ? 1 : 0)
			}, 0)

			return tempCountPerDay
		})

		const matchCountPerTeam = [...gridData.values()].map((rivals) => {
			const tempCountPerTeam = rivals.reduce((sumPerTeam, rival) => {
				return sumPerTeam + (rival ? 1 : 0)
			}, 0)
			return tempCountPerTeam
		})

		setMatchesPerDay(matchCountPerDay)
		setMatchesPerTeam(matchCountPerTeam)
		setGridTable(gridData)
	}

	function prevWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(previousMonday(currentMonday)))
		resetHalfWidth()
		resetBigTeamInfo()
		setTeamNames(teamNamesDefault)
	}

	function nextWeek() {
		const currentMonday = new Date(dates[0])
		setDates(getDates(nextMonday(currentMonday)))
		resetHalfWidth()
		resetBigTeamInfo()
		setTeamNames(teamNamesDefault)
	}

	const resetHalfWidth = () => setHalfWidth(Array(7).fill(false))
	const resetBigTeamInfo = () => setShowBigTeamInfo(Array(32).fill(false))

	const prevDay = () => {
		const dayBefore = add(new Date(dates[0]), { days: -1 })
		setDates([format(dayBefore, "yyyy-MM-dd"), ...dates.slice(0, -1)])
		setHalfWidth([false, ...halfWidth.slice(0, -1)])
		resetBigTeamInfo()
	}

	const nextDay = () => {
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates.slice(1), format(dayAfter, "yyyy-MM-dd")])
		setHalfWidth([...halfWidth.slice(1), false])
		resetBigTeamInfo()
	}

	const addDay = () => {
		setHalfWidth([...halfWidth, false])
		const dayAfter = add(new Date(dates.at(-1)), { days: 1 })
		setDates([...dates, format(dayAfter, "yyyy-MM-dd")])
		resetBigTeamInfo()
	}

	const removeDay = () => {
		setHalfWidth(halfWidth.slice(0, -1))
		setDates(dates.slice(0, -1))
		resetBigTeamInfo()
	}

	const handleHalfWidth = (event, colPos) => {
		if (event.type === "contextmenu") {
			event.preventDefault()

			const colElements = [...document.querySelectorAll(`.grid-col-${colPos}`)]
			colElements.forEach((el) => {
				el.ontransitionend = () => {
					el.classList.remove("column-transition")
				}
				el.classList.add("column-transition")
			})
		}

		setHalfWidth((oldValue) => {
			const newValues = [...oldValue]
			newValues[colPos] = !newValues[colPos]
			return newValues
		})
	}

	const sortTeamNames = () => {
		if (
			JSON.stringify([...gridTable.keys()]) === JSON.stringify([...teamNamesDefault.keys()])
		) {
			return setTeamNames(new Map([...teamNamesDefault].reverse()))
		}

		setTeamNames(new Map([...teamNamesDefault]))
	}

	const sortDay = (colPos) => {
		const gridTableArray = [...teamNamesDefault.keys()].map((id) => {
			const rival = gridTable.get(id)[colPos]

			return [id, rival ? true : false]
		})

		const sortedRivals = gridTableArray.sort((a, b) => b[1] - a[1])

		if (
			JSON.stringify([...gridTable.keys()]) ===
			JSON.stringify(sortedRivals.map((x) => x[0]))
		) {
			return setTeamNames(
				new Map(
					sortedRivals
						.reverse()
						.sort((a, b) => b[1] - a[1])
						.reverse()
				)
			)
		}

		setTeamNames(new Map(sortedRivals))
	}

	const sortTotal = () => {
		const gridTableArray = [...teamNamesDefault.keys()].map((id) => {
			const valuePos = [...gridTable.keys()].indexOf(id)
			return [id, matchesPerTeam[valuePos]]
		})

		const newlySorted = gridTableArray.sort((a, b) => b[1] - a[1])

		if (
			JSON.stringify([...gridTable.keys()]) === JSON.stringify(newlySorted.map((x) => x[0]))
		) {
			return setTeamNames(
				new Map(
					newlySorted
						.reverse()
						.sort((a, b) => b[1] - a[1])
						.reverse()
				)
			)
		}

		setTeamNames(new Map(newlySorted))
	}

	const genElements = !gridTable
		? ""
		: [...gridTable].map(([homeTeamId, rivalsIds], i) => {
				return (
					<GridTeam
						key={homeTeamId}
						index={i}
						teamId={homeTeamId}
						shortname={teamNamesDefault.get(homeTeamId)}
						rivalsIds={rivalsIds}
						gamesPlayed={matchesPerTeam[i]}
						showHalfWidth={halfWidth}
						showBigTeamInfo={showBigTeamInfo}
						setShowBigTeamInfo={setShowBigTeamInfo}
					/>
				)
		  })

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
				showHalfWidth={halfWidth}
			></GridHeadline>
			<GridSubHeadline
				teamsWithGame={matchesPerDay}
				showHalfWidth={halfWidth}
				sortDay={sortDay}
				sortTeamNames={sortTeamNames}
				sortTotal={sortTotal}
			></GridSubHeadline>

			{genElements}
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
