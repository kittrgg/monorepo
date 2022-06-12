import { createController } from "@Server/createController"
import * as ChannelsService from "@Server/services/channels"
import { ChannelAffiliateModel } from "@kittr/prisma/validator"
import { TRPCError } from "@trpc/server"

const createAffiliate = createController().query("", {
	input: ChannelAffiliateModel.omit({ id: true }),
	async resolve({ input }) {
		if (!input.channelProfileId) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Missing channelProfileId."
			})
		}

		const channel = await ChannelsService.createAffiliate(input)

		return channel
	}
})

const updateAffiliate = createController().query("", {
	input: ChannelAffiliateModel,
	async resolve({ input }) {
		const { id, ...affiliate } = input

		const channel = await ChannelsService.updateAffiliate({ id: input.id, data: affiliate })
		return channel
	}
})

export const ChannelsProfileAffiliatesController = {
	createAffiliate,
	updateAffiliate
}
