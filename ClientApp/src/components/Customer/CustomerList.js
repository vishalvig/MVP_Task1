import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';
import DeleteSalePopup from '../DeleteSalePopup';
//import { generateDeleteWindowContent } from './DeleteCustomer';

export class CustomerList extends Component {
    
        constructor(props) {
        super(props);
        this.state = {
            customers: [], loading: true,
            editingCustomerId: null,
            //editedName: '',
            //editedAddress: '',
            error: null,
            showCreatePopup: false,
            showEditWindow: false,
            showDeletePopup: false, // State to control the delete confirmation popup
            customerToDeleteId: null,
            isEditPopupVisible: false,
        };
        this.handleSave = this.handleSave.bind(this);
    }

    openEditPopup = (customerId, initialName, initialAddress) => {
        this.setState({
            editingCustomerId: customerId,
            editedName: initialName,
            editedAddress: initialAddress,
            isEditPopupVisible: true,
        });
    };

    closeEditPopup = () => {
        this.setState({
            editingCustomerId: null,
            editedName: '',
            editedAddress: '',
            isEditPopupVisible: false,
        });
    };
    componentDidMount() {
        console.log("component did mount - parent")
        this.fetchSales();
        this.populateCustomerData();
        window.addEventListener('message', this.handlePopupMessage);
    } 
    openCreatePopup = () => {
        const createCustomer = new CreateCustomer();
        createCustomer.openCreatePopup();
    };

    openEditWindow = (customer) => {
        console.log(customer)
        const { id: customerId, name: customerName, address: customerAddress } = customer;
        const editCustomer = new EditCustomer();
        editCustomer.openEditWindow2(customerId, customerName, customerAddress);

        console.log(customerId, customerName, customerAddress)

    };


