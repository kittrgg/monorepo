import fetch from "@Fetch"
import { Channel, ChannelLink, ChannelProfile, LinkProperty, prisma } from "@kittr/prisma"
import { ITwitchLiveChannels } from "@kittr/types"
import { getTopChannelsWithLinksQuery } from "@Services/orm"
import { headers } from "@Services/twitch/utils/auth"
import { grabLoginName } from "@Services/twitch/utils/grabLoginName"
import { badWordFilter } from "@Utils/helpers/badWordFilter"
import { toURL } from "@Utils/helpers/toURL"
import { TRPCError } from "@trpc/server"

export * from "./games"
export * from "./kits"
export * from "./profile"

interface ChannelWithProfile extends Channel {
	profile: ChannelProfile
}

interface ChannelWithLinks extends Channel {
	links: ChannelLink[]
}

interface ListParams {
	skip?: number
	take?: number
}

const getTwitchLink = (channel: ChannelWithLinks) =>
	channel.links.find((link) => link.property === LinkProperty.TWITCH)?.value ?? ""

export const createChannel = async (displayName: string) => {
	if (displayName.length > 26)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "That name is too long. 25 characters or less"
		})

	if (badWordFilter(displayName)) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Hey, no bad words!"
		})
	}

	const existingChannel = await prisma.channel.findFirst({
		where: { urlSafeName: toURL(displayName) }
	})

	if (existingChannel) {
		throw new TRPCError({
			code: "CONFLICT",
			message:
				"That name is too similar to another channel. We don't want to confuse our system...Please choose another."
		})
	}

	const result = await prisma.channel.create({
		data: {
			displayName,
			urlSafeName: toURL(displayName),
			managers: {
				create: {
					// TODO: Use the authentication of the user in the request.
					firebaseId: "123",
					// NO TOUCHY! We need to make sure that the person who creates this channel is the owner of it.
					role: "OWNER"
				}
			}
		}
	})

	return result
}

export const deleteChannel = async (id: string) => {
	const channel = await prisma.channel.delete({
		where: {
			id
		}
	})

	return channel
}

export const getDashboardChannel = async ({ id, urlSafeName }: { id: string; urlSafeName: string }) => {
	const channel = await prisma.channel.findFirst({
		where: {
			id,
			urlSafeName
		},
		include: {
			customGameCommands: true,
			profile: {
				include: {
					brandColors: true,
					channelPcSpecs: true,
					affiliates: true,
					setupPhotos: true
				}
			},
			managers: true,
			kits: {
				orderBy: {
					base: {
						displayName: "asc"
					}
				},
				include: {
					base: {
						include: {
							category: true,
							stats: true,
							commandCodes: true
						}
					},
					options: true
				}
			},
			links: true,
			plan: true,
			games: true,
			gameAffiliateCodes: {
				include: {
					game: true
				}
			},
			overlay: {
				include: {
					primaryKit: true,
					secondaryKit: true
				}
			}
		}
	})
	return channel
}

export const getFullChannelProfileQuery = async ({ id, urlSafeName }: { id: string; urlSafeName: string }) => {
	if (!id && !urlSafeName) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Need either id or urlSafeName" })
	}

	const channel = await prisma.channel.findFirst({
		where: {
			id,
			urlSafeName
		},
		include: {
			profile: {
				include: {
					brandColors: true,
					channelPcSpecs: true,
					affiliates: true,
					setupPhotos: true
				}
			},
			kits: {
				orderBy: {
					base: {
						displayName: "asc"
					}
				},
				include: {
					base: {
						include: {
							category: true,
							stats: true
						}
					},
					options: true
				}
			},
			links: true,
			plan: true,
			games: true,
			gameAffiliateCodes: {
				include: {
					game: true
				}
			}
		}
	})
	return channel
}

export const getChannelProfileByUrlSafeName = async (urlSafeName: string) => {
	if (!urlSafeName) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "Need either id or urlSafeName" })
	}

	const channel = await prisma.channel.findFirst({
		where: {
			urlSafeName
		},
		include: {
			profile: {
				include: {
					brandColors: true,
					channelPcSpecs: true,
					affiliates: true,
					setupPhotos: true
				}
			},
			kits: {
				orderBy: {
					base: {
						displayName: "asc"
					}
				},
				include: {
					base: {
						include: {
							category: true,
							stats: true
						}
					},
					options: true
				}
			},
			links: true,
			plan: true,
			games: true,
			gameAffiliateCodes: {
				include: {
					game: true
				}
			}
		}
	})

	return channel
}

