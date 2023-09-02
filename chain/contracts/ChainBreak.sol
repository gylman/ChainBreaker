// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utility.sol";
import "hardhat/console.sol";

contract ChainBreak {
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

    struct TxView {
        address user1;
        address user2;
        uint idx;
        Tx tx;
    }

    // all addresses user has channels with
    mapping (address => address[]) public userContacts;
    mapping (address => mapping (address => Channel)) private channels;

    function sort(address user1, address user2) public pure returns (address, address) {
        return user1 <= user2 ? (user1, user2) : (user2, user1);
    }

    function channelFor(address user1, address user2) public view returns (Channel memory) {
        (user1, user2) = sort(user1, user2);
        return channels[user1][user2];
    }

    function getTx(address user1, address user2, uint idx) external view returns (Tx memory) {
        (user1, user2) = sort(user1, user2);
        return channels[user1][user2].txs[idx];
    }

    function getPendingTxs(address user) external view returns (TxView[] memory) {
        // optimistically
        TxView[] memory txs = new TxView[](100);
        uint pointer = 0;

        for (uint i = 0; i < userContacts[user].length; i++) {
            (address user1, address user2) = sort(userContacts[user][i], user);
            Channel storage _channel = channels[user1][user2];
            for (uint j = 0; j < _channel.txs.length; j++) {
                if (
                    (user == user1 && _channel.txs[j].status == TxStatus.CreatedBy2) ||
                    (user == user2 && _channel.txs[j].status == TxStatus.CreatedBy1)
                ) {
                    txs[pointer] = TxView({
                        user1: user1,
                        user2: user2,
                        idx: j,
                        tx: _channel.txs[j]
                    });
                    pointer += 1;
                    if (pointer == 100) return txs;
                }
            }
        }
        return txs;
    }

    function createTx(address user, int amount, string calldata description, bool send) external payable {
        require (amount > 0, "ChainBreak::createTx: negative amount");
        require (user != msg.sender, "ChainBreak::createTx: bad user");

        (address user1, address user2) = sort(msg.sender, user);
        TxStatus _status = msg.sender == user1 ? TxStatus.CreatedBy1 : TxStatus.CreatedBy2;

        bool _from1;
        if (_status == TxStatus.CreatedBy1) {
            _from1 = send;
        } else {
            _from1 = !send;
        }

        Channel storage _channel = channels[user1][user2];
        if (_channel.txs.length == 0) {
            userContacts[user1].push(user2);
            userContacts[user2].push(user1);
        }

        Tx memory _tx = Tx(amount, description, uint32(block.timestamp), _from1, _status, TxType.Regular);
        _channel.fees += msg.value;
        _channel.txs.push(_tx);

        emit Transaction(user1, user2, _tx, _channel.txs.length - 1);
    }

    function rejectTx(address user, uint idx) external {
        (address user1, address user2) = sort(msg.sender, user);

        Channel storage _channel = channels[user1][user2];
        Tx storage _tx = _channel.txs[idx];

        require (!(_tx.status == TxStatus.Confirmed || _tx.status == TxStatus.Rejected), "ChainBreak::rejectTx: bad status");
        require (_tx.amount > 0, "ChainBreak::rejectTx: bad amount");

        _tx.status = TxStatus.Rejected;
        emit TransactionRejected(user1, user2, _tx, idx);
    }

    function confirmTx(address user, uint idx) external {
        (address user1, address user2) = sort(msg.sender, user);

        Channel storage _channel = channels[user1][user2];
        Tx storage _tx = _channel.txs[idx];

        require (!(_tx.status == TxStatus.Confirmed || _tx.status == TxStatus.Rejected), "ChainBreak::confirmTx: bad status");
        require (_tx.amount > 0, "ChainBreak::confirmTx: bad amount");

        if (_tx.status == TxStatus.CreatedBy1) {
            require (msg.sender == user2, "ChainBreak::confirmTx: cant confirm");
        } else {
            require (msg.sender == user1, "ChainBreak::confirmTx: cant confirm");
        }

        _tx.status = TxStatus.Confirmed;
        if (_tx.from1) {
            _channel.balance1 += _tx.amount;
            _channel.balance2 -= _tx.amount;
        } else {
            _channel.balance1 -= _tx.amount;
            _channel.balance2 += _tx.amount;
        }

        emit TransactionConfirmed(user1, user2, _tx, idx);
    }

    // user[i] sends amount to user[i + 1]
    function breakDebtCircuit(address[] calldata users, int amount) external {
        require (amount > 0, "ChainBreak::breakDebtCircuit: negative amount");

        address[] memory sorted = Utility.sort(users[:users.length - 1]);
        // -2 because last elem == first elem
        for (uint i = 0; i < sorted.length - 1; i++) {
            require (sorted[i] != sorted[i + 1], "ChainBreak::breakDebtCircuit: duplicate elements");
        }
        require (users[0] == users[users.length - 1], "ChainBreak::breakDebtCircuit: bad path");
        // all checks for correct path done, we have cyclic graph

        uint totalFees = 0;
        for (uint i = 0; i < users.length - 1; i++) {
            (address user1, address user2) = sort(users[i], users[i + 1]);

            Channel storage _channel = channels[user1][user2];
            Tx memory _tx;
            if (users[i] == user1) {
                _channel.balance1 += amount;
                _channel.balance2 -= amount;
                // tx amount should be lower or eq to user[i] debt to user[i + 1]
                require (_channel.balance2 >= 0, "ChainBreak::breakDebtCircuit: bad operation");
                _tx = Tx(amount, "", uint32(block.timestamp), true, TxStatus.Confirmed, TxType.Auto);
            } else {
                _channel.balance2 += amount;
                _channel.balance1 -= amount;
                // tx amount should be lower or eq to user[i + 1] debt to user[i]
                require (_channel.balance1 >= 0, "ChainBreak::breakDebtCircuit: bad operation");
                _tx = Tx(amount, "", uint32(block.timestamp), false, TxStatus.Confirmed, TxType.Auto);
            }
            totalFees += _channel.fees;

            _channel.txs.push(_tx);
            _channel.fees = 0;

            emit Transaction(user1, user2, _tx, _channel.txs.length - 1);
        }

        if (totalFees > 0) {
            payable(msg.sender).transfer(totalFees);
        }
    }

}
