import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainBreak } from "../typechain-types";
import { getFirstUserAddress } from "./utils";
let contract: ChainBreak;
describe("ChainBreak", function () {
  it("deploy ChainBreak", async () => {
    const [deployer, user1, user2, user3] = await ethers.getSigners();

    contract = await ethers.deployContract("ChainBreak", []);
    await contract
      .connect(user1)
      .createTx(user2, 100, "test", true, { from: user1.address })
      .then((tx) => tx.wait());
  });

  it("create and confirm tx", async () => {
    const [deployer, user1, user2, user3] = await ethers.getSigners();

    const firstUser = getFirstUserAddress([user1.address, user2.address]);

    const data = await contract.channelFor(user1, user2);
    expect(data.balance1).to.equal(0);
    expect(data.balance2).to.equal(0);
    expect(data.fees).to.equal(0);
    expect(data.txs.length).to.equal(1);
    const firstTx = data.txs[0];
    expect(firstTx.amount).to.equal(100);
    expect(firstTx.description).to.equal("test");
    expect(firstTx.status).to.equal(firstUser === user1.address ? 0 : 1);

    await contract.connect(user2).confirmTx(user1, 0);
    {
      const data = await contract.channelFor(user1, user2);
      expect(data.balance1).to.equal(-100);
      expect(data.balance2).to.equal(100);
      expect(data.fees).to.equal(0);
      expect(data.txs.length).to.equal(1);
      const firstTx = data.txs[0];
      expect(firstTx.amount).to.equal(100);
      expect(firstTx.description).to.equal("test");
      expect(firstTx.status).to.equal(2);
    }
  });
});