export const listTopChannels = async ({ skip = 0, take = 10 }: ListParams) => {
	const result = await prisma.channel.findMany({
		where: {
			profile: {
				hasProfileImage: process.env.IS_DEV ? undefined : true
			}
		},
		orderBy: {
			viewCount: "desc"
		},
		skip,
		take,
		include: {
			profile: true,
			links: true
		}
	})

	return result as ChannelWithProfile[]
}

// export const countChannels = async () => {
// 	if (gameId) {
// 		const total = await prisma.channel.count({
// 			where: {
// 				games: {
// 					some: {
// 						id: gameId
// 					}
// 				}
// 			}
// 		})

// 		return total
// 	}
// }

/** Counts channels both for a game and on the entirety of kittr.
 *
 * Passs a game's urlSafeName to count channels for that game.
 *
 * Passing undefined results in all channels.
 */
export const countChannels = async (urlSafeName?: string) => {
	const total = await prisma.channel.count({
		where: {
			games: {
				some: {
					urlSafeName
				}
			}
		}
	})

	return total
}

export const listRisingChannels = async () => {
	const skip = 10
	const take = 10
	const where = {
		profile: {
			hasProfileImage: process.env.IS_DEV ? undefined : true
		},
		viewCount: {
			gte: 400
		}
	}

	const channelCount = await prisma.channel.count({
		where
	})

	const randomSkip = Math.min(channelCount - skip, Math.max(skip, Math.floor(Math.random() * channelCount)))

	const result = await prisma.channel.findMany({
		orderBy: {
			viewCount: "desc"
		},
		where,
		skip: randomSkip,
		take,
		include: {
			profile: true
		}
	})

	return result as ChannelWithProfile[]
}

export const listLiveChannels = async () => {
	const popularChannels = await getTopChannelsWithLinksQuery({ take: 100 })

	// Create the url for the Twitch API fetch
	const buildLiveStreamRequest = (channels: ChannelWithLinks[]): string => {
		try {
			const requestBase = "https://api.twitch.tv/helix/streams/?user_login="

			// Grab the login names from the channels
			const channelNames = channels
				.map((channel) => grabLoginName(getTwitchLink(channel)))
				.filter((str: string | undefined) => str !== undefined)

			// Put together the base and the channel names
			const url = requestBase.concat(channelNames.join("&user_login="))
			return url
		} catch (error) {
			console.error(error)
			// logReport.error("Twitch Live Channels API ", error as any)
			return ""
		}
	}

	const getStreams = async (): Promise<ITwitchLiveChannels[]> => {
		const url = buildLiveStreamRequest(popularChannels)

		if (!url) return []

		try {
			const data = await fetch.get<{ data: any }>({ url, headers: await headers(), redirect: "follow" })

			if (!data.data) {
				console.log("The Twitch API fetch did not work.", { data })
				return []
			}

			return data.data
		} catch (error) {
			console.error(error)
			return []
		}
	}

	const currentlyLiveChannels = await getStreams()

	try {
		const data = popularChannels.filter((channel) =>
			currentlyLiveChannels
				.map((channel) => channel.user_login)
				.includes(getTwitchLink(channel).substring(getTwitchLink(channel).lastIndexOf("/") + 1) as string)
		)

		return data as ChannelWithLinks[]
	} catch (error) {
		console.error(error)
		return []
	}
}

export const getOverlay = async (id?: string) => {
	const overlay = await prisma.channelKitOverlay.findFirst({
		where: {
			channel: {
				id
			}
		},
		include: {
			primaryKit: {
				include: {
					options: true,
					base: {
						include: {
							commandCodes: true
						}
					}
				}
			},
			secondaryKit: {
				include: {
					options: true,
					base: {
						include: {
							commandCodes: true
						}
					}
				}
			}
		}
	})

	return overlay
}