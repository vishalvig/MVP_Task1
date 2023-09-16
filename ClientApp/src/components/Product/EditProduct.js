﻿import React, { Component } from 'react';
import '../popup.css';
import 'semantic-ui-css/semantic.min.css';

class EditProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedName: props.initialName,
            editedPrice: props.initialPrice,
        };
    }

    handleNameChange = (e) => {
        this.setState({ editedName: e.target.value });
    };

    handlePriceChange = (e) => {
        this.setState({ editedPrice: e.target.value });
    };

    handleSave = () => {
        const { onSave, productId } = this.props;
        const { editedName, editedPrice } = this.state;
        console.log(productId, editedName, editedPrice);
        onSave(productId, editedName, editedPrice);

    };

    render() {
        const { onCancel } = this.props;
        const { editedName, editedPrice } = this.state;

        return (
            <div className="popup">
                <div className="popup-content">
                    <h2>Edit Product</h2>
                    <div>
                        <label>Product Name: </label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={this.handleNameChange}
                        /></div><div>
                        <label>Product Price : </label>
                        <input
                            type="text"
                            value={editedPrice}
                            onChange={this.handlePriceChange}
                        /></div>
                    <button className="ui blue button" onClick={this.handleSave}>Update</button>
                    <button className="ui red button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default EditProduct;

//import React, { Component } from 'react';

//export class EditProduct extends Component {
//    componentDidMount() {
//        window.addEventListener('message', this.handlePopupMessage);
//        this.openEditWindow();
//    }

//    componentWillUnmount() {
//        window.removeEventListener('message', this.handlePopupMessage);
//    }

//    openEditWindow2 = (productId, productName, productPrice) => {


//        // Open a new window
//        const windowWidth = 400;
//        const windowHeight = 300;
//        const left = (window.screen.width - windowWidth) / 2;
//        const top = (window.screen.height - windowHeight) / 2;

//        const editWindow = window.open('', '_blank', `width=${windowWidth}, height=${windowHeight}, left=${left}, top=${top}`);



//        // Write the content of the new window
//        editWindow.document.write(`
//      <html>
//        <head>
//          <title>Edit Product</title>
         
//          <style>
//            /* Styles for the edit window */
//            body {
//              font-family: 'Segoe UI', sans-serif;
//              background-color: #f9f9f9;
//              padding: 20px;
//            }
            
//            h2 {
//              font-size: 24px;
//              margin-bottom: 20px;
//            }
            
//            input {
//              width: 100%;
//              padding: 10px;
//              margin-bottom: 10px;
//            }
            
//            button {
//              margin-right: 10px;
//            }
//          </style>
//        </head>
//        <body>
//          <h2>Edit Product</h2>
//          <input
//            type="text"
//            id = "nameInput"
//            value="${productName}"
           
//          />
//          <input
//            type="text"
//            id ="priceInput"
//            value="${productPrice}"
            
//          />
//          <button id="saveButton">Save</button>
//          <button onclick="window.close()">Cancel</button>
//          <script>
//            // Function to update the edited name in the main window
//             function handleEdit() {
//            // Get the edited values from the inputs and call the appropriate functions in the main window
//            const nameInput = document.getElementById('nameInput').value;
//            const priceInput = document.getElementById('priceInput').value;

//            window.opener.postMessage(
//              { type: 'updateProduct',
//                productId:${productId},
//                name: nameInput,
//                price: priceInput },
//              window.origin
//            );
//            window.close();
//          }
//          document.getElementById('saveButton').addEventListener('click', handleEdit);
//          </script>
//        </body>
//      </html>
//    `);
//    };

//    render() {
//        return null; // Since this is a popup window, return null as we don't need to render anything
//    }
//}

//export default EditProduct;