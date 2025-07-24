const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedAirbnb", function () {
  let Airbnb, airbnb;
  let owner, host, guest;

  beforeEach(async function () {
    // Get signers (Hardhat gives 10 test accounts)
    [owner, host, guest] = await ethers.getSigners();

    // Deploy contract
    Airbnb = await ethers.getContractFactory("DecentralizedAirbnb");
    airbnb = await Airbnb.deploy();
    await airbnb.waitForDeployment();
  });

  it("should allow a host to list a property", async function () {
    const pricePerNight = ethers.parseEther("1"); // 1 ETH per night
    const ipfsHash = "QmDummyHash";

    await airbnb.connect(host).listProperty(pricePerNight, ipfsHash);

    const property = await airbnb.getProperty(1);
    expect(property.host).to.equal(host.address);
    expect(property.pricePerNight).to.equal(pricePerNight);
    expect(property.active).to.equal(true);
  });

  it("should allow a guest to book a property with correct payment", async function () {
    // First host lists property
    const pricePerNight = ethers.parseEther("1"); 
    await airbnb.connect(host).listProperty(pricePerNight, "QmDummyHash");

    const now = Math.floor(Date.now() / 1000);
    const startDate = now + 86400; // 1 day later
    const endDate = startDate + 86400 * 2; // 2 nights

    const nights = 2;
    const totalAmount = pricePerNight * BigInt(nights);

    await airbnb.connect(guest).bookProperty(1, startDate, endDate, {
      value: totalAmount,
    });

    const booking = await airbnb.getBooking(1);
    expect(booking.guest).to.equal(guest.address);
    expect(booking.totalAmount).to.equal(totalAmount);
    expect(booking.checkedIn).to.equal(false);
  });

  it("should allow guest to cancel before start date and get 80% refund", async function () {
    const pricePerNight = ethers.parseEther("1");
    await airbnb.connect(host).listProperty(pricePerNight, "QmDummyHash");

    const now = Math.floor(Date.now() / 1000);
    const startDate = now + 86400; // 1 day later
    const endDate = startDate + 86400; // 1 night

    const totalAmount = pricePerNight; // 1 night = 1 ETH

    await airbnb.connect(guest).bookProperty(1, startDate, endDate, {
      value: totalAmount,
    });

    // Check guest balance before refund
    const beforeBalance = await ethers.provider.getBalance(guest.address);

    // Cancel booking before start date
    const tx = await airbnb.connect(guest).cancelBooking(1);
    const receipt = await tx.wait();

    // Refund should be 80% of 1 ETH = 0.8 ETH
    const refundAmount = (totalAmount * BigInt(80)) / BigInt(100);

    const afterBalance = await ethers.provider.getBalance(guest.address);

    // Guest should receive ~0.8 ETH (minus gas)
    expect(afterBalance).to.be.gt(beforeBalance + refundAmount - ethers.parseEther("0.01")); 
  });

  it("should allow host to withdraw funds after booking start", async function () {
    const pricePerNight = ethers.parseEther("1");
    await airbnb.connect(host).listProperty(pricePerNight, "QmDummyHash");

    const now = Math.floor(Date.now() / 1000);
    const startDate = now + 5; // start in 5 seconds
    const endDate = startDate + 86400; // 1 night

    const totalAmount = pricePerNight;

    await airbnb.connect(guest).bookProperty(1, startDate, endDate, {
      value: totalAmount,
    });

    // Wait for start date (simulate time passing)
    await ethers.provider.send("evm_increaseTime", [10]);
    await ethers.provider.send("evm_mine");

    // Host withdraws funds
    const beforeHostBalance = await ethers.provider.getBalance(host.address);
    await airbnb.connect(host).withdrawFunds(1);
    const afterHostBalance = await ethers.provider.getBalance(host.address);

    expect(afterHostBalance).to.be.gt(beforeHostBalance);
  });
});
