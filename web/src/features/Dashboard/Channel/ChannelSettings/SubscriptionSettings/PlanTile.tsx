import { ReactNode } from "react"
import styled from "styled-components"

import colors from "@Colors"
import { Button, SVG } from "@Components/shared"
import { header2, paragraph } from "@Styles/typography"
import { usePremiumStatus } from "@Redux/slices/dashboard/selectors"

interface Props {
	planType?: "premium"
	title: string
	price: string | ReactNode
	description: string
	buttonText: string
	buttonStyle: "transparent" | "white" | "default"
	buttonAction: (...args: any) => any
}

const PlanTile = ({ planType, title, price, description, buttonText, buttonStyle, buttonAction }: Props) => {
	const { isPremium } = usePremiumStatus()

	const isActive = !!planType ? !!isPremium : !planType && !isPremium

	return (
		<Container isPremium={!!planType} isActive={isActive}>
			<HorizFlex>
				<Title>{title}</Title>
				<Price isPremium={!!planType}>{price}</Price>
			</HorizFlex>
			<Description isPremium={!!planType}>{description}</Description>
			<Button design={buttonStyle} onClick={buttonAction} text={buttonText} />
			{isActive && (
				<SVG.CheckMark
					width="20px"
					stroke={colors.black}
					style={{
						position: "absolute",
						top: "-18px",
						right: "-18px",
						height: "20px",
						padding: "8px",
						backgroundColor: colors.white,
						borderRadius: "100%"
					}}
				/>
			)}
		</Container>
	)
}

export default PlanTile

const Container = styled.div<{ isPremium: boolean; isActive: boolean }>`
	position: relative;
	width: 100%;
	padding: 36px;
	box-shadow: 0px 0px 36px 0px #0000008c;
	border-radius: 6px;
	border: 2px solid ${(props) => (props.isActive ? colors.white : "transparent")};
	background: ${(props) =>
		props.isPremium
			? `linear-gradient(106.76deg, ${colors.premium} 17.81%, ${colors.premium} 50.47%, ${colors.premiumDark} 83.13%)`
			: colors.dark20};
`

const HorizFlex = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const Title = styled.h4`
	${header2}
	font-size: 20px;
`

const Price = styled.h4<{ isPremium: boolean }>`
	${header2};
	margin-left: 36px;
	text-align: right;
	font-size: 20px;
	opacity: 0.9;
	color: ${(props) => (props.isPremium ? colors.premiumLight : colors.lighter)};
`

const Description = styled.p<{ isPremium: boolean }>`
	${paragraph};
	margin: 36px 0;
	color: ${(props) => (props.isPremium ? colors.premiumLight : colors.lighter)};
`
