export default function loadFromLocalStorage() {
	// prettier-ignore
	const storedTeamNames =	new Map(JSON.parse(localStorage.getItem("teamNames"))) || new Map()
	const storedSchedule = new Map(JSON.parse(localStorage.getItem("schedule"))) || new Map()

	console.log("load from localStorage")

	return [storedTeamNames, storedSchedule]
}
