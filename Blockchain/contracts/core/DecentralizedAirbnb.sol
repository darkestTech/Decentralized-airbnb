// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentralizedAirbnb is ERC721, Ownable {

    constructor() ERC721("BookingConfirmationNFT", "BOOKNFT") Ownable(msg.sender) {}

    uint256 public propertyCount;
    uint256 public bookingCount;
    uint256 public nextTokenId;

    struct Property {
        uint256 id;
        address host;
        uint256 pricePerNight;
        string metadataURI; // ✅ now stores IPFS metadata URL
        bool active;
    }

    struct Booking {
        uint256 id;
        uint256 propertyId;
        address guest;
        uint256 startDate;
        uint256 endDate;
        uint256 totalAmount;
        bool checkedIn;
        bool refunded;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Booking) public bookings;

    event PropertyListed(uint256 indexed propertyId, address indexed host, uint256 price, string metadataURI);
    event PropertyBooked(uint256 indexed bookingId, uint256 indexed propertyId, address indexed guest, uint256 totalAmount);
    event CheckedIn(uint256 indexed bookingId, address indexed guest);
    event Cancelled(uint256 indexed bookingId, address indexed guest, uint256 refundAmount);
    event FundsWithdrawn(uint256 indexed bookingId, address indexed host, uint256 amount);

    function listProperty(uint256 _pricePerNight, string calldata _metadataURI) external {
        require(_pricePerNight > 0, "Price must be > 0");

        propertyCount++;
        properties[propertyCount] = Property({
            id: propertyCount,
            host: msg.sender,
            pricePerNight: _pricePerNight,
            metadataURI: _metadataURI,
            active: true
        });

        emit PropertyListed(propertyCount, msg.sender, _pricePerNight, _metadataURI);
    }

    function updatePropertyStatus(uint256 _propertyId, bool _active) external {
        Property storage prop = properties[_propertyId];
        require(msg.sender == prop.host, "Not the host");
        prop.active = _active;
    }

    function bookProperty(
        uint256 _propertyId,
        uint256 _startDate,
        uint256 _endDate
    ) external payable {
        Property memory prop = properties[_propertyId];
        require(prop.active, "Property inactive");
        require(_endDate > _startDate, "Invalid dates");

        uint256 nights = (_endDate - _startDate) / 1 days;
        require(nights > 0, "Must book at least 1 night");

        uint256 totalAmount = nights * prop.pricePerNight;
        require(msg.value == totalAmount, "Incorrect payment");

        bookingCount++;
        bookings[bookingCount] = Booking({
            id: bookingCount,
            propertyId: _propertyId,
            guest: msg.sender,
            startDate: _startDate,
            endDate: _endDate,
            totalAmount: totalAmount,
            checkedIn: false,
            refunded: false
        });

        _safeMint(msg.sender, nextTokenId);
        nextTokenId++;

        emit PropertyBooked(bookingCount, _propertyId, msg.sender, totalAmount);
    }

    function checkIn(uint256 _bookingId) external {
        Booking storage booking = bookings[_bookingId];
        require(msg.sender == booking.guest, "Not your booking");
        require(block.timestamp >= booking.startDate, "Too early");
        require(!booking.checkedIn, "Already checked in");

        booking.checkedIn = true;
        emit CheckedIn(_bookingId, msg.sender);
    }

    function cancelBooking(uint256 _bookingId) external {
        Booking storage booking = bookings[_bookingId];
        require(msg.sender == booking.guest, "Not your booking");
        require(!booking.checkedIn, "Already checked in");
        require(block.timestamp < booking.startDate, "Too late to cancel");
        require(!booking.refunded, "Already refunded");

        uint256 refundAmount = (booking.totalAmount * 80) / 100;
        booking.refunded = true;
        payable(booking.guest).transfer(refundAmount);

        emit Cancelled(_bookingId, msg.sender, refundAmount);
    }

    function withdrawFunds(uint256 _bookingId) external {
        Booking storage booking = bookings[_bookingId];
        Property storage prop = properties[booking.propertyId];
        require(msg.sender == prop.host, "Not the host");
        require(block.timestamp >= booking.startDate, "Booking not started yet");
        require(!booking.refunded, "Booking refunded");

        uint256 amount = booking.totalAmount;
        booking.totalAmount = 0;
        payable(prop.host).transfer(amount);

        emit FundsWithdrawn(_bookingId, msg.sender, amount);
    }

    function getProperty(uint256 _propertyId) external view returns (Property memory) {
        return properties[_propertyId];
    }

    function getBooking(uint256 _bookingId) external view returns (Booking memory) {
        return bookings[_bookingId];
    }
}
