import { useState, useEffect } from "react"

export default function TeamsNhl() {
	const [teamData, setTeamData] = useState(new Map())
	const [num, setNum] = useState(false)

	/* useEffect(() => {
		console.log("Kachna")
		console.log(num)

		async function getIds() {
			const res = await fetch("https://statsapi.web.nhl.com/api/v1/teams")
			const data = await res.json()

			const newData = new Map()
			const iteData = data.teams.map((teamData) => {
				newData.set(teamData.id, teamData.abbreviation)
			})

			setTeamData(() => newData)
			localStorage.setItem("teamNames", JSON.stringify([...newData]))
		}
		if (localStorage.getItem("teamNames") === null || num) {
				getIds()
			setNum(false)
		}

		if (localStorage.getItem("teamNames") !== null) {
			setTeamData(() => new Map(JSON.parse(localStorage.getItem("teamNames"))))
		}
	}, [num]) */

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
