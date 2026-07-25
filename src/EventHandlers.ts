import { indexer } from "envio";

indexer.onEvent({ contract: "StableV3Pool", event: "Swap" } as any, async ({ event, context }: any) => {
  const poolId = event.srcAddress.toLowerCase();
  const existing = await context.LiquidityPool.get(poolId);

  const a0 = BigInt(event.params.amount0.toString());
  const a1 = BigInt(event.params.amount1.toString());
  const vol0 = a0 < 0n ? -a0 : a0;
  const vol1 = a1 < 0n ? -a1 : a1;

  const newPool = {
    id: poolId,
    token: existing?.token || "",
    chainId: event.chainId,
    tick: BigInt(event.params.tick.toString()),
    cumulativeVolume0: (existing?.cumulativeVolume0 || 0n) + vol0,
    cumulativeVolume1: (existing?.cumulativeVolume1 || 0n) + vol1,
    swapCount: (existing?.swapCount || 0) + 1,
    lastPrice: BigInt(event.params.sqrtPriceX96.toString()),
    lastUpdateTimestamp: BigInt(event.block.timestamp),
    lastUpdateBlock: BigInt(event.block.number),
  };
  context.LiquidityPool.set(newPool);

  const swapId = event.transaction.hash + "-" + String(event.logIndex || 0);
  context.Swap.set({
    id: swapId,
    pool: poolId,
    token: existing?.token || "",
    chainId: event.chainId,
    sender: event.params.sender,
    recipient: event.params.recipient,
    amount0: a0,
    amount1: a1,
    sqrtPriceX96: BigInt(event.params.sqrtPriceX96.toString()),
    liquidity: BigInt(event.params.liquidity.toString()),
    tick: BigInt(event.params.tick.toString()),
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});
