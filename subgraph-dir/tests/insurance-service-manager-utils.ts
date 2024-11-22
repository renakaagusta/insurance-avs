import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  ClaimResponded,
  Initialized,
  NewClaimCreated,
  OwnershipTransferred,
  RewardsInitiatorUpdated
} from "../generated/InsuranceServiceManager/InsuranceServiceManager"

export function createClaimRespondedEvent(
  claimIndex: BigInt,
  claim: ethereum.Tuple,
  operator: Address
): ClaimResponded {
  let claimRespondedEvent = changetype<ClaimResponded>(newMockEvent())

  claimRespondedEvent.parameters = new Array()

  claimRespondedEvent.parameters.push(
    new ethereum.EventParam(
      "claimIndex",
      ethereum.Value.fromUnsignedBigInt(claimIndex)
    )
  )
  claimRespondedEvent.parameters.push(
    new ethereum.EventParam("claim", ethereum.Value.fromTuple(claim))
  )
  claimRespondedEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return claimRespondedEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createNewClaimCreatedEvent(
  claimIndex: BigInt,
  claim: ethereum.Tuple
): NewClaimCreated {
  let newClaimCreatedEvent = changetype<NewClaimCreated>(newMockEvent())

  newClaimCreatedEvent.parameters = new Array()

  newClaimCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "claimIndex",
      ethereum.Value.fromUnsignedBigInt(claimIndex)
    )
  )
  newClaimCreatedEvent.parameters.push(
    new ethereum.EventParam("claim", ethereum.Value.fromTuple(claim))
  )

  return newClaimCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRewardsInitiatorUpdatedEvent(
  prevRewardsInitiator: Address,
  newRewardsInitiator: Address
): RewardsInitiatorUpdated {
  let rewardsInitiatorUpdatedEvent = changetype<RewardsInitiatorUpdated>(
    newMockEvent()
  )

  rewardsInitiatorUpdatedEvent.parameters = new Array()

  rewardsInitiatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "prevRewardsInitiator",
      ethereum.Value.fromAddress(prevRewardsInitiator)
    )
  )
  rewardsInitiatorUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newRewardsInitiator",
      ethereum.Value.fromAddress(newRewardsInitiator)
    )
  )

  return rewardsInitiatorUpdatedEvent
}
