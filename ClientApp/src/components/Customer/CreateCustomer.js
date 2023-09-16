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
                    customers: updatedCustomer, // Assuming you have a "sales" state variable

                    customerName: '',
                    customerAddress: '',
                }, () => {
                    // Callback function is called after state is updated
                    this.props.onProductCreated(); // Ensure this is correctly defined in the parent
                }
                );

                // You can add a callback to update data in the parent component
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
//export class CreateCustomer extends Component {
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
//          <title>Create New Customer</title>
//              <style>
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
              
//              .form-container select,
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
//            <h2>Create New Customer</h2>
//            <input type="text" id="customerName" placeholder="Customer Name" />
//            <input type="text" id="customerAddress" placeholder="Customer Address" />
//            <button id="createButton">Create</button>
//            <button onclick="window.close()">Cancel</button>
//            <script>
//              // Function to handle creating a new customer in the main window and close the create popup window
//              function handleCreateCustomer() {
//                const customerName = document.getElementById('customerName').value;
//                const customerAddress = document.getElementById('customerAddress').value;
//                window.opener.postMessage(
//                  { type: 'createCustomer', name: customerName, address: customerAddress },
//                  window.origin
//                );
//                window.close();
//              }

//              document.getElementById('createButton').addEventListener('click', handleCreateCustomer);
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
//export default CreateCustomer;
