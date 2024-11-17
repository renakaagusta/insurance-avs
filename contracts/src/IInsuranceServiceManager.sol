// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IInsuranceServiceManager {
    event NewClaimCreated(uint32 indexed claimIndex, Claim claim);

    event ClaimResponded(uint32 indexed claimIndex, Claim claim, address operator);

    struct Claim {
        address pool;
        address insured;
        bool isApproved;
        uint32 claimCreatedBlock;
    }

    function latestClaimNum() external view returns (uint32);

    function allClaimHashes(
        uint32 claimIndex
    ) external view returns (bytes32);

    function allClaimResponses(
        address operator,
        uint32 claimIndex
    ) external view returns (bytes memory);

    function createNewClaim(
        address pool,
        address insured
    ) external returns (Claim memory);

    function respondToClaim(
        Claim calldata claim,
        uint32 referenceClaimIndex,
        bytes calldata signature
    ) external;
}
