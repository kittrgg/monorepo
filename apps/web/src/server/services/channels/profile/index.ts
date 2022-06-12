import { prisma } from "@kittr/prisma"
import { TRPCError } from "@trpc/server"

export * from "./affiliates"

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

export const getChannelProfile = async ({ id, urlSafeName }: { id: string; urlSafeName: string }) => {
	if (!id && !urlSafeName) {
		throw new TRPCError({ code: "BAD_REQUEST", message: "Need either id or urlSafeName" })
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
