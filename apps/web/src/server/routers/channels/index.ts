import { ChannelsController } from "@Server/controllers/channels"
import { createRouter } from "@Server/createRouter"

export const channelsRouter = createRouter()
	.merge("top", ChannelsController.listTopChannels)
	.merge("rising", ChannelsController.listRisingChannels)
	.merge("live", ChannelsController.listLiveChannels)
	.merge("dashboard", ChannelsController.getDashboardChannel)
	.merge("profile", ChannelsController.getChannelProfile)
	.merge("delete", ChannelsController.deleteChannel)
