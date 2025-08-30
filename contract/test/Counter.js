import { expect } from "chai";

describe("Counter", function () {
  async function deployCounterFixture() {
    const [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    return { counter, owner };
  }

  it("Should start at 0", async function () {
    const { counter } = await deployCounterFixture();
    expect(await counter.count()).to.equal(0);
  });

  it("Should increment", async function () {
    const { counter } = await deployCounterFixture();
    await counter.increment();
    expect(await counter.count()).to.equal(1);
  });

  it("Should decrement", async function () {
    const { counter } = await deployCounterFixture();
    await counter.increment(); // make it 1 first
    await counter.decrement();
    expect(await counter.count()).to.equal(0);
  });
});
