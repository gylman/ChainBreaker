// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library  Utility {
    // sorts inplace
    function quickSort(address[] memory arr, int left, int right) internal pure {
        int i = left;
        int j = right;
        if (i == j) return;
        uint pivot = uint160(arr[uint(left + (right - left) / 2)]);
        while (i <= j) {
            while (uint160(arr[uint(i)]) < pivot) i++;
            while (pivot < uint160(arr[uint(j)])) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    // return sorted copy
    function sort(address[] memory data) internal pure returns (address[] memory) {
        address[] memory sorted = new address[](data.length);
        for (uint i = 0; i < data.length; i++) {
            sorted[i] = data[i];
        }
        quickSort(sorted, int(0), int(sorted.length - 1));
        return sorted;
    }
}
