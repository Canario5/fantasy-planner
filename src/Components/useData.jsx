import { useState } from "react"
import format from "date-fns/format"

export default function useApiData() {
	const [teamNames, setTeamNames] = useState([])
	const [teamNamesDefault, setTeamNamesDefault] = useState([])
	const [schedule, setSchedule] = useState(new Map())

	async function getSchedule() {
		try {
			const res = await fetch(
				"https://statsapi.web.nhl.com/api/v1/schedule?season=20222023"
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
					.map((teamData) => [teamData.id, teamData.shortName])
					.sort((a, b) => a[1].localeCompare(b[1], "en"))
			)

			localStorage.setItem("teamNames", JSON.stringify([...sortedNames]))

			setTeamNames(sortedNames)
			setTeamNamesDefault(sortedNames)
		} catch (err) {
			console.log(err.message)
		}
	}

	function loadApiData() {
		getSchedule()
		getTeamNames()
	}

	function setApiData(storedTeamNames, storedSchedule) {
		setTeamNames(storedTeamNames)
		setTeamNamesDefault(storedTeamNames)
		setSchedule(storedSchedule)
	}

	return [loadApiData, setApiData, setTeamNames, schedule, teamNames, teamNamesDefault]
}
