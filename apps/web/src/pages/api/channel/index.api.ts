import type { NextApiRequest, NextApiResponse } from "next"
import { NextServerPayload } from "@kittr/types"
import { createHandler } from "@Utils/middlewares/createHandler"
import { userAuth } from "@Utils/middlewares/auth"
import { prisma, Channel } from "@kittr/prisma"
import { getFullChannelProfileQuery } from "@Services/orm/queries/channels/getFullChannelProfile"

const handler = createHandler(userAuth)

// Get a full channel profile
handler.get(async (req: NextApiRequest, res: NextApiResponse<NextServerPayload<Channel | null>>) => {
	const { id, urlSafeName } = req.query as { id: string; urlSafeName: string }

	const channel = await getFullChannelProfileQuery({ id, urlSafeName })

	return res.status(200).json(channel)
})

// Remove a channel from existence...Or just the database
handler.delete(async (req: NextApiRequest, res: NextApiResponse<NextServerPayload<Channel>>) => {
	const { id } = JSON.parse(req.body) as Channel

	try {
		const data = await prisma.channel.delete({ where: { id } })

		return res.status(200).json(data)
	} catch (error) {
		return res.status(500).json({ error: true, errorMessage: JSON.stringify(error) })
	}
})

export default handler
