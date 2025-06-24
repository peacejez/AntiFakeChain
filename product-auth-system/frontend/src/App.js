import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        }
      ],
      "name": "ManufacturerLogin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        }
      ],
      "name": "ManufacturerRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productHash",
          "type": "uint256"
        }
      ],
      "name": "ProductAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_manufacturerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_productDetails",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "checkManufacturerLogin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productHash",
          "type": "uint256"
        }
      ],
      "name": "getProductByHash",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hashExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hashToProductId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manufacturer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "internalType": "string",
          "name": "manufacturerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productType",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productDetails",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isAuthentic",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "Producthash",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_manufacturer",
          "type": "address"
        }
      ],
      "name": "registerManufacturer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "registeredManufacturers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_productHash",
          "type": "uint256"
        }
      ],
      "name": "verifyProduct",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [productForm, setProductForm] = useState({
    manufacturerName: '',
    productName: '',
    productType: '',
    productDetails: ''
  });
  const [txStatus, setTxStatus] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
      
    } catch (error) {
      console.error("Wallet connection error:", error);
      setTxStatus(`Error: ${error.message}`);
    }
  };

  const addProduct = async () => {
    if (!contract) return;

    try {
      setTxStatus('Adding product to blockchain...');
      
      const tx = await contract.addProduct(
        productForm.manufacturerName,
        productForm.productName,
        productForm.productType,
        productForm.productDetails
      );

      await tx.wait();
      
      setTxStatus('Product successfully added to blockchain!');
      setProductForm({
        manufacturerName: '',
        productName: '',
        productType: '',
        productDetails: ''
      });

    } catch (error) {
      console.error("Error adding product:", error);
      setTxStatus(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <header>
        <h1>Product Management System</h1>
        
        {!account ? (
          <button onClick={connectWallet}>Connect MetaMask</button>
        ) : (
          <div className="wallet-info">
            <p>Connected as: {account}</p>
          </div>
        )}
      </header>

      <main>
        {txStatus && <div className="status">{txStatus}</div>}

        {account ? (
          <div className="product-form">
            <h2>Add New Product</h2>
            
            <div className="form-group">
              <label>Manufacturer Name:</label>
              <input
                type="text"
                name="manufacturerName"
                value={productForm.manufacturerName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Name:</label>
              <input
                type="text"
                name="productName"
                value={productForm.productName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Type:</label>
              <input
                type="text"
                name="productType"
                value={productForm.productType}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Product Details:</label>
              <textarea
                name="productDetails"
                value={productForm.productDetails}
                onChange={handleInputChange}
                required
              />
            </div>

            <button onClick={addProduct} className="submit-btn">
              Add Product to Blockchain
            </button>
          </div>
        ) : (
          <div className="notice">
            <p>Please connect your MetaMask wallet to add products.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;