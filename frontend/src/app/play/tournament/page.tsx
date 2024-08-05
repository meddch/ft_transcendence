"use client";

import Ball from "@/Components/pong/Ball";
import Paddle from "@/Components/pong/Paddle";
import Borders from "@/Components/pong/Borders";
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Env from "@/Components/pong/Env";
import Score from "@/Components/pong/Score";
import DashedLine from "@/Components/pong/DashedLine";
import { Stage } from "@react-three/drei";
import Socket from "@/Components/pong/Socket";
import { KeyboardControls } from "@react-three/drei";
import Ready from "@/Components/pong/Ready";
import Pause from "@/Components/pong/Pause";
import Gameover from "@/Components/pong/Gameover";
import { useRouter } from "next/navigation";
const Rules = [
	"- Player 1: W S A D",
	"- Player 2: ↑ ↓ ← →",
	"- Start: Space",
	"- Pause: P",
	"- First to 5 points wins",
	"- Use the mouse to adjust your view",
];

const map = [
	{ name: "moveUP1", keys: ["ArrowUp", "ArrowRight"] },
	{ name: "moveDOWN1", keys: ["ArrowDown", "ArrowLeft"] },
	{ name: "moveUP2", keys: ["KeyW", "KeyD"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyA"] },
];

export default function Page({ searchParams }: any) {
	const router = useRouter();
	const id = searchParams.id;
	if (!id) router.push("/play");
	console.log(id);
	const ws = useRef<WebSocket>(null) as React.MutableRefObject<WebSocket>;
	const [details, setDetails] = useState<any>({});
	console.log(details);
	const [currMatch, setCurrMatch] = useState<any>({});
	console.log("current match", currMatch);
	const [score1, setScore1] = useState(0);
	const [score2, setScore2] = useState(0);
	const [gameState, setGameState] = useState("waiting"); //waiting, playing, paused, gameover
	const [matchResult, setMatchResult] = useState<any>(null);
	const ballRef = useRef<THREE.Mesh>() as React.MutableRefObject<THREE.Mesh>;
	const paddle1Ref =
		useRef<THREE.Mesh>() as React.MutableRefObject<THREE.Mesh>;
	const paddle2Ref =
		useRef<THREE.Mesh>() as React.MutableRefObject<THREE.Mesh>;
	useEffect(() => {
		const accessToken = localStorage.getItem("user_token");
		ws.current = new WebSocket(
			`${process.env.NEXT_PUBLIC_SOCKET_ENDPOINT}tournament/${id}/?token=${accessToken}`
		);
		ws.current.onopen = () => {
			console.log("WebSocket Opened");
		};
		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "tournament_error") router.push("/play");
			if (data.type === "tournament_info") setDetails(data.info);
			if (data.type === "tournament_match") setCurrMatch(data.match);
			if (data.type === "game_state") update(data);
		};
		ws.current.onclose = () => {
			console.log("WebSocket Closed");
		};
		return () => {
			ws.current.close();
		};
	}, []);

	function updateGame(data: any) {
		if (!ballRef.current || !paddle1Ref.current || !paddle2Ref.current)
			return;
		paddle1Ref.current.position.x = data.paddle1.x;
		paddle2Ref.current.position.x = data.paddle2.x;
		ballRef.current.position.x = data.ball.x;
		ballRef.current.position.z = data.ball.z;
		if (data.score1 !== score1) setScore1(data.score.player1);
		if (data.score2 !== score2) setScore2(data.score.player2);
	}
	function update(data: any) {
		// console.log(data);
		if (data.state === "waiting") {
			gameState !== "waiting" && setGameState("waiting");
		}
		if (data.state === "paused") {
			gameState !== "paused" && setGameState("paused");
		}
		if (data.state === "playing") {
			gameState !== "playing" && setGameState("playing");
			updateGame(data);
		}
		if (data.state === "gameover") {
			gameState !== "gameover" && setGameState("gameover");
			// handleGameover(data);
		}
	}
	return (
		<div className="fixed h-full w-full flex flex-col items-center text-black border-2">
			<h2 className="text-3xl font-bold mt-10">
				<span className="text-myred">{details?.name}</span> Tournament
			</h2>
			{/* <Players players={details?.players} /> */}
			<Matches
				matches={details?.matches}
				roundsNumber={details?.rounds}
				winner={details?.winner}
			/>
			<CurrentMatch match={currMatch} />
			<div className="relative rounded-lg shadow-lg p-6 w-full h-1/2">
				{gameState === "waiting" && <Ready rules={Rules} />}
				{gameState === "paused" && <Pause />}
				{matchResult && (
					<Gameover winner={matchResult.winner} winnerImage={""} />
				)}
				<Canvas
					className="rounded-lg"
					camera={{ position: [-0.5, 5, 0], fov: 60 }}
				>
					<KeyboardControls map={map}>
						<OrbitControls />
						<Env />
						<Borders />
						<Stage
							environment="city"
							intensity={0.6}
							castShadow={true}
						>
							{/* @ts-ignore */}
							<Ball position={[0, 0, 0]} ref={ballRef} />
							{/* @ts-ignore */}
							<Paddle position={[0, 0, 6]} ref={paddle1Ref} />
							{/* @ts-ignore */}
							<Paddle position={[0, 0, -6]} ref={paddle2Ref} />
						</Stage>
						<Score score1={score1} score2={score2} />
						<Socket socket={ws} type="local" />
						<DashedLine />
					</KeyboardControls>
				</Canvas>
			</div>
		</div>
	);
}

