// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSAServiceManagerBase} from
    "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {IServiceManager} from "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {ECDSAUpgradeable} from
    "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {IERC1271Upgradeable} from "@openzeppelin-upgrades/contracts/interfaces/IERC1271Upgradeable.sol";
import {IInsuranceServiceManager} from "./IInsuranceServiceManager.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@eigenlayer/contracts/interfaces/IRewardsCoordinator.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import {IInsurancePool} from "./IInsurancePool.sol";

/**
 * @title Primary entrypoint for procuring services from Insurance.
 * @author Eigen Labs, Inc.
 */
contract InsuranceServiceManager is ECDSAServiceManagerBase, IInsuranceServiceManager {
    using ECDSAUpgradeable for bytes32;
    using Strings for uint256;

    uint32 public latestClaimNum;

    // mapping of claim indices to all claims hashes
    // when a claim is created, claim hash is stored here,
    // and responses need to pass the actual claim,
    // which is hashed onchain and checked against this mapping
    mapping(uint32 => bytes32) public allClaimHashes;

    // mapping of claim indices to hash of abi.encode(claimResponse, claimResponseMetadata)
    mapping(address => mapping(uint32 => bytes)) public allClaimResponses;

    modifier onlyOperator() {
        require(
            ECDSAStakeRegistry(stakeRegistry).operatorRegistered(msg.sender),
            "Operator must be the caller"
        );
        _;
    }

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _rewardsCoordinator,
        address _delegationManager

    )
        ECDSAServiceManagerBase(
            _avsDirectory,
            _stakeRegistry,
            _rewardsCoordinator,
            _delegationManager
        )
    {}

    /* FUNCTIONS */
    // NOTE: this function creates new claim, assigns it a claimId
    function createNewClaim(
        address pool, 
        address insured
    ) external returns (Claim memory) {
        // TOOD :: create validation to allow only if the sender is the registered pool

        // create a new claim struct
        Claim memory newClaim;
        newClaim.pool = pool;
        newClaim.insured = insured;
        newClaim.claimCreatedBlock = uint32(block.number);

        // store hash of claim onchain, emit event, and increase claimNum
        allClaimHashes[latestClaimNum] = keccak256(abi.encode(newClaim));
        emit NewClaimCreated(latestClaimNum, newClaim);
        latestClaimNum = latestClaimNum + 1;

        return newClaim;
    }

    function respondToClaim(
        Claim calldata claim,
        uint32 referenceClaimIndex,
        bytes memory signature
    ) external {
        // check that the claim is valid, hasn't been responsed yet, and is being responded in time
        require(
            keccak256(abi.encode(claim)) == allClaimHashes[referenceClaimIndex],
            "supplied claim does not match the one recorded in the contract"
        );
        require(
            allClaimResponses[msg.sender][referenceClaimIndex].length == 0,
            "Operator has already responded to the claim"
        );

        // The message that was signed
        bytes32 messageHash = keccak256(abi.encodePacked("Insurance, ", uint256(referenceClaimIndex).toString()));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        bytes4 magicValue = IERC1271Upgradeable.isValidSignature.selector;
        if (!(magicValue == ECDSAStakeRegistry(stakeRegistry).isValidSignature(ethSignedMessageHash,signature))){
            revert();
        }

        // updating the storage with claim responses
        allClaimResponses[msg.sender][referenceClaimIndex] = signature;

        // respond the result to pool
        // TODO :: Activate this script to respond back to pool
        // IInsurancePool(claim.pool).respondToClaim(claim, referenceClaimIndex);

        // emitting event
        emit ClaimResponded(referenceClaimIndex, claim, msg.sender);
    }

    // Helper function to convert a single address to a string
    function addressToString(address _address) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                "0x",
                uint256(uint160(_address)).toHexString(20)
            )
        );
    }

    // Function to merge two addresses into a single string with a space
    function mergeAddresses(address _addr1, address _addr2) public pure returns (string memory) {
        string memory str1 = addressToString(_addr1);
        string memory str2 = addressToString(_addr2);
        return string(abi.encodePacked(str1, " ", str2));
    }
}
