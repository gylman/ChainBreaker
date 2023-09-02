// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IChainBreak {
    event Transaction(address user1, address user2, Tx transaction, uint idx);
    event TransactionConfirmed(address user1, address user2, Tx transaction, uint idx);
    event TransactionRejected(address user1, address user2, Tx transaction, uint idx);


    enum TxStatus {CreatedBy1, CreatedBy2, Confirmed, Rejected}
    enum TxType {Regular, Auto}

    struct Tx {
        int amount;
        string description;
        uint32 createdAt;
        bool from1; // true: 1 -> 2, false: 2 -> 1
        TxStatus status;
        TxType txType;
    }

    struct Channel {
        int balance1;
        int balance2;
        uint fees;

        Tx[] txs;
    }

    struct ChannelView {
        address user1;
        address user2;
        Channel channel;
    }

    struct UserView {
        address user;
        ChannelView[] views;
    }

    struct TxView {
        address user1;
        address user2;
        uint idx;
        Tx tx;
    }

}