function Players({ players }: { players: any[] }) {
	if (!players) {
		return <></>;
	}
	return (
		<div className="flex flex-row">
			{players.map((player: any, index: number) => (
				<div
					key={index}
					className={`p-4 text-2xl font-bold border-2 rounded-full m-4 text-${player.color}-500`}
				>
					{player}
				</div>
			))}
		</div>
	);
}

// now we can display the matches
// each clolumn represents a round (a round is a list of matches)
// each match has a player1 and player2 ,score1 and score2 ,winner ,id,round
// if shoud look like this Player1 score1 - score2 Player2
function Matches({
	matches,
	roundsNumber,
	winner,
}: {
	matches: any[];
	roundsNumber: number;
	winner: string;
}) {
	if (!matches) {
		return <></>;
	}

	const matchesByRound = Array.from({ length: roundsNumber }, (_, i) => {
		return matches.filter((match) => match.round === i + 1);
	});
	return (
		<div className="w-3/4 flex flex-row ">
			{matchesByRound.map((round, index) => (
				<div
					key={index}
					className="w-full flex flex-col  items-center justify-center p-4 gap-4"
				>
					{round.map((match: any, index: number) => (
						<div
							key={index}
							className="flex flex-row w-64 justify-center"
						>
							<div className="p-2 font-bold border-2 w-full text-center flex items-center justify-center rounded-lg">
								<p className="w-[40%] truncate text-right mr-2">
									<span
										className={`text-${
											match.player1 === winner
												? "green"
												: "black"
										}-500`}
									>
										{match.player1}
									</span>
								</p>
								<span>{match.score1}</span>-
								<span>{match.score2}</span>
								<p className="w-[40%] truncate text-left ml-2">
									<span
										className={`text-${
											match.player2 === winner
												? "green"
												: "black"
										}-500`}
									>{match.player2}</span>
								</p>
							</div>
							{match.winner && (
								<div className="p-4 text-2xl font-bold border-2 m-4">
									{match.winner}
								</div>
							)}
						</div>
					))}
				</div>
			))}
		</div>
	);
}

function CurrentMatch({ match }: { match: any }) {
	if (!match) {
		return <></>;
	}
	return (
		<div className="w-full h-20 flex flex-row justify-between border-2 border-green-600 rounded-lg py-4 my-2">
			<span className="text-2xl font-bold w-full text-center">
				{match.player1 ? match.player1 : "?"}
			</span>
			<span className="text-xl font-bold w-fulltext-center"> vs </span>
			<span className="text-2xl font-bold w-full text-center">
				{match.player2 ? match.player2 : "?"}
			</span>
		</div>
	);
}
