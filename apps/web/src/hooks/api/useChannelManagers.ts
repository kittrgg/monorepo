import { IManagerData } from "@kittr/types/manager"
import { useQuery } from "react-query"
import { getToken } from "@Services/firebase/auth/getToken"
import { useDashboardChannel } from "@Hooks/api/useDashboardChannel"
import fetch from "@Fetch"

export const useChannelManagers = () => {
	const { data } = useDashboardChannel()

	const result = useQuery(["getManagerInfo", data?.managers], async () => {
		const aborter = new AbortController()

		const fetchManagerInfo = async (uid: string) => {
			return fetch.get<IManagerData>({
				url: `/api/manager/getInfo?uid=${uid}`,
				signal: aborter.signal,
				headers: { authorization: `Bearer: ${await getToken()}` }
			})
		}

		const result = data
			? data.managers.map(async (elem) => ({
					...(await fetchManagerInfo(elem.firebaseId)),
					role: elem.role,
					id: elem.id
			  }))
			: []

		return await Promise.all(result)
	})

	return result
}
