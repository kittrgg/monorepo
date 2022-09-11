import { withThemes } from "@react-theming/storybook-addon"
import { MantineProvider, Center } from "@kittr/ui"

// export const parameters = {
// 	actions: { argTypesRegex: "^on[A-Z].*" },
// 	controls: {
// 		matchers: {
// 			color: /(background|color)$/i,
// 			date: /Date$/
// 		}
// 	 }
// }

export const onThemeSwitch = (context) => {
	const { theme } = context
	const background = theme.colorScheme === "dark" ? "#1D1D1F" : "#ffffff"
	const parameters = {
		backgrounds: {
			default: background
		}
		// Pass backgrounds: null to disable background switching at all
	}
	return {
		parameters
	}
}

const providerFn = ({ theme, children }) => {
	return <MantineProvider>{children}</MantineProvider>
}

export const decorators = [
	(Story) => (
		<Center sx={{ minHeight: "calc( 100vh - 2rem )" }}>
			<Story />
		</Center>
	),
	withThemes(null as any, [dark, light], { providerFn, onThemeSwitch })
]