pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;


contract EncoderTest {
    struct TestStruct {
        uint256 a;
        uint256 b;
        uint256 c;
        InnerTestStruct[] d;
    }

    struct InnerTestStruct {
        address a;
        uint128 b;
        uint128 c;
    }

    uint256 private number = 0;

    function test1(uint256 n) external pure returns (TestStruct[] memory testStructs) {
        testStructs = new TestStruct[](n);

        for (uint256 i = 0; i < n; i++) {
            (testStructs[i].a, testStructs[i].b, testStructs[i].c) = getData(i);
            testStructs[i].d = new InnerTestStruct[](0);
        }

        return testStructs;
    }

    function test2(uint256 n) external pure returns (TestStruct memory testStruct) {
        return TestStruct(n, n, n, new InnerTestStruct[](n));
    }

    function test3() external view returns (TestStruct memory testStruct) {
        return TestStruct(number, number, number, new InnerTestStruct[](number));
    }

    function test4() external pure returns (uint256) {
        return 123;
    }

    function getData(uint256 i) internal pure returns (uint256 a, uint256 b, uint256 c) {
        return (i, i, i);
    }
}