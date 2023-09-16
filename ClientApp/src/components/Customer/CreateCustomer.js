import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../popup.css'


class CreateCustomer extends Component {
    state = {
        isPopupOpen: false,
        customerName: '',
        customerAddress: '',
        customers: [],
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

    handleCreateCustomer = async () => {
        const { customerName, customerAddress } = this.state;
        if (!customerName || !customerAddress) {
            console.error('Product Name and Product Price are required.');
            return; // Exit the function without making the API request
        }
        const customerData = {

            Name: customerName,
            Address: customerAddress,

        };

        // Make an API request to create the sale
        try {

            const response = await fetch('api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {

                console.log('New customer created');
                this.closeCreatePopup();
                const newCustomer = await response.json();
                const updatedCustomer = [...this.state.customers, newCustomer];
                this.setState({
                    customers: updatedCustomer, 

                    customerName: '',
                    customerAddress: '',
                }, () => {
                   
                    this.props.onProductCreated(); 
                }
                );

                
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to create Customer.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

    render() {
        const { isPopupOpen, customerName, customerAddress } = this.state;


        return (
            <div>
                <button className="ui blue button" onClick={this.openCreatePopup}>Create New Customer</button>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">

                            <h2>Create New Customer</h2>
                            <table className="ui striped table" aria-labelledby="tabellabel">
                                <tbody>
                                    <tr><td>
                            
                                <label>Customer Name:</label></td>
                               <td> <input
                                    type="text"
                                    id="customerName"
                                    placeholder="Customer Name"
                                    value={customerName}
                                    onChange={this.handleInputChange}
                                />

                                        
                                    </td>
                                    </tr>
                                    <tr>
                            <td>
                                            <label>Customer Address:</label></td><td>
                                <input
                                    type="text"
                                    id="customerAddress"
                                    placeholder="Customer Address"
                                    value={customerAddress}
                                    onChange={this.handleInputChange}
                                />
                                        </td>
                                        </tr><tr><td>
                                        <button className="ui blue button" onClick={this.handleCreateCustomer}>Create</button></td>
                                        <td>  <button className="ui red button" onClick={this.closeCreatePopup}>Cancel</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
export default CreateCustomer;