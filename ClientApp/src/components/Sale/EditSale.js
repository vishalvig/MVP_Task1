import React, { Component } from 'react';
import '../popup.css'
class EditSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPopupOpen: props.isPopupOpen,
            saleId: props.saleId,
            customerName: props.customerName,
            productName: props.productName,
            storeName: props.storeName,
            dateSold: props.dateSold,
            customers: [], 
            products: [],
            stores: [],
        };
    }
    async componentDidMount() {
        
        try {
            const customersResponse = await fetch('api/customers');
            const productsResponse = await fetch('api/products');
            const storesResponse = await fetch('api/stores');

            if (customersResponse.ok && productsResponse.ok && storesResponse.ok) {
                const customersData = await customersResponse.json();
                const productsData = await productsResponse.json();
                const storesData = await storesResponse.json();

                this.setState({
                    customers: customersData,
                    products: productsData,
                    stores: storesData,
                });
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    openEditPopup = (saleId, customerName, productName, storeName, dateSold, editingSale) => {
        this.setState({
            isPopupOpen: true,
            saleId,
            customerName,
            productName,
            storeName,
            dateSold,
            editingSale,
        });
    };

    closeEditPopup = () => {
        this.setState({
            isPopupOpen: false,
            saleId: null,
            customerName: null,
            productName: null,
            storeName: null,
            dateSold: null,
            editingSale:null,
        });
    };

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    
    handleUpdateSale = async (xxx) => {
                console.log('handlesave being called')
                

                const updatedSale = {
                    id: xxx.saleId,
                    customerName: xxx.customerName,
                    productName: xxx.productName,
                    storeName: xxx.storeName,
                    dateSold: xxx.dateSold,
                };

                console.log('xxx: ', xxx);
                

        try {
            const response = await fetch(`api/sales/${xxx.saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSale),
            });

            if (response.ok) {
                console.log('Sale updated.');
                this.props.populateSaleData();
                this.props.onCancel();
                this.setState({ editingSale: null, isPopupOpen:false });
                
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update sale.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    render() {
        const { isPopupOpen, customerName, productName, storeName, dateSold, customers, products, stores } = this.state;

        return (
            <div>
               
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Edit Sale</h2>
                            <div>
                                <label>Date Sold:</label>
                                <input
                                    type="text"
                                    id="dateSold"
                                    placeholder="YYYY-MM-DD"
                                    value={dateSold}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div>
                                <label>Customer:</label>

                                <select id="customerName" value={customerName} onChange={this.handleInputChange}>
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.name}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Product:</label>
                                <select id="productName" value={productName} onChange={this.handleInputChange}>
                                    <option value="">Select Product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.name}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                               
                            </div>
                            <div>
                                <label>Store:</label>
                               
                                <select id="storeName" value={storeName} onChange={this.handleInputChange}>
                                    <option value="">Select Store</option>
                                    {stores.map((store) => (
                                        <option key={store.id} value={store.name}>
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button className="ui blue button" onClick={() => this.handleUpdateSale(this.state)}>
                                Update Sale
                            </button>
                            <button className="ui red button" onClick={this.closeEditPopup}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default EditSale;

