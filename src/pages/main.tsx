import React, { useContext, useEffect, useState } from "react"
import { ConnectorContext } from "../connector/sdk-connection-provider"
import { ProviderOption } from "@rarible/connector"
import type { IWalletAndAddress } from "@rarible/connector-helper"
import { toOrderId } from "@rarible/types"

export function MainPage() {
	const [options, setOptions] = useState<ProviderOption<string, IWalletAndAddress>[]>([])
	const connection = useContext(ConnectorContext)

	useEffect(() => {
		connection?.connector?.getOptions().then(o => {
			setOptions(o)
		})
	}, [connection])

	const connect = async (option: ProviderOption<string, IWalletAndAddress>) => {
		await connection.connector?.connect(option)
	}
	const disconnect = async () => {
		if (connection.state.status === "connected" && connection.state.disconnect) {
			await connection.state.disconnect()
		}
	}

	const someSdkAction = async () => {
		const prepare = await connection.sdk?.order.buy({orderId: toOrderId("orderid")})
		await prepare?.submit({amount: 1})
	}

	return <div>
		Connection status: {connection?.state.status}
		<div>
			<button
				disabled={connection?.state.status !== "connected"}
				onClick={disconnect}
			>
				Disconnect
			</button>
		</div>
		{options.map((option, i) => {
			return <div key={option.option}>
				<button
					onClick={() => connect(option)}
					disabled={connection?.state.status !== "disconnected"}
				>
					Connect {option.option}
				</button>
			</div>
		})}
	</div>
}
