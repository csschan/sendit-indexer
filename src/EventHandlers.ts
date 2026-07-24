import { indexer } from "envio";

indexer.onEvent({ contract: "StableV3Pool", event: "Swap" } as any, async ({ event, context }: any) => {
  const poolId = event.srcAddress.toLowerCase();
  const existing = await context.LiquidityPool.get(poolId);

  const vol0 = event.params.amount0 < 0n ? -event.params.amount0 : event.params.amount0;
  const vol1 = event.params.amount1 < 0n ? -event.params.amount1 : event.params.amount1;

  if (!existing) {
    context.LiquidityPool.set({
      id: poolId,
      token: "",
      chainId: event.chainId,
      tick: event.params.tick,
      cumulativeVolume0: vol0,
      cumulativeVolume1: vol1,
      swapCount: 1,
      lastPrice: event.params.sqrtPriceX96,
      lastUpdateTimestamp: BigInt(event.block.timestamp),
      lastUpdateBlock: BigInt(event.block.number),
    });
  } else {
    context.LiquidityPool.set({
      ...existing,
      tick: event.params.tick,
      cumulativeVolume0: existing.cumulativeVolume0 + vol0,
      cumulativeVolume1: existing.cumulativeVolume1 + vol1,
      swapCount: existing.swapCount + 1,
      lastPrice: event.params.sqrtPriceX96,
      lastUpdateTimestamp: BigInt(event.block.timestamp),
      lastUpdateBlock: BigInt(event.block.number),
    });
  }

  context.Swap.set({
    id: event.transaction.hash + "-" + event.logIndex.toString(),
    pool: poolId,
    token: existing?.token || "",
    chainId: event.chainId,
    sender: event.params.sender,
    recipient: event.params.recipient,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
    sqrtPriceX96: event.params.sqrtPriceX96,
    liquidity: event.params.liquidity,
    tick: event.params.tick,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
  });
});
