/* eslint-disable react/no-unknown-property */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/pong_arcade_4mb.glb -o src/components/Arcade.jsx -r public 
Author: Batuhan13 (https://sketchfab.com/Batuhan13)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/pong-arcade-cabin-1f0f0d21ea5e4f8dbc415acde9997696
Title: Pong Arcade Cabin
*/

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Arcade(props) {
	const group = useRef();
	const { nodes, materials, animations } = useGLTF(
		"/models/pong_arcade_4mb.glb"
	);
	const { actions } = useAnimations(animations, group);
	useEffect(() => {
		actions["Ball"]?.play();
		actions["Right"]?.play();
		actions["Left"]?.play();
		return () => {
			actions["Ball"]?.stop();
			actions["Right"]?.stop();
			actions["Left"]?.stop();
		};
	}, [actions]);

	return (
		<group
			ref={group}
			{...props}
			scale={0.002}
			rotation={[0, Math.PI / 2, 0]}
			dispose={null}
		>
			<group name="Sketchfab_Scene">
				<group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
					<group name="ArcadeCabinfbx" rotation={[Math.PI / 2, 0, 0]}>
						<group name="Object_2">
							<group name="RootNode">
								<group
									name="MovementObjects001"
									position={[308.238, 155.71, -143.555]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="MovementObjects001_MovementObjects_0"
										geometry={
											nodes
												.MovementObjects001_MovementObjects_0
												.geometry
										}
										material={materials.MovementObjects}
									/>
								</group>
								<group
									name="MovementObjects002"
									position={[308.238, 124.269, -327.148]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="MovementObjects002_MovementObjects_0"
										geometry={
											nodes
												.MovementObjects002_MovementObjects_0
												.geometry
										}
										material={materials.MovementObjects}
									/>
								</group>
								<group
									name="MovementObjects003"
									position={[308.238, 155.71, -510.741]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="MovementObjects003_MovementObjects_0"
										geometry={
											nodes
												.MovementObjects003_MovementObjects_0
												.geometry
										}
										material={materials.MovementObjects}
									/>
								</group>
								<group
									name="OutCase"
									position={[358.819, 471.548, -327.148]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="OutCase_OutCase_0"
										geometry={
											nodes.OutCase_OutCase_0.geometry
										}
										material={materials.OutCase}
									/>
								</group>
								<group
									name="InnerCase"
									position={[200.292, 63.16, -327.148]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="InnerCase_InnerCase_0"
										geometry={
											nodes.InnerCase_InnerCase_0.geometry
										}
										material={materials.InnerCase}
									/>
								</group>
								<group
									name="Glass"
									position={[200.292, 63.16, -327.148]}
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<mesh
										name="Glass_Glass_0"
										geometry={nodes.Glass_Glass_0.geometry}
										material={materials.Glass}
									/>
								</group>
							</group>
						</group>
					</group>
				</group>
			</group>
		</group>
	);
}

useGLTF.preload("/models/pong_arcade_4mb.glb");
