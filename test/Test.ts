import assert from "assert";
import { 
  TestHelpers,
  AmertisRouter_AmertisSwap
} from "generated";
const { MockDb, AmertisRouter } = TestHelpers;

describe("AmertisRouter contract AmertisSwap event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for AmertisRouter contract AmertisSwap event
  const event = AmertisRouter.AmertisSwap.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("AmertisRouter_AmertisSwap is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await AmertisRouter.AmertisSwap.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualAmertisRouterAmertisSwap = mockDbUpdated.entities.AmertisRouter_AmertisSwap.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedAmertisRouterAmertisSwap: AmertisRouter_AmertisSwap = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      _tokenIn: event.params._tokenIn,
      _tokenOut: event.params._tokenOut,
      _amountIn: event.params._amountIn,
      _amountOut: event.params._amountOut,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualAmertisRouterAmertisSwap, expectedAmertisRouterAmertisSwap, "Actual AmertisRouterAmertisSwap should be the same as the expectedAmertisRouterAmertisSwap");
  });
});
