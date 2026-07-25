import { indexer } from "envio";

indexer.onEvent({ contract: "StableFactory", event: "TokenCreated" } as any, async ({ event, context }: any) => {
  try {
    context.Token.set({
      id: String(event.params.token).toLowerCase(),
      address: String(event.params.token).toLowerCase(),
      creator: String(event.params.creator).toLowerCase(),
      name: String(event.params.name || ""),
      symbol: String(event.params.symbol || ""),
      imageURI: String(event.params.imageURI || ""),
      pool: String(event.params.pool).toLowerCase(),
      chainId: 988,
      supply: BigInt(String(event.params.supply || 0)),
      createdAt: Number(event.block.timestamp),
      createdBlock: Number(event.block.number),
    });
  } catch (e) {
    // Skip errors silently
  }
});
