import React, { useEffect, useState } from "react"
import { createRaribleSdk } from "@rarible/sdk"
import type { ConnectionState } from "@rarible/connector"
import { getStateDisconnected, IConnector } from "@rarible/connector"
import { IRaribleSdk } from "@rarible/sdk/build/domain"
import type { IWalletAndAddress } from "@rarible/connector-helper"
import { RaribleSdkEnvironment } from "@rarible/sdk/build/config/domain"
import { getConnector } from "./connectors-setup"

export interface IConnectorContext {
	connector?: IConnector<string, IWalletAndAddress>
	state: ConnectionState<IWalletAndAddress>
	sdk?: IRaribleSdk
	walletAddress?: string
}

export const ConnectorContext = React.createContext<IConnectorContext>({
	connector: undefined,
	state: getStateDisconnected(),
	sdk: undefined,
	walletAddress: undefined
})

const environment: RaribleSdkEnvironment  = "development"

export function SdkConnectionProvider({children}: {children: React.ReactNode}) {
	const [context, setContext] = useState<IConnectorContext>()
	const [sdk, setSdk] = useState<IRaribleSdk>()
	const connector = getConnector(environment)

	useEffect(() => {
		const subscription = connector.connection.subscribe(s => {
			const sdkInstance = s.status === "connected" ? createRaribleSdk(s.connection.wallet, environment) : undefined
			setSdk(sdkInstance)
			const computedContext: IConnectorContext = {
				connector,
				state: s,
				sdk,
				walletAddress: s.status === "connected" ? s.connection.blockchain + ":" + s.connection.address : undefined,
			}
			setContext(computedContext)
		})
		return () => subscription.unsubscribe()
//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <ConnectorContext.Provider value={context!}>
		{children}
	</ConnectorContext.Provider>
}
