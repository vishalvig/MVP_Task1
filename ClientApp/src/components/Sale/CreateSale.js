import React, { Component } from 'react';
import '../popup.css'


class CreateSale extends Component {
    state = {
        isPopupOpen: false,
        customerName: '', // Initialize form fields
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
                    sales: updatedSales, // Assuming you have a "sales" state variable
                    customerName: '',
                    productName: '',
                    storeName: '',
                    dateSold: '',
                }, () => {
                    // Callback function is called after state is updated
                    this.props.onSaleCreated(); // Ensure this is correctly defined in the parent
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
                            {/*Add similar markup for other form fields*/}
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

//import React, { Component } from 'react';

//class CreateSale extends Component {
//    componentDidMount() {
//        window.addEventListener('message', this.handlePopupMessage);
//    }

//    componentWillUnmount() {
//        window.removeEventListener('message', this.handlePopupMessage);
//    }

//    openCreatePopup = () => {
//        const createPopupWindow = window.open('', '_blank', 'width=400,height=500');

//        createPopupWindow.document.write(`
//      <html>
//        <head>
//          <title>Create New Sale</title>
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
//            <h2>Create New Sale</h2>
//            <div>
//              <label>Customer:</label>
//              <select id="customerName">
//                <option value="">Select Customer</option>
//                ${this.props.sale.customers.map(
//            (customer) =>
//                `<option value="${customer.name}">${customer.name}</option>`
//        )}
//              </select>
//            </div>
//            <div>
//              <label>Product:</label>
//              <select id="productName">
//                <option value="">Select Product</option>
//                ${this.props.sale.products.map(
//            (product) =>
//                `<option value="${product.name}">${product.name}</option>`
//        )}
//              </select>
//            </div>
//            <div>
//              <label>Store:</label>
//              <select id="storeName">
//                <option value="">Select Store</option>
//                ${this.props.sale.stores.map(
//            (store) =>
//                `<option value="${store.name}">${store.name}</option>`
//        )}
//              </select>
//            </div>
//            <div>
//              <label>Date Sold:</label>
//              <input type="text" id="dateSold" placeholder="YYYY-MM-DD" />
//            </div>
//            <button id="createButton">Create</button>
//            <button onclick="window.close()">Cancel</button>
//            <script>
//              // Function to handle creating a new sale in the main window and close the create popup window
//              function handleCreateSale() {
//                const customerName = document.getElementById('customerName').value;
//                const productName = document.getElementById('productName').value;
//                const storeName = document.getElementById('storeName').value;
//                const dateSold = document.getElementById('dateSold').value;

//                window.opener.postMessage(
//                  {
//                    type: 'createSale',
//                    customerName,
//                    productName,
//                    storeName,
//                    dateSold,
//                  },
//                  window.origin
//                );
//               window.close();
//              }

//              const createButton = document.getElementById('createButton');
//              createButton.addEventListener('click', handleCreateSale);

//              // Remove the event listener when the pop-up window is closed
//              window.addEventListener('beforeunload', () => {
//                createButton.removeEventListener('click', handleCreateSale);
//              });
//            </script>
//          </div>
//        </body>
//      </html>
//    `);
//    };



//    render() {
//        return (
//            <button className="ui button" onClick={this.openCreatePopup}>Create New Sale</button>
//        );
//    }
//}

//export default CreateSale;