import colors from "@Colors"
import { TCommandMethod } from "@kittr/types/types"
import { KitBase, Kit, CommandCode } from "@kittr/prisma"
import { Button, Modal } from "@Components/shared"
import { useAllKitBases } from "@Hooks/api/useAllKitBases"
import { useAllKitOptions } from "@Hooks/api/useAllKitOptions"
import { setModal } from "@Redux/slices/dashboard"
import { useChannelData } from "@Redux/slices/dashboard/selectors"
import { useDispatch } from "@Redux/store"
import { useState } from "react"
import CommandsTable from "./CommandsTable"
import CustomTextBuilder from "./CustomTextBuilder"
import UserIncludeToggle from "./IncludeUserToggle"
import MethodToggle from "./MethodToggle"
import TwitchStrategyToggle from "./TwitchStrategyToggle"

interface KitWithCommandCodes extends Kit {
	base: KitBase & { commandCodes: CommandCode[] }
}

/**
 * Modal for exporting bot commands to the user's desired channel.
 *
 * Includes options for
 * "@ing" the Twitch chatter,
 * creating a custom command string,
 * and using different platforms for inputting the commands to their chat.
 *
 * */
const ExportBotCommands = () => {
	const dispatch = useDispatch()
	const { data } = useChannelData()
	const [method, setMethod] = useState<TCommandMethod>("nightbot")
	const [commandStrategy, setCommandStrategy] = useState<"edit" | "add">("edit")
	const [includeUser, setIncludeUser] = useState(true)
	const { data: allKitBases } = useAllKitBases()
	const { data: allKitOptions } = useAllKitOptions()

	const createKitObject = <T extends Kit>(kit: T): T => {
		return {
			...kit,
			base: allKitBases!.find((allBases) => allBases.id === kit.baseId)!
		}
	}

	if (!allKitBases || !allKitOptions) return null

	return (
		<Modal backgroundClickToClose title="EXPORT BOT COMMANDS">
			<MethodToggle method={method} setMethod={setMethod} />
			<UserIncludeToggle includeUser={includeUser} setIncludeUser={setIncludeUser} />
			<CustomTextBuilder commandStrategy={commandStrategy} method={method} />
			{method !== "dashboard" && (
				<TwitchStrategyToggle commandStrategy={commandStrategy} setCommandStrategy={setCommandStrategy} />
			)}

			<CommandsTable
				kits={data?.kits.map(createKitObject) ?? []}
				method={method}
				commandStrategy={commandStrategy}
				includeUser={includeUser}
			/>

			<Button
				design="transparent"
				text="BACK"
				onClick={() => dispatch(setModal({ type: "", data: "" }))}
				style={{
					position: "absolute",
					bottom: "24px",
					left: "50%",
					transform: "translate(-50%)",
					backgroundColor: colors.middle
				}}
			/>
		</Modal>
	)
}

export default ExportBotCommands
