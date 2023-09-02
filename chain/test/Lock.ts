import { expect } from "chai";
import { ethers } from "hardhat";
import { ChainBreak } from "../typechain-types";
import { getFirstUserAddress } from "./utils";
import _ from "lodash";
type HHSigner = (ReturnType<typeof ethers.getSigners> extends Promise<infer T>
  ? T
  : never)[0];
let contract: ChainBreak;
let deployer: HHSigner;
let user1: HHSigner;
let user2: HHSigner;
let user3: HHSigner;

describe("ChainBreak", function () {
  it("deploy ChainBreak", async () => {
    const [d, u1, u2, u3] = await ethers.getSigners();
    deployer = d;
    user1 = u1;
    user2 = u2;
    user3 = u3;

    contract = await ethers.deployContract("ChainBreak", []);
    await contract
      .connect(user1)
      .createTx(user2, 100, "test", true, 0, { from: user1.address })
      .then((tx) => tx.wait());
  });

  it("create and confirm tx", async () => {
    const [firstUser, secondUser, { balance1, balance2, fees, txs }] =
      await contract.channelFor(user1, user2);
    expect(balance1).to.equal(0);
    expect(balance2).to.equal(0);
    expect(fees).to.equal(0);
    expect(txs.length).to.equal(1);
    const firstTx = txs[0];
    expect(firstTx.amount).to.equal(100);
    expect(firstTx.description).to.equal("test");
    expect(firstTx.status).to.equal(firstUser === user1.address ? 0 : 1);

    const [pendingTransaction] = await contract.getPendingTxs(user2);
    expect(pendingTransaction.tx.amount).to.equal(100);

    await contract.connect(user2).confirmTx(user1, 0);
    {
      const [, , { balance1, balance2, txs }] = await contract.channelFor(
        user1,
        user2,
      );
      expect(balance1).to.equal(-100);
      expect(balance2).to.equal(100);
      expect(fees).to.equal(0);
      expect(txs.length).to.equal(1);
      const firstTx = txs[0];
      expect(firstTx.status).to.equal(2);
    }
  });

  it("create second channel", async () => {
    await contract.connect(user2).createTx(user3, 200, "test", true, 0);

    await contract.connect(user3).confirmTx(user2, 0);
    const [, , { balance1, balance2 }] = await contract.channelFor(
      user2,
      user3,
    );
    expect(balance1).to.equal(200);
    expect(balance2).to.equal(-200);
  });
  it("create channel between 1 and 3 user", async () => {
    await contract.connect(user3).createTx(user1, 300, "test", true, 0);
    await contract.connect(user1).confirmTx(user3, 0);
    const [, , { balance1, balance2 }] = await contract.channelFor(
      user1,
      user3,
    );
    expect(balance1).to.equal(-300);
    expect(balance2).to.equal(300);
  });

  it("try to liquidate", async () => {
    const semiRoute = await Promise.all(
      [
        [user1, user2],
        [user3, user1],
        [user2, user3],
      ].map(async ([u1, u2]) => {
        const users = await contract.sort(u1, u2);
        const balances = await contract
          .channelFor(u1, u2)
          .then(([, , { balance1, balance2 }]) => [balance1, balance2]);

        return _.zip(users, balances)
          .map(([user, balance]) => ({
            user,
            balance,
          }))
          .sort((a, b) => Number(b.balance) - Number(a.balance));
      }),
    )
      .then((pairs) => pairs.flatMap((pair) => pair))
      .then((flatPairs) =>
        _(flatPairs)
          .uniqBy((el) => el.user)
          .reverse()
          .value(),
      );
    const res = await contract.tryFindDebtCircuit();
    console.log(res);


    const route = [...semiRoute, semiRoute[0]];
    console.log(route.map((el) => el.user!));
    await contract.connect(deployer).breakDebtCircuit(
      res[0].map(i => i),
      100,
    );
    {
      const [, , { balance1, balance2 }] = await contract.channelFor(
        user1,
        user2,
      );
      expect(balance1).to.equal(0);
      expect(balance2).to.equal(0);
    }
    {
      const [, , { balance1, balance2 }] = await contract.channelFor(
        user2,
        user3,
      );
      expect(balance1).to.equal(100);
      expect(balance2).to.equal(-100);
    }
    {
      const [, , { balance1, balance2 }] = await contract.channelFor(
        user3,
        user1,
      );
      expect(balance1).to.equal(-200);
      expect(balance2).to.equal(200);
    }
  });
  it("user reject transaction", async () => {
    await contract.connect(user1).createTx(user2, 100, "test", true, 0);
    const [, , { txs }] = await contract.channelFor(user1, user2);
    expect(txs.at(-1)?.status).to.equal(1);

    await contract.connect(user2).rejectTx(user1, txs.length - 1);
    {
      const [, , { txs }] = await contract.channelFor(user1, user2);
      expect(txs.at(-1)!.status).to.equal(3);
    }
  });
});
