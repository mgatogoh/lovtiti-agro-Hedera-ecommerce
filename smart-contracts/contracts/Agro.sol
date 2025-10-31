// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract agro {
    // storage
    struct product {
        uint price;
        address owner;
        uint stock;
        uint id;
    }
    struct farmerstruct {
        uint[] products;
        uint balance;
        bool exists;
    }
    mapping(uint => product) public products; 
    mapping(address => farmerstruct) public farmer;
    uint nextid = 1;

    //events
    event productCreated(uint indexed productId, uint price, address farmer, uint amount);
    event farmerJoined(address farmer);
    event stockUpdated(uint amount, uint pid);
    event priceIncreased(uint price, uint pid);
    event productBought(uint indexed productId, address buyer, address farmer, uint amount);

    bool private locked;
    modifier nonReentrant() {
        require(!locked, "REENTRANCY");
        locked = true;
        _;
        locked = false;
    }

    //functions
    function addProduct( uint price, uint amount) public {
        require(price > 0, "price must be > 0"); 
        require(amount > 0, "stock must be > 0");
        require(farmer[msg.sender].exists != false, "you are not a farmer");
        product memory newProduct = product(price, msg.sender, amount, nextid);
        require(products[nextid].owner == address(0), "product already exists");
        products[nextid] = (newProduct);
        farmer[msg.sender].products.push(nextid); // 0 placeholder for random generated number
        emit productCreated(nextid, price, msg.sender, amount);
        nextid++;
    }
    function increasePrice( uint price, uint pid) public {
        require(price > 0, "price must be > 0"); 
        require(products[pid].owner == msg.sender, "you are not the owner of this product");
        products[pid].price = price;
        emit priceIncreased(price, pid);
    }
    function updateStock( uint stock, uint pid) public {
        require(stock > 0, "stock must be > 0");
        require(products[pid].owner == msg.sender, "you are not the owner of this product");
        products[pid].stock = stock;
        emit stockUpdated(stock, pid);
    }
    function createFarmer() public nonReentrant() {
        require(farmer[msg.sender].exists == false, "farmer already exists");
        farmer[msg.sender] = farmerstruct(new uint[](0), 0, true);
        emit farmerJoined(msg.sender);
    }
    function buyproduct(uint pid, uint amount) public payable {
        // Implement the logic for buying a product here
        require(amount > 0, "stock must be > 0");
        require(products[pid].owner != address(0), "product does not exist");
        require(products[pid].owner != msg.sender, "you cannot buy your own product");
        require(products[pid].stock >= amount, "not enough stock");
        require((products[pid].price)*amount <= msg.value, "insufficient funds");
        products[pid].stock -= amount;
        farmer[products[pid].owner].balance += (products[pid].price)*amount;
        emit productBought(pid, msg.sender, products[pid].owner, amount);
    }
    function withdrawBalance() public nonReentrant() {
        require(farmer[msg.sender].balance > 0, "no balance to withdraw");
        uint amount = farmer[msg.sender].balance;
        farmer[msg.sender].balance = 0;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "withdrawal failed");
    }

    //view functions
    function whoFarmer(address user) public view returns (farmerstruct memory) {
        if(farmer[user].exists == false) {
            revert("farmer does not exist");
        }
        return farmer[user];
    }
    function viewProducts(address _farmer) public view returns (product[] memory) {
        uint[] memory ids = farmer[_farmer].products;
        product[] memory items = new product[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            items[i] = products[ids[i]];
        }
        return items;
    }
}
