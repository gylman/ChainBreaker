// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utility.sol";

contract ChainBreak {
    event Transaction(address user1, address user2, Tx transaction, uint idx);
    event TransactionConfirmed(address user1, address user2, Tx transaction, uint idx);

    enum TxStatus {CreatedBy1, CreatedBy2, Confirmed}
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

    mapping (address => mapping (address => Channel)) private channels;

    function sort(address user1, address user2) public pure returns (address, address) {
        return user1 <= user2 ? (user1, user2) : (user2, user1);
    }

    function channelFor(address user1, address user2) public view returns (Channel memory) {
        (user1, user2) = sort(user1, user2);
        return channels[user1][user2];
    }

    function createTx(address user, int amount, string calldata description, bool send) external payable {
        require (amount > 0, "ChainBreak::createTx: negative amount");

        (address user1, address user2) = sort(msg.sender, user);
        TxStatus _status = msg.sender == user1 ? TxStatus.CreatedBy1 : TxStatus.CreatedBy2;

        bool _from1;
        if (_status == TxStatus.CreatedBy1) {
            _from1 = send;
        } else {
            _from1 = !send;
        }

        Channel storage _channel = channels[user1][user2];
        Tx memory _tx = Tx(amount, description, uint32(block.timestamp), _from1, _status, TxType.Regular);
        _channel.fees += msg.value;
        _channel.txs.push(_tx);

        emit Transaction(user1, user2, _tx, _channel.txs.length - 1);
    }

    function confirmTx(address user, uint idx) external {
        (address user1, address user2) = sort(msg.sender, user);

        Channel storage _channel = channels[user1][user2];
        Tx memory _tx = _channel.txs[idx];

        require (!(_tx.status == TxStatus.Confirmed), "ChainBreak::confirmTx: bad status");
        require (!(_tx.amount > 0), "ChainBreak::confirmTx: bad amount");

        if (_tx.status == TxStatus.CreatedBy1) {
            require (msg.sender == user2, "ChainBreak::confirmTx: cant confirm");
        } else {
            require (msg.sender == user1, "ChainBreak::confirmTx: cant confirm");
        }

        _tx.status == TxStatus.Confirmed;
        if (_tx.from1) {
            _channel.balance1 += _tx.amount;
            _channel.balance2 -= _tx.amount;
        } else {
            _channel.balance1 -= _tx.amount;
            _channel.balance2 += _tx.amount;
        }

        _channel.txs[idx] = _tx;
        emit TransactionConfirmed(user1, user2, _tx, idx);
    }

    function breakDebtCircuit(address[] memory users, uint amount) external {
        address[] memory sorted = Utility.sort(users);
    }

}
