import React, { Component } from 'react';
import '../popup.css'


class CreateSale extends Component {
    state = {
        isPopupOpen: false,
        customerName: '', 
        productName: '',
        storeName: '',
        dateSold: '',
        sales: [],
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
        this.setState({ [id]: value });
    };

    handleCreateSale = async () => {
        const { customerName, productName, storeName, dateSold } = this.state;
        const saleData = {
            customerName,
            productName,
            storeName,
            dateSold,
        };

        // Make an API request to create the sale
        try {
            const response = await fetch('api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });

            if (response.ok) {
                console.log('New sale created.');
                this.closeCreatePopup();
                const newSale = await response.json();
                const updatedSales = [...this.state.sales, newSale];
                this.setState({
                    sales: updatedSales, 
                    customerName: '',
                    productName: '',
                    storeName: '',
                    dateSold: '',
                }, () => {
                    
                    this.props.onSaleCreated(); 
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
        const { isPopupOpen, customerName, productName, storeName, dateSold } = this.state;
        const { sale } = this.props;

        return (
            <div>
                <button className="ui blue button" onClick={this.openCreatePopup}>Create New Sale</button>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">

                            <h2>Create New Sale</h2>
                            <div>
                                <label>Customer:</label>
                                <select id="customerName" value={customerName} onChange={this.handleInputChange}>
                                    <option value="">Select Customer</option>
                                    {sale.customers.map((customer) => (
                                        <option value={customer.name} key={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Product:</label>
                                <select id="productName" value={productName} onChange={this.handleInputChange}>
                                    <option value="">Select Product</option>
                                    {sale.products.map((product) => (
                                        <option value={product.name} key={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Store:</label>
                                <select class="ui select" id="storeName" value={storeName} onChange={this.handleInputChange}>
                                    <option value="">Select Store</option>
                                    {sale.stores.map((store) => (
                                        <option value={store.name} key={store.id}>
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Date Sold:</label>
                                <input type="text"
                                    id="dateSold"
                                    placeholder="YYYY-MM-DD"
                                    value={dateSold}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                           
                            <button className="ui blue button" onClick={this.handleCreateSale}>Create</button>
                            <button className="ui red button" onClick={this.closeCreatePopup}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default CreateSale;

