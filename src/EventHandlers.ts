import {
  StableV3Pool_Swap_loader,
  StableV3Pool_Swap_handler,
} from "../generated/src/Handlers.gen";

// Load existing pool entity
StableV3Pool_Swap_loader(({ event, context }) => {
  context.LiquidityPool.load(event.srcAddress.toString());
});

// Handle Swap events from V3 pools
StableV3Pool_Swap_handler(({ event, context }) => {
  const poolId = event.srcAddress.toString();
  let pool = context.LiquidityPool.get(poolId);

  if (pool == undefined) {
    pool = {
      id: poolId,
      token: "", // Will be set when we know the token
      chainId: event.chainId,
      tick: event.params.tick,
      cumulativeVolume0: event.params.amount0 < 0n ? -event.params.amount0 : event.params.amount0,
      cumulativeVolume1: event.params.amount1 < 0n ? -event.params.amount1 : event.params.amount1,
      swapCount: 1,
      lastPrice: event.params.sqrtPriceX96,
      lastUpdateTimestamp: BigInt(event.blockTimestamp),
      lastUpdateBlock: BigInt(event.blockNumber),
    };
  } else {
    const vol0 = event.params.amount0 < 0n ? -event.params.amount0 : event.params.amount0;
    const vol1 = event.params.amount1 < 0n ? -event.params.amount1 : event.params.amount1;
    pool = {
      ...pool,
      tick: event.params.tick,
      cumulativeVolume0: pool.cumulativeVolume0 + vol0,
      cumulativeVolume1: pool.cumulativeVolume1 + vol1,
      swapCount: pool.swapCount + 1,
      lastPrice: event.params.sqrtPriceX96,
      lastUpdateTimestamp: BigInt(event.blockTimestamp),
      lastUpdateBlock: BigInt(event.blockNumber),
    };
  }

  context.LiquidityPool.set(pool);

  // Store individual swap
  context.Swap.set({
    id: event.transactionHash + "-" + event.logIndex.toString(),
    pool: poolId,
    token: pool.token || "",
    chainId: event.chainId,
    sender: event.params.sender,
    recipient: event.params.recipient,
    amount0: event.params.amount0,
    amount1: event.params.amount1,
    sqrtPriceX96: event.params.sqrtPriceX96,
    liquidity: event.params.liquidity,
    tick: event.params.tick,
    blockNumber: event.blockNumber,
    blockTimestamp: event.blockTimestamp,
    transactionHash: event.transactionHash,
  });
});
