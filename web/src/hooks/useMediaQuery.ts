import { useEffect, useState } from "react"
// @ts-ignore

import { isClient } from "@Utils/helpers/isClient"
import { isWebApiSupported } from "@Utils/helpers/isWebApiSupported"

const errorMessage =
	"matchMedia is not supported, this could happen both because window.matchMedia is not supported by" +
	" your current browser or you're using the useMediaQuery hook whilst server side rendering."

export const useMediaQuery = (mediaQuery: string) => {
	const [isVerified, setIsVerified] = useState(!!window.matchMedia(mediaQuery).matches)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(mediaQuery)
		const documentChangeHandler = () => setIsVerified(!!mediaQueryList.matches)

		try {
			mediaQueryList.addEventListener("change", documentChangeHandler)
		} catch (e) {
			//Safari isn't supporting mediaQueryList.addEventListener
			console.error(e)
			mediaQueryList.addListener(documentChangeHandler)
		}

		documentChangeHandler()
		return () => {
			try {
				mediaQueryList.removeEventListener("change", documentChangeHandler)
			} catch (e) {
				//Safari isn't supporting mediaQueryList.removeEventListener
				console.error(e)
				mediaQueryList.removeListener(documentChangeHandler)
			}
		}
	}, [mediaQuery])

	if (!isClient() || !isWebApiSupported("matchMedia")) {
		console.warn(errorMessage)
		return null
	} else {
		return isVerified
	}
}
