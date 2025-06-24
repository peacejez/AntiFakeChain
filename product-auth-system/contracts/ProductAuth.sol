// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NAME: AHMAD MUIZZUDDIN BIN AHMAD RIDZUAN 2211679 
// NAME: MOHAMAD HAFIZ BIN MOHD JAIS 2218827

contract  ProductAuth{
    
    // define the Product struct
    struct Product{
    string manufacturerName; 
    string productName;
    string productType;
    string productDetails;
    bool   isAuthentic;
    uint256 Producthash;
    }

    Product[] public products;
    address public manufacturer;
    mapping(uint256 => bool) public hashExists; // To ensure hash uniqueness
    mapping(uint256 => uint256) public hashToProductId;
    mapping(address => bool) public registeredManufacturers;


    event ManufacturerRegistered(address manufacturer);
    event ManufacturerLogin(address manufacturer);
    event ProductAdded(uint256 index, uint256 productHash);

    
    modifier onlyManufacturer(){
        require(registeredManufacturers[msg.sender], "Not a registered manufacturer!");
        _;
    }

    constructor() {
    manufacturer = msg.sender;
    }

    // Manufacturer registration (only owner can register new manufacturers)
    function registerManufacturer(address _manufacturer) external {
        require(msg.sender == manufacturer, "Only contract owner can register manufacturers");
        registeredManufacturers[_manufacturer] = true;
        emit ManufacturerRegistered(_manufacturer);
    }

    // Manufacturer login check
    function checkManufacturerLogin() external view returns (bool) {
        return registeredManufacturers[msg.sender];
    }


    function addProduct(
        string memory _manufacturerName, 
        string memory _productName, 
        string memory _productType, 
        string memory _productDetails
        )  external returns (uint256) {
               emit ManufacturerLogin(msg.sender); // Log login event
        // Create a new Product struct and push it onto the products array.
        // Generate a more unique hash with additional parameters
        uint256 newHash = uint256(
            keccak256(
                abi.encodePacked(
                    _manufacturerName,
                    _productName,
                    _productType,
                    _productDetails,
                    block.timestamp,
                    products.length
                )
            )
        );

        // Ensure hash is unique
        require(!hashExists[newHash], "Duplicate product hash generated");
        hashExists[newHash] = true;

    products.push(Product({
        manufacturerName: _manufacturerName,
        productName: _productName,
        productType: _productType,
        productDetails: _productDetails,
        isAuthentic: true,
        Producthash: newHash // Remove the capital H here, or rename it to match existing field name.
    }));

        emit ProductAdded(products.length - 1, newHash);
        return newHash; // This hash can be used for QR code
    }

    function getProductByHash(uint256 _productHash) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        bool,
        uint256
    ) {
        require(hashExists[_productHash], "Product hash does not exist");
        uint256 productId = hashToProductId[_productHash];
        Product memory product = products[productId];
        
        return (
            product.manufacturerName,
            product.productName,
            product.productType,
            product.productDetails,
            product.isAuthentic,
            product.Producthash
        );
    }

    // Helper function to verify product authenticity
    function verifyProduct(uint256 _productHash) public view returns (bool) {
        require(hashExists[_productHash], "Product hash does not exist");
        uint256 productId = hashToProductId[_productHash];
        return products[productId].isAuthentic;
    }


}



