// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IInsurancePool {
    // Events
    event PolicyPurchased(address indexed insured, uint256 amount);
    event ClaimSubmitted(uint32 indexed claimIndex, Claim claim);
    event ClaimApproved(uint32 indexed claimIndex, Claim claim);
    event ClaimRejected(uint32 indexed claimIndex, Claim claim);
    event Deposit(address indexed depositor, uint256 amount);
    event Withdraw(uint256 amount);
    event TransferInsurer(address indexed from, address indexed to);
    event Stake(uint256 amount);
    event YieldUpdated(uint256 totalAsset, uint256 yield);

    // Structs
    struct Claim {
        address insured;
        uint256 amount;
        bool isApproved;
    }

    // View Functions
    function insurer() external view returns (address);
    function uri() external view returns (string memory);
    function coverageAmount() external view returns (uint256);
    function startedAt() external view returns (uint256);
    function finishedAt() external view returns (uint256);
    function endOfPurchaseAt() external view returns (uint256);
    function maxPolicies() external view returns (uint256);
    function totalMintPolicies() external view returns (uint256);
    function triggeredValue() external view returns (uint256);
    function latestClaimNum() external view returns (uint32);
    function previewDepositInUSDe(uint256 assetsInUSDe) external view returns (uint256);
    function previewMintInUSDe(uint256 shares) external view returns (uint256);

    // External Functions
    function getSubmittedClaims() external returns (uint256);
    function purchasePolicy(uint256 shares, uint256 assetsInUSDe, address insured) external;
    function submitClaim() external;
    function respondToClaim(
        Claim calldata claim,
        uint32 referenceClaimIndex
    ) external;
    function withdraw() external;
    function transferInsurer(address _insurer) external;
    function initialDeposit() external;
    function updateYield() external;
}