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
            customers: [], // Add state variables for customers, products, and stores
            products: [],
            stores: [],
        };
    }
    async componentDidMount() {
        // Fetch customer, product, and store data here
        try {
            const customersResponse = await fetch('api/customers');
            const productsResponse = await fetch('api/products');
            const storesResponse = await fetch('api/stores');

            if (customersResponse.ok && productsResponse.ok && storesResponse.ok) {
                const customersData = await customersResponse.json();
                const productsData = await productsResponse.json();
                const storesData = await storesResponse.json();

                // Update state with fetched data
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
    openEditPopup = (saleId, customerName, productName, storeName, dateSold) => {
        this.setState({
            isPopupOpen: true,
            saleId,
            customerName,
            productName,
            storeName,
            dateSold,
        });
    };

    closeEditPopup = () => {
        this.setState({
            isPopupOpen: false,
            saleId: '',
            customerName: '',
            productName: '',
            storeName: '',
            dateSold: '',
        });
    };

    handleInputChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    //handleUpdateSale = async () => {
    //    const { saleId, customerName, productName, storeName, dateSold } = this.state;

    //    const saleData = {
    //        customerName,
    //        productName,
    //        storeName,
    //        dateSold,
    //    };
    //    console.log(saleData);
    //    try {
    //        const response = await fetch(`api/sales/${saleId}`, {
    //            method: 'PUT',
    //            headers: {
    //                'Content-Type': 'application/json',
    //            },
    //            body: JSON.stringify(saleData),
    //        });
    handleUpdateSale = async (xxx) => {
                console.log('handlesave being called')
                //const {
                //    editingSaleId,
                //    editedCustomerName,
                //    editedProductName,

                //    editedStoreName,
                //    editedDateSold,
                //} = this.state;

                const updatedSale = {
                    id: xxx.saleId,
                    customerName: xxx.customerName,
                    productName: xxx.productName,
                    storeName: xxx.storeName,
                    dateSold: xxx.dateSold,
                };

                console.log('xxx: ', xxx);
                //console.log('Updated sale:',
                 //   JSON.stringify({
                 //       updatedSale
                   // }));

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
                this.closeEditPopup();

                // You can perform any additional actions here after a successful update
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

//export class EditSale extends Component {
//    componentDidMount() {
//        window.addEventListener('message', this.handlePopupMessage);
//    }

//    componentWillUnmount() {
//        window.removeEventListener('message', this.handlePopupMessage);
//    }


//    openEditWindow2 = (saleId, customerName, productName, storeName, dateSold) => {
//        console.log("openeditwindow-child", saleId, customerName, productName, storeName, dateSold)
//        //console.log("openeditwindow-child2", saleId, customers, products, stores, dateSold)
//        console.log("props-cust", this.props.customers)
//        console.log("props-products", this.props.products)

//        const custId = this.props.customers.map((customer) => customer.id)
//        const custName = this.props.customers.map((customer) => customer.name)
//        console.log(custId)
//        console.log(custName)

//        const windowWidth = 400;
//        const windowHeight = 300;
//        const left = (window.screen.width - windowWidth) / 2;
//        const top = (window.screen.height - windowHeight) / 2;

//        const editWindow = window.open('', '_blank', `width=${windowWidth}, height=${windowHeight}, left=${left}, top=${top}`);



//        const customerOptions = this.props.customers.map((customer) => (
//            `<option key="${customer.id}" value="${customer.name}">
//    ${customer.name}
//  </option>`
//        ));

//        const productOptions = this.props.products.map((product) => (
//            `<option key="${product.id}" value="${product.name}">
//    ${product.name}
//  </option>`
//        ));

//        const storeOptions = this.props.stores.map((store) => (
//            `<option key="${store.id}" value="${store.name}">
//    ${store.name}
//  </option>`
//        ));


//        // Write the content of the new window
//        editWindow.document.write(`
//            <html>
//        <head>
//          <title>Edit Sale</title>
//          <style>
//            /* Additional custom styles for the edit popup window */
//            body {
//              font-family: 'Segoe UI', sans-serif;
//              background-color: #f9f9f9;
//              padding: 20px;
//            }

//            h2 {
//              font-size: 24px;
//              margin-bottom: 20px;
//            }

//            .form-container {
//              background-color: #fff;
//              border: 1px solid #ddd;
//              padding: 20px;
//            }

//            .form-container select,
//            .form-container input {
//              width: 100%;
//              padding: 10px;
//              margin-bottom: 10px;
//            }

//            .form-container button {
//              margin-right: 10px;
//            }
//          </style>
//        </head>
//                <body>

//          <div class="form-container">
//            <h2>Edit Sale</h2>
//            <div>
//              <label>Customer:</label>
//             <select id="customerName">
//        <option value="">Select Customer</option>
//        ${customerOptions}
//      </select>


//              </select>
//            </div>
//            <div>
//              <label>Product:</label>
//              <select id="productName">
//                <option value="">Select Product</option>
//              ${productOptions}</option>
//)}

//              </select>
//            </div>
//            <div>
//              <label>Store:</label>
//              <select id="storeName">
//                <option value="">Select Store</option>
//               ${storeOptions}</option>
//)}

//              </select>
//            </div>
//            <div>
//              <label>Date Sold:</label>
//              <input type="text" id="dateSold" placeholder="YYYY-MM-DD" />
//            </div>
//            <button id="saveButton">Save</button>
//            <button onclick="window.close()">Cancel</button>
//          </div>
//          <script>

//          function handleSave() {
//              const customerName = document.getElementById('customerName').value;
//              const productName = document.getElementById('productName').value;
//              const storeName = document.getElementById('storeName').value;
//              const dateSold = document.getElementById('dateSold').value;

//              window.opener.postMessage(
//                {
//                  type: 'updateSale',
//                  saleId: ${(saleId)},
//                  customerName: customerName,
//                  productName: productName,
//                  storeName: storeName,
//                  dateSold: dateSold,
//                },
//                window.origin
//              );
//              window.close();
//            };

//            document.getElementById('saveButton').addEventListener('click', handleSave);

//            const customerNameSelect = document.getElementById('customerName');
//            customerNameSelect.value = "${customerName}";


//            const productNameSelect = document.getElementById('productName');
//            productNameSelect.value = "${productName}";


//            const storeNameSelect = document.getElementById('storeName');
//            storeNameSelect.value = "${storeName}";


//            const dateSoldInput = document.getElementById('dateSold');
//            dateSoldInput.value = "${dateSold}";


//          </script>
//        </body>
//              </html>
//    `);
//    };

//    render() {
//        return null;
//    }
//}
//export default EditSale;