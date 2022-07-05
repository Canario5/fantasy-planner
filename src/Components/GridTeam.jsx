import { useState } from "react"

import { logoNhl } from "./Logos"
import "./GridTeam.css"
import extraStyles from "../Styles/ExtraStyles"
import React from "react"

export default function GridTeam(props) {
	const { teamId, showHalfWidth } = props
	const [bigInfoBox, setBigInfoBox] = useState(Array(32).fill(false))

	const toggleBigInfo = (pos) => {
		console.log(pos)
		setBigInfoBox((oldValue) => {
			const newValues = [...oldValue]
			newValues[pos] = !newValues[pos]
			return newValues
		})
	}

	const days = props.rivalsIds.map((day, i) => {
		return (
			<div
				key={i}
				className={`grid-team grid-col-${i} grid-${props.shortname} ${
					(day > 0 && `grid-home`) || (day < 0 && `grid-away`)
				} `}
				style={showHalfWidth[i] ? extraStyles.HalfWidth : null}
			>
				{day && (
					<img
						src={logoNhl[Math.abs(day)]}
						className={`grid-logo grid-${props.shortname}`}
					/>
				)}
			</div>
		)
	})

	return (
		<>
			<div className={`grid-team-row grid-${props.shortname}`}>
				<div
					className={`grid-team-home grid-team grid-${props.shortname} grid-col-first`}
					onClick={() => toggleBigInfo(props.index)}
				>
					<img
						src={logoNhl[teamId]}
						className={`grid-logo grid-${props.shortname}`}
						alt={`${props.shortname} logo`}
						title={`${props.shortname}`}
					/>
				</div>
				{days}
				<div className={`grid-total grid-team grid-${props.shortname} grid-col-last`}>
					{props.gamesPlayed ? props.gamesPlayed : 0}
				</div>
			</div>
			<div
				className={`big-team-info`}
				style={
					bigInfoBox[props.index]
						? {
								backgroundColor: "#31353c",
								padding: "1em 0",
								transition: "all 0.65s ease-in-out",
						  }
						: {
								backgroundColor: "#31353c",
								padding: "1em 0",
								color: "transparent",
								fontSize: "0",
								visibility: "hidden",
								transition: "all .75s ease",
						  }
				}
			>
				Best available players:
				<span>Jaromir Jagr</span>
				<span>Bryan Rust</span>
				<span>Phil Kessel</span>
			</div>
		</>
	)
}
