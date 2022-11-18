import { WarzoneTwoKitBaseModel, WarzoneTwoKitOptionModel } from "@kittr/prisma/validator"
import { createController } from "@Server/createController"
import { authenticateAdmin } from "@Server/middlewares/authenticateAdmin"
import * as AdminWarzone2Service from "@Server/services/admin/warzone2"
import { z } from "zod"
import { prisma } from "@kittr/prisma"

const listKitBases = createController()
	.middleware(authenticateAdmin)
	.query("", {
		async resolve() {
			const result = await AdminWarzone2Service.listKitBases()

			return result
		}
	})

const getKitBase = createController()
	.middleware(authenticateAdmin)
	.query("", {
		input: z.object({
			kitBaseId: z.string()
		}),
		async resolve({ input }) {
			const result = await AdminWarzone2Service.getKitBase(input)

			return result
		}
	})

const listKitBaseCategories = createController()
	.middleware(authenticateAdmin)
	.query("", {
		async resolve() {
			const result = await AdminWarzone2Service.listKitBaseCategories()

			return result
		}
	})

export const createBase = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			base: WarzoneTwoKitBaseModel.omit({ id: true }),
			commandCodes: z.string()
		}),
		async resolve({ input }) {
			const commandCodesArr = input.commandCodes.split(",").map((el) => el.trim())

			const updatedBase = await AdminWarzone2Service.createKitBase({
				base: input.base,
				commandCodes: commandCodesArr
			})

			console.log({ updatedBase })

			return updatedBase
		}
	})

export const updateBase = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			base: WarzoneTwoKitBaseModel,
			commandCodes: z.string().nullable()
			// categoryId: z.string(),
			// options: z.array(Warzone2KitOptionModel)
		}),
		async resolve({ input }) {
			await prisma.warzoneTwoCommandCode.deleteMany({
				where: {
					kitBaseId: input.base.id
				}
			})

			const updatedBase = await AdminWarzone2Service.updateKitBase({
				base: input.base,
				commandCodes: input.commandCodes?.split(",") ?? null
				// categoryId: input.categoryId,
				// options: input.options
			})

			return updatedBase
		}
	})

export const deleteBase = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			kitBaseId: z.string()
		}),
		async resolve({ input }) {
			const updatedBase = await AdminWarzone2Service.deleteKitBase({
				kitBaseId: input.kitBaseId
			})

			return updatedBase
		}
	})

export const updateOptionsForBase = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			baseId: z.string(),
			options: z.array(WarzoneTwoKitOptionModel)
		}),
		async resolve({ input }) {
			const updatedBase = await AdminWarzone2Service.updateOptionsForBase({
				baseId: input.baseId,
				options: input.options
			})

			return updatedBase
		}
	})

export const createOption = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			baseId: z.string(),
			option: WarzoneTwoKitOptionModel.omit({ id: true })
		}),
		async resolve({ input }) {
			const updatedBase = await AdminWarzone2Service.createOption(input)

			return updatedBase
		}
	})

export const updateOption = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: WarzoneTwoKitOptionModel,
		async resolve({ input }) {
			const updatedBase = await AdminWarzone2Service.updateOption(input)

			return updatedBase
		}
	})

export const deleteOption = createController()
	.middleware(authenticateAdmin)
	.mutation("", {
		input: z.object({
			optionId: z.string()
		}),
		async resolve({ input }) {
			const deletedOption = await AdminWarzone2Service.deleteOption(input.optionId)

			return deletedOption
		}
	})

export const Warzone2AdminController = {
	listKitBases,
	getKitBase,
	listKitBaseCategories,
	createBase,
	updateBase,
	deleteBase,
	updateOptionsForBase,
	updateOption,
	createOption,
	deleteOption
}
