import { Box } from "@mantine/core"
import React from "react"
import { Title } from "../Title"

export interface Props {
	title?: string
	action?: React.ReactNode
	children?: React.ReactNode
	hoverable?: boolean
	transparent?: boolean
}

export const SubSection = ({ title, action, children }: Props) => {
	return (
		<Box
			sx={(theme) => ({
				padding: "2rem",
				borderColor: theme.colors.gray[0],
				borderWidth: "1px",
				borderStyle: "solid",
				borderRadius: theme.radius.lg,
				height: "100%",
				position: "relative"
			})}
		>
			{action && <Box sx={{ float: "right" }}>{action}</Box>}
			{title && (
				<Title
					preset="h3"
					sx={{
						marginBottom: "1rem"
					}}
				>
					{title}
				</Title>
			)}

			<Box>{children}</Box>
		</Box>
	)
}
