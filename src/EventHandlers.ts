import { indexer } from "envio";

indexer.onEvent({ contract: "StableV3Pool", event: "Swap" } as any, async ({ event, context }: any) => {
  try {
    const swapId = event.transaction.hash + "-" + String(event.logIndex || 0);
    context.Swap.set({
      id: swapId,
      pool: event.srcAddress.toLowerCase(),
      token: "",
      chainId: 988,
      sender: String(event.params.sender || ""),
      recipient: String(event.params.recipient || ""),
      amount0: BigInt(String(event.params.amount0 || 0)),
      amount1: BigInt(String(event.params.amount1 || 0)),
      sqrtPriceX96: BigInt(String(event.params.sqrtPriceX96 || 0)),
      liquidity: BigInt(String(event.params.liquidity || 0)),
      tick: BigInt(String(event.params.tick || 0)),
      blockNumber: Number(event.block.number),
      blockTimestamp: Number(event.block.timestamp),
      transactionHash: String(event.transaction.hash),
    });
  } catch (e) {
    // Skip errors silently
  }
});
