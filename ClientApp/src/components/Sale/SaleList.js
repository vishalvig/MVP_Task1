import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateSale from './CreateSale';
import EditSale from './EditSale';
import DeleteSalePopup from '../DeleteSalePopup';


export class SaleList extends Component {
        constructor(props) {
        super(props);
        this.state = {
            sales: [],
            loading: true,
            editingSaleId: null,
            editedCustomerName: '',
            editedProductName: '',
            editedStoreName: '',
            editedDateSold: '',
            editingSale: null,
            error: null,
            isPopupOpen: false,
            customers: [],
            products: [],
            stores: [],
            currentPage: 1, // Current page number
            itemsPerPage: 7, // Number of items to display per page
            showDeletePopup: false, 
            saleToDeleteId: null,
        };
       // this.handleSave = this.handleSave.bind(this);
    }


    openCreatePopup = () => {
        console.log("opencreatepopup")
        this.setState({ showCreatePopup: true });
    };

    closeCreatePopup = () => {
        this.setState({ showCreatePopup: false });
    };

    
    openEditWindow = (sale) => {
       
        this.setState({ editingSale: sale });

    };

    componentDidMount() {
        this.populateSaleData();
       // window.addEventListener('message', this.handlePopupMessage);
    }
    handlePopupMessage = (event) => {
        const { type, saleId: eventId, customerName, productName, storeName, dateSold } = event.data;
        if (type === 'createSale') {
            const newSale = {
                customerName,
                productName,
                storeName,
                dateSold,
            };
            console.log('newSale:', newSale);
            this.handleCreateSale(newSale);
        } else if (type === 'updateSale') {
            const updatedSaleData = {
                saleId: eventId,
                customerName,
                productName,
                storeName,
                dateSold
            };
            console.log('updated:', updatedSaleData);
            console.log('Updated sale data:', updatedSaleData);
            this.handleSave(updatedSaleData);
        }

    };

    handleSaleCreated = () => {
       
        this.populateSaleData();
    };

    

    //handleEdit = (saleId, customerName, productName, storeName, dateSold) => {

    //    this.setState({
    //        editingSaleId: saleId,
    //        editedCustomerName: customerName,
    //        editedProductName: productName,
    //        editedStoreName: storeName,
    //        editedDateSold: dateSold,

    //    });

    //};



    handleSave = async (xxx) => {
        console.log('handlesave being called')
        
    };
    openDeletePopup = (saleId) => {
        console.log("Opening delete popup");
        this.setState({ showDeletePopup: true, saleToDeleteId: saleId });
    };
    closeDeletePopup = () => {
        this.setState({ showDeletePopup: false, saleToDeleteId: null });
    };

       
        handlePageChange = (newPage) => {
            this.setState({ currentPage: newPage });
        };

        handleConfirmDelete = async (saleId) => {
            // Make an API request to delete the sale
            try {
                const response = await fetch(`api/sales/${saleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    console.log(`Sale with ID ${saleId} deleted.`);
                    this.populateSaleData();
                    this.closeDeletePopup();
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Failed to delete sale.';
                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Error:', error.message);
                this.setState({ error: error.message });
            }
        };


        renderSaleTable(Sales) {
            return (
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>StoreName</th>
                            <th>DateSold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Sales.map(sale =>
                            <tr key={sale.id}>
                                <td>{sale.customerName}</td>
                                <td>{sale.productName}</td>
                                <td>{sale.storeName}</td>
                                <td>{sale.dateSold}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }

        render() {
            const {
                loading,
                sales,
                editingSale,
                customers,
                products,
                stores,
                currentPage, // Add currentPage to state
                itemsPerPage,
                saleToDeleteId,
            } = this.state;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const salesToDisplay = sales.slice(startIndex, endIndex);
            if (loading) {
                return <div>Loading...</div>;
            }


            return (
                <div>
                    <h1 id="tabelLabel" >Sales List</h1>
                    <p>Sales List</p>
                   
                    <CreateSale sale={{ customers, products, stores }} handleCreateSale={this.handleCreateSale} onSaleCreated={this.handleSaleCreated} />
                    {/*<EditSale ref={(editSale) => (this.editSale = editSale)} refreshSaleData={this.handleSaleCreated} />*/}
                    <table className="ui celled table" aria-labelledby="tabellabel">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Product Name</th>
                                <th>Store Name</th>
                                <th>Date Sold</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesToDisplay.map((sale) => (
                                <tr key={sale.id}>
                                    <td>{sale.customerName}</td>
                                    <td>{sale.productName}</td>
                                    <td>{sale.storeName}</td>
                                    <td>{sale.dateSold ? new Date(sale.dateSold).toLocaleDateString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</td>
                                    <td>
                                        <button className="ui yellow button" color="blue" onClick={() => this.openEditWindow(sale)}><i className="pencil icon"></i>Edit</button>
                                        <button className="ui red button" color="red" onClick={() => this.openDeletePopup(sale.id)}><i className="trash icon"></i>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div className="pagination">
                        <span>Page {currentPage}</span>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => this.handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <button
                            disabled={endIndex >= sales.length}
                            onClick={() => this.handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                    
                    <DeleteSalePopup
                        isVisible={this.state.showDeletePopup}
                            saleId={saleToDeleteId}
                            onCancel={this.closeDeletePopup}
                            onConfirmDelete={this.handleConfirmDelete}
                        />
                    
                    {editingSale && (
                        <EditSale
                           
                            isPopupOpen={true} // Open the edit popup
                            saleId={editingSale.id}
                            customerName={editingSale.customerName}
                            productName={editingSale.productName}
                            storeName={editingSale.storeName}
                            dateSold={editingSale.dateSold}
                            //onCancel={() => this.handleCancelEdit()}
                            onCancel={() => this.setState({ isPopupOpen: false })}
                            populateSaleData={() => this.populateSaleData()}
                            onSave={(updatedSaleData) => this.handleSave(updatedSaleData)}
                        
                        />
                    )}

                </div>
            );
        }

    async populateSaleData() {
            try {
                const response = await fetch('api/sales');
                const data = await response.json();
                this.setState({ sales: data, loading: false });

                const customerResponse = await fetch('api/customers');
                const productResponse = await fetch('api/products');
                const storeResponse = await fetch('api/stores');

                const customerData = await customerResponse.json();
                const productData = await productResponse.json();
                const storeData = await storeResponse.json();

                this.setState({
                    customers: customerData,
                    products: productData,
                    stores: storeData,
                });
            } catch (error) {
                this.setState({ error: error.message });
            }
        }

    }
export default SaleList;