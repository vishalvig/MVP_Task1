import React, { Component } from 'react';
import '../popup.css'


class CreateProduct extends Component {
    state = {
        isPopupOpen: false,
        productName: '',
        productPrice: '',
        products: [],
    };

    openCreatePopup = () => {
        this.setState({ isPopupOpen: true });
    };

    closeCreatePopup = () => {
        this.setState({ isPopupOpen: false });
    };

    handleInputChange = (event) => {
        // Handle input field changes and update state accordingly
        const { id, value } = event.target;
        console.log(`Updating state for ${id}: ${value}`);
        this.setState({ [id]: value });
    };

    handleCreateProduct = async () => {
        const { productName, productPrice } = this.state;
        if (!productName || !productPrice) {
            console.error('Product Name and Product Price are required.');
            return; // Exit the function without making the API request
        }
        const saleData = {
            
           Name: productName,
          Price: productPrice,
            
        };

        // Make an API request to create the sale
        try {
          
            const response = await fetch('api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            if (response.ok) {
               
                console.log('New product created');
                this.closeCreatePopup();
                const newSale = await response.json();
                const updatedSales = [...this.state.products, newSale];
                this.setState({
                    products: updatedSales, // Assuming you have a "sales" state variable
                    
                    productName: '',
                    productPrice: '',
                }, () => {
                    // Callback function is called after state is updated
                    this.props.onProductCreated(); // Ensure this is correctly defined in the parent
                }
                );

                // You can add a callback to update data in the parent component
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create sale.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    render() {
        const { isPopupOpen, productName, productPrice } = this.state;
     

        return (
            <div>
                <button className="ui blue button" onClick={this.openCreatePopup}>Create New Product</button>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">

                            <h2>Create New Product</h2>
                            <div>
                                <label>Product Name:</label>
                                <input
                                    type="text"
                                    id="productName"
                                    placeholder="Product Name"
                                    value={productName}
                                    onChange={this.handleInputChange}
                                />
                                
                            </div>
                            <div>
                                <label>Product Price:</label>
                                <input
                                    type="text"
                                    id="productPrice"
                                    placeholder="Product Price"
                                    value={productPrice}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                                                     
                            <button className="ui blue button" onClick={this.handleCreateProduct}>Create</button>
                            <button className="ui red button" onClick={this.closeCreatePopup}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default CreateProduct;
//export class CreateProduct extends Component {
//    componentDidMount() {
//        window.addEventListener('message', this.handlePopupMessage);
//    }

//    componentWillUnmount() {
//        window.removeEventListener('message', this.handlePopupMessage);
//    }

//    openCreatePopup = () => {
//        const createPopupWindow = window.open('', '_blank', 'width=400,height=300');

//        createPopupWindow.document.write(`
//      <html>
//        <head>
//          <title>Create New Product</title>
//          <style>
//            ${`
//              /* Additional custom styles for the create popup window */
//              body {
//                font-family: 'Segoe UI', sans-serif;
//                background-color: #f9f9f9;
//                padding: 20px;
//              }
              
//              h2 {
//                font-size: 24px;
//                margin-bottom: 20px;
//              }
              
//              .form-container {
//                background-color: #fff;
//                border: 1px solid #ddd;
//                padding: 20px;
//              }
              
//              .form-container input {
//                width: 100%;
//                padding: 10px;
//                margin-bottom: 10px;
//              }
              
//              .form-container button {
//                margin-right: 10px;
//              }
//            `}
//          </style>
//        </head>
//        <body>
//          <div class="form-container">
//            <h2>Create New Product</h2>
//            <input type="text" id="productName" placeholder="Product Name" />
//            <input type="text" id="productPrice" placeholder="Product Price" />
//            <button id="createButton">Create</button>
//            <button onclick="window.close()">Cancel</button>
//            <script>
//              // Function to handle creating a new product in the main window and close the create popup window
//              function handleCreateProduct() {
//                const productName = document.getElementById('productName').value;
//                const productPrice = document.getElementById('productPrice').value;
//                window.opener.postMessage(
//                  { type: 'createProduct', name: productName, price: productPrice },
//                  window.origin
//                );
//                window.close();
//              }

//              document.getElementById('createButton').addEventListener('click', handleCreateProduct);
//            </script>
//          </div>
//        </body>
//      </html>
//    `);
//    };

//    render() {
//        return null;
//    }
//}

//export default CreateProduct;