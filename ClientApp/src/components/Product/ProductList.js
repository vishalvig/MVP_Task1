import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import DeleteSalePopup from '../DeleteSalePopup';


export class ProductList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            products: [], loading: true,
            editingProductId: null,
            error: null,
            showCreatePopup: false,
            showDeletePopup: false, 
            productToDeleteId: null,
            sales: [],
            isEditPopupVisible: false,
        };
        this.handleSave = this.handleSave.bind(this);
    }
    openCreatePopup = () => {
        const createProduct = new CreateProduct();
        createProduct.openCreatePopup();
    };

    openEditPopup = (productId, initialName, initialPrice) => {
        this.setState({
            editingProductId: productId,
            editedName: initialName,
            editedPrice: initialPrice,
            isEditPopupVisible: true,
        });
    };

    closeEditPopup = () => {
        this.setState({
            editingProductId: null,
            editedName: '',
            editedPrice: '',
            isEditPopupVisible: false,
        });
    };
    openEditWindow = (product) => {
        console.log(product)
        const { id: productId, name: productName, price: productPrice } = product;
        this.setState({
            showEditPopup: true,
            editingProductId: productId,
            editedName: productName,
            editedPrice: productPrice,
        });
        console.log(productId, productName, productPrice)

    };

    componentDidMount() {
        this.fetchSales()
            .then(() => this.populateProductData())
            .catch(error => {
                console.error('Error fetching sales data:', error);
                // Handle error appropriately
            });
        window.addEventListener('message', this.handlePopupMessage);
    }

    

    renderProductTable(Products, handleEdit, handleDelete, handleSave) {
        return (
            <table className="ui celled table" aria-labelledby="tabellabel">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Price($)</th>
                        <th>Edit Item</th>
                        <th>Delete Item</th>
                    </tr>
                </thead>
                <tbody>
                    {Products.map(product =>
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price.toFixed(2)}</td>
                            <td>
                                <button className="ui yellow button" onClick={() => this.openEditPopup(product.id, product.name, product.price)

                                }><i className="pencil icon"></i>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button className="ui red button" onClick={() => this.openDeletePopup(product.id)}><i className="trash icon"></i>
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
        const { loading, products, editingProductId, error, showEditPopup, editedName, editedPrice, productToDeleteId, isEditPopupVisible } = this.state;
        let contents = loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
            this.renderProductTable(products, this.openEditWindow, this.handleDelete)
        );

        return (
            <div>
                <h1 id="tabelLabel" >Product List</h1>
                <CreateProduct product={{ products }} handleCreateProduct={this.handleCreateProduct} onProductCreated={this.handleProductCreated} />
                
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
                    productId={productToDeleteId}
                    onCancel={this.closeDeletePopup}
                    onConfirmDelete={this.handleConfirmDelete}
                />
                {isEditPopupVisible && (
                    <EditProduct
                        productId={editingProductId}
                        initialName={editedName}
                        initialPrice={editedPrice}
                        onSave={this.handleSave}
                        onCancel={this.closeEditPopup}
                    />
                )}
                              
            </div>
        );
    }

    handlePopupMessage = (event) => {
        const { type, productId: eventId, name, price } = event.data;
        if (type === 'createProduct') {
            this.handleCreateProduct(name, price);
        } else if (type === 'updateProduct') {

            const updatedProductData = {
                productId: eventId,
                name,
                price
            };
            console.log("type:", type, "id:", eventId)
            this.handleEdit(updatedProductData)
            console.log('updated Product data: ', updatedProductData);
        }
    };

    handleEdit = ({ productId, name: productName, price: productPrice }) => {
        
        this.setState({
            editingProductId: productId,
            editedName: productName,
            editedPrice: productPrice,
        }, () => {
         
            this.handleSave();
        });
    };

    handleSave = async (editingProductId, editedName, editedPrice) => {


        console.log(editedName);
        console.log(editedPrice);
      
        try {
            const response = await fetch(`api/products/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingProductId,
                    name: editedName,
                    price: editedPrice,
                }),
            });

            if (response.ok) {
                console.log(`Product with ID ${editingProductId} updated.`);
                this.populateProductData();
                this.closeEditPopup();
               
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to update product.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }


    };

    handleProductCreated = () => {
        
        this.populateProductData();
    };
    

    async fetchSales() {
        console.log('Called fetchSales method');
        const response = await fetch('api/sales');
        console.log(response);
        const data = await response.json();
        console.log("fetchSales: ", data);
        this.setState({ sales: data, loading: false });
    }
    openDeletePopup = (productId) => {
        console.log("Opening delete popup");
        console.log(productId);
        this.setState({ showDeletePopup: true, productToDeleteId: productId }, () => {
            console.log(this.state.productToDeleteId)
        });
        
    };
    closeDeletePopup = () => {
        this.setState({ showDeletePopup: false, productToDeleteId: null });
    };

    

    handleConfirmDelete = async (saleId, productId) => {
        //console.log(this.state.sale.ProductId);
        const dataExist = this.state.sales.find((sale) => sale.productId === productId);
        console.log('Sales data:', this.state.sales);
        console.log(dataExist);
        if (dataExist) {

            // Open a new window with the popup content
            const popupWindow = window.open('', '_blank', 'width=400,height=200');

            popupWindow.document.write(`
       <html>
          <head>
            <title>Delete Failed</title>
            <link rel="stylesheet" type="text/css" href="/Customer/Popup.css">
          </head>
          <body>
            <h2>Delete Failed</h2>
            <p>Failed to delete this product. The product may have existing sale records.</p>
            <script>
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
    `);

            popupWindow.document.close();
            return {};
        }
       
        try {
            console.log(productId);
            const response = await fetch(`api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(`Product with ID ${productId} deleted.`);
                this.populateProductData();
                this.closeDeletePopup();
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to delete product.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error.message);
            this.setState({ error: error.message });
        }
    };



    async populateProductData() {
        console.log('Called Api');
        const response = await fetch('api/products');
        console.log(response);
        const data = await response.json();
        console.log(data);
        this.setState({ products: data, loading: false });

    }
}
export default ProductList;