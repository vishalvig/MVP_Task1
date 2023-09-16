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
            return; 
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
                    products: updatedSales, 
                    
                    productName: '',
                    productPrice: '',
                }, () => {
                    
                    this.props.onProductCreated(); 
                }
                );

                
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