    renderCustomerTable(Customers, handleEdit, handleDelete, handleSave) {
        return (
            <table className="ui celled table" aria-labelledby="tabellabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Addess</th>
                        <th>Edit Customer</th>
                        <th>Delete Customer</th>
                        
                                           </tr>
                </thead>
                <tbody>
                    {Customers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td>
                                <button className="ui yellow button" onClick={() => this.openEditPopup(customer.id, customer.name, customer.address)}

                                ><i className="pencil icon"></i>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className="ui red button" onClick={() => this.openDeletePopup(customer.id)}><i className="trash icon"></i>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        const { loading, customers, editingCustomerId, error, showEditWindow, editedName, editedAddress, isEditPopupVisible } = this.state;
        let contents = loading 
            ? ( <p><em>Loading...</em></p> )
            : (this.renderCustomerTable(customers, this.openEditWindow, this.handleDelete, this.handleSave));

        return (
            <div>
                <h1 id="tabelLabel" >Customer List</h1>
                <CreateCustomer customer={{ customers }} handleCreateCustomer={this.handleCreateCustomer} onProductCreated={this.handleCustomerCreated} />
               
                {/*<button className="ui button" onClick={this.openCreatePopup}>*/}
                {/*    Create New Customer*/}
                {/*</button>*/}
                {contents}
                {error && (
                    <div className="error-popup">
                        <h2>Error</h2>
                        <p>{error}</p>
                        <button onClick={this.hideError}>OK</button>
                    </div>
                )}
                <DeleteSalePopup
                    isVisible={this.state.showDeletePopup}
                    customerId={this.state.customerToDeleteId}
                    onCancel={this.closeDeletePopup}
                    onConfirmDelete={this.handleConfirmDelete}
                />
                {isEditPopupVisible && (
                    <EditCustomer
                        customerId={editingCustomerId}
                        initialName={editedName}
                        initialAddress={editedAddress}
                        onSave={this.handleSave}
                        onCancel={this.closeEditPopup}
                    />
                )}
            </div>
        );
    }
    handleCustomerCreated = () => {
        // Add logic here to refresh the sales data, e.g., by calling populateSaleData
        this.populateCustomerData();
    };
    handlePopupMessage = (event) => {

        const { type, customerId: eventId, name, address } = event.data;
        if (type === 'createCustomer') {
            this.handleCreateCustomer(name, address);
            console.log("handlecreatecust", eventId)
        } else if (type === 'updateCustomer') {

            const updatedCustomerData = {
                customerId: eventId,
                name,
                address
            };
            console.log("type:", type, "id:", eventId)
            this.handleEdit(updatedCustomerData)
            console.log('updated customer data: ', updatedCustomerData);
        }
    };

    handleEdit = ({ customerId, name: customerName, address: customerAddress }) => {
        console.log("HandleEDIT", customerId, customerName, customerAddress)
        // Store the customer ID, name, and address in the component state
        this.setState({
            editingCustomerId: customerId,
            editedName: customerName,
            editedAddress: customerAddress,

        }, () => {
            // Call handleSave once the state is updated
            this.handleSave();
        });
    };

    handleSave = async (editingCustomerId, editedName, editedAddress) => {
        //const { editingCustomerId, editedName, editedAddress } = this.state;
        console.log(editingCustomerId, editedName, editedAddress)

        // Make an API request to update the customer with the edited values
        try {
            const response = await fetch(`api/customers/${editingCustomerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingCustomerId,
                    name: editedName,
                    address: editedAddress
                }),
            });

            if (response.ok) {
                console.log(`Customer with ID ${editingCustomerId} updated.`);
                this.populateCustomerData();
                this.closeEditPopup();

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update customer.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };

  

    //handleCreateCustomer = async (name, address) => {
    //    // Make an API request to create the customer
    //    try {
    //        const response = await fetch('api/customers', {
    //            method: 'POST',
    //            headers: {
    //                'Content-Type': 'application/json',
    //            },
    //            body: JSON.stringify({
    //                name,
    //                address,
    //            }),
    //        });

    //        if (response.ok) {
    //            console.log('New customer created.');
    //            this.setState({ showCreatePopup: false });
    //            this.populateCustomerData();
    //        } else {
    //            const errorData = await response.json();
    //            const errorMessage = errorData.message || 'Failed to create customer.';
    //            throw new Error(errorMessage);
    //        }
    //    } catch (error) {
    //        console.error('Error:', error.message);
    //        this.setState({ error: error.message });
    //    }
    //};


    async fetchSales() {
        console.log('Called fetchSales method');
        const response = await fetch('api/sales');
        console.log(response);
        const data = await response.json();
        console.log("fetchSales: ", data);
        this.setState({ sales: data, loading: false });
    }
    openDeletePopup = (customerId) => {
        console.log("Opening delete popup");
        console.log(customerId);
        this.setState({ showDeletePopup: true, customerToDeleteId: customerId }, () => {
            console.log(this.state.customerToDeleteId)
        });

    };

        //handleDelete = async (customerId) => {
        //    // Open a new window
        //    const deleteWindow = window.open('', '_blank', 'width=400,height=300');

        //    // Generate the content for the new window using the separate function
        //    const deleteWindowContent = generateDeleteWindowContent(customerId);

        //    // Write the content of the new window
        //    deleteWindow.document.write(deleteWindowContent);

        //    // Global function to handle confirmation of deletion in the main window
        //    window.confirmDeleteCustomer = (customerId) => {
        //        this.handleConfirmDelete(customerId);
        //        window.close();
        //    };
        //};
    
    closeDeletePopup = () => {
        this.setState({ showDeletePopup: false, customerToDeleteId: null });
    };
        handleConfirmDelete = async () => {
            const { customerToDeleteId } = this.state;
            console.log('customerId:', customerToDeleteId);
            console.log('this.state.sales:', this.state.sales);
            const dataExist = this.state.sales.find(
                (sales) =>
                    sales.customerId === customerToDeleteId
            );
            if (dataExist) {
                console.log(
                    "Failed to delete this customer. The customer may have existing sale records.",
                );

                // Open a new window with the popup content
                const popupWindow = window.open('', '_blank', 'width=400,height=200');

                popupWindow.document.write(`
   <html>
      <head>
        <title>Delete Failed</title>
      </head>
      <body>
        <h2>Delete Failed</h2>
        <p>Failed to delete this customer. The customer may have existing sale records.</p>
        <script>
          setTimeout(() => window.close(), 2000);
        </script>
      </body>
    </html>
`);

                popupWindow.document.close();
                return {};
            }
            // Make an API request to delete the customer
            try {
                const response = await fetch(`api/customers/${customerToDeleteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log(`Customer with ID ${customerToDeleteId} deleted.`);
                    this.populateCustomerData();
                    this.closeDeletePopup();
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Failed to delete customer.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error:', error.message);
                this.setState({ error: error.message });
            }
        };


    async populateCustomerData() {
        console.log('Called Api');
        const response = await fetch('api/customers');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ customers: data, loading: false });

    }
}
export default CustomerList;