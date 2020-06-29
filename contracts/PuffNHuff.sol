pragma experimental ABIEncoderV2;

contract PuffNHuff {
  uint counter = 0;

  struct Product {
    uint _id; 
    address producer;
    address consumer;
    string name;
    string strainType;
    string state;
    uint8 amount;
    uint8 price;
  }

  enum Role { Unauthorized, Producer, Consumer }

  mapping(address => bytes32) passwords;
  mapping(address => Role) users;
  mapping(address => Product[]) products;
  address[] public producers;


  function createUser(bytes32 password, uint userType) public {
    bytes32 empty;
    require(keccak256(abi.encodePacked(passwords[msg.sender])) == keccak256(abi.encodePacked(empty)), "You're already registered");
    passwords[msg.sender] = keccak256(abi.encodePacked(password));
    users[msg.sender] = userType == 1 ? Role.Producer : Role.Consumer;
  }

  function createProduct(string memory name, string memory strainType, uint8 amount, uint8 price) public returns (Product memory) {
    require(users[msg.sender] == Role.Producer, "Only Producers can create products");
    Product memory product = Product(counter, msg.sender, address(0x0), name, strainType, "Planted", amount, price);
    counter++;
    // Don't add existing addresses
    producers.push(msg.sender);
    products[msg.sender].push(product);
    return product;
  }

  function login(bytes32 password) public view returns (Role) {
    return (keccak256(abi.encodePacked(password)) == passwords[msg.sender]) ? users[msg.sender] : Role.Unauthorized;
  }

  function getProducts(address account) public view returns (Product[] memory) {
    require(users[msg.sender] == Role.Producer || users[msg.sender] == Role.Consumer, "Only registered users can request to see Products");
    return products[account];
  }

  function getProducers() public view returns (address[] memory) {
    require(users[msg.sender] == Role.Producer || users[msg.sender] == Role.Consumer, "Only registered users can request to see Products");
    return producers;
  }

  function buy(address producer, uint index) public {
    require(msg.sender != producer, "You can't buy your own product");
    products[producer][index].consumer = msg.sender;
    products[producer][index].state = "Sold";
  }

  function receive(address producer, uint index) public {
    require(msg.sender != producer, "You can only receive sent products");
    products[producer][index].state = "Received";
  }

  function changeState(uint index, string memory state) public {
    // require(users[msg.sender] == Role.Producer, "Only Producers can change state");
    require(products[msg.sender][index].producer == msg.sender || products[msg.sender][index].consumer == msg.sender, "Only the current owner can change state");
    products[msg.sender][index].state = state;
  }

  // function toAsciiString(address x) private returns (string memory) {
  //   bytes memory s = new bytes(40);
  //   for (uint i = 0; i < 20; i++) {
  //       byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
  //       byte hi = byte(uint8(b) / 16);
  //       byte lo = byte(uint8(b) - 16 * uint8(hi));
  //       s[2*i] = char(hi);
  //       s[2*i+1] = char(lo);            
  //   }
  //   return string(s);
  // }

  // function char(byte b) private returns (byte c) {
  //     if (uint8(b) < 10) return byte(uint8(b) + 0x30);
  //     else return byte(uint8(b) + 0x57);
  // }

  // function getAllProducts() public view returns (Product[][] memory) {
  //     // Maybe someday in the future I can make this work
  //     // with either multidimensional arrays or something else
  //   }
  // }

  function compareStringsbyBytes(string memory s1, string memory s2) public pure returns(bool){
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
  }
}