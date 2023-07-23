import "@polkadot/api-augment"
import "@polkadot/types-augment"

import { ApiPromise } from "@polkadot/api"
import { Balance } from "@polkadot/types/interfaces/runtime"
import { ScProvider } from "@polkadot/rpc-provider/substrate-connect"
import * as Sc from "@substrate/connect"

async function main() {
  const lightProvider = new ScProvider(Sc, Sc.WellKnownChain.polkadot)
  await lightProvider.connect()
  const api = await ApiPromise.create({ provider: lightProvider })

  console.log(
    `Connected to Polkadot using substrate-connect.${(
      await api.rpc.system.chain()
    ).toHuman()} [ss58: ${api.registry.chainSS58}]`,
  )

  for (const key in api.query) {
    if (api.query[key] && api.query[key].palletVersion) {
      console.log(key, (await api.query[key].palletVersion()).toHuman())
    }
  }

  // reading a constant
  const ED: Balance = api.consts.balances.existentialDeposit
  console.log(ED.toHuman())

  // subscribe to finalized blocks:
  await api.rpc.chain.subscribeFinalizedHeads((header) => {
    console.log(`finalized block #${header.number}`)
  })
}

main().catch(console.error)
