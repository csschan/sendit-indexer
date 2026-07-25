import { indexer } from "envio";

indexer.onEvent({ contract: "StableFactory", event: "TokenCreated" } as any, async ({ event, context }: any) => {
  const tokenAddr = event.params.token.toLowerCase();
  const poolAddr = event.params.pool.toLowerCase();

  context.Token.set({
    id: tokenAddr,
    address: tokenAddr,
    creator: event.params.creator.toLowerCase(),
    name: event.params.name,
    symbol: event.params.symbol,
    imageURI: event.params.imageURI,
    pool: poolAddr,
    chainId: event.chainId,
    supply: BigInt(event.params.supply.toString()),
    createdAt: event.block.timestamp,
    createdBlock: event.block.number,
  });

  context.LiquidityPool.set({
    id: poolAddr,
    token: tokenAddr,
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
