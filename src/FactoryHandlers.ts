import { indexer } from "envio";

indexer.onEvent({ contract: "StableFactory", event: "TokenCreated" } as any, async ({ event, context }: any) => {
  context.Token.set({
    id: event.params.token.toLowerCase(),
    address: event.params.token.toLowerCase(),
    creator: event.params.creator.toLowerCase(),
    name: event.params.name,
    symbol: event.params.symbol,
    imageURI: event.params.imageURI,
    pool: event.params.pool.toLowerCase(),
    chainId: event.chainId,
    supply: event.params.supply,
    createdAt: event.block.timestamp,
    createdBlock: event.block.number,
  });

  context.LiquidityPool.set({
    id: event.params.pool.toLowerCase(),
    token: event.params.token.toLowerCase(),
    chainId: event.chainId,
    tick: 0n,
    cumulativeVolume0: 0n,
    cumulativeVolume1: 0n,
    swapCount: 0,
    lastPrice: 0n,
    lastUpdateTimestamp: BigInt(event.block.timestamp),
    lastUpdateBlock: BigInt(event.block.number),
  });
});
