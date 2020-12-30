pragma solidity 0.4.24;
//pragma experimental ABIEncoderV2;


contract MyDelegateProxy {
    uint256 internal constant FWD_GAS_LIMIT = 10000;

    address public impl;

    function () external payable {
        delegatedFwd(impl, msg.data);
    }

    function setImpl(address _impl) public {
        impl = _impl;
    }

    /**
    * @dev Performs a delegatecall and returns whatever the delegatecall returned (entire context execution will return!)
    * @param _dst Destination address to perform the delegatecall
    * @param _calldata Calldata for the delegatecall
    */
    function delegatedFwd(address _dst, bytes _calldata) internal {
        uint256 fwdGasLimit = FWD_GAS_LIMIT;

        assembly {
            let result := delegatecall(sub(gas, fwdGasLimit), _dst, add(_calldata, 0x20), mload(_calldata), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)

            // revert instead of invalid() bc if the underlying call failed with invalid() it already wasted gas.
            // if the call returned error data, forward it
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}