import { set } from "date-fns"
import { useState, useEffect } from "react"

export default function TeamsNhl() {
	const [teamData, setTeamData] = useState({})
	const [num, setNum] = useState(false)
	console.log("Bananas")

	useEffect(() => {
		async function getIds() {
			const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
			const data = await res.json()

			const newData = data.teams.map((teamData) => {
				const team = new Map()

				return team.set(teamData.id, teamData.abbreviation)
			})

			console.log(newData)
			localStorage.setItem("teamData", JSON.stringify(newData))
		}
		if (localStorage.getItem("teamData") === null) {
			console.log("localstorage NENI")
			getIds()
			/* setNum(false) */
		}

		if (localStorage.getItem("teamData") !== null) {
			console.log("localstorage plne")
			let deserialized = new Map(JSON.parse(localStorage.getItem("teamData")))
			console.log(deserialized)
			/* setNum(false) */
		}

		/* 	localStorage.setItem("teamData", JSON.stringify(teamData)) */
	}, [num])

	const klikuj = () => setNum(true)

	return (
		<div
			style={{ backgroundColor: "beige", color: "black", width: "100px" }}
			onClick={klikuj}
			className="headline-box-team"
		>
			Refresh API Button
		</div>
	)
}
