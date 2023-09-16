import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import '../popup.css'


class CreateStore extends Component {
    state = {
        isPopupOpen: false,
        storeName: '',
        storeAddress: '',
        stores: [],
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

    handleCreateStore = async () => {
        const { storeName, storeAddress } = this.state;
        if (!storeName || !storeAddress) {
            console.error('Store Name and Store Address are required.');
            return; // Exit the function without making the API request
        }
        const storeData = {

            Name: storeName,
            Address: storeAddress,

        };

        // Make an API request to create the sale
        try {

            const response = await fetch('api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            });

            if (response.ok) {

                console.log('New store created');
                this.closeCreatePopup();
                const newStore = await response.json();
                const updatedStore = [...this.state.stores, newStore];
                this.setState({
                    stores: updatedStore, // Assuming you have a "sales" state variable

                    storeName: '',
                    storeAddress: '',
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
        const { isPopupOpen, storeName, storeAddress } = this.state;


        return (
            <div>
                <button className="ui blue button" onClick={this.openCreatePopup}>Create New Store</button>
                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-content">

                            <h2>Create New Store</h2>
                            <div>
                                <label>Store Name:</label>
                                <input class="ui input focus"
                                    type="text"
                                    id="storeName"
                                    placeholder="Store Name"
                                    value={storeName}
                                    onChange={this.handleInputChange}
                                />

                            </div>
                            <div>
                                <label>Store Address:</label>
                                <input
                                    class="ui input focus"
                                    type="text"
                                    id="storeAddress"
                                    placeholder="Store Address"
                                    value={storeAddress}
                                    onChange={this.handleInputChange}
                                />
                            </div>

                            <button className="ui blue button" onClick={this.handleCreateStore}>Create</button>
                            <button className="ui red button" onClick={this.closeCreatePopup}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default CreateStore;

//export class CreateStore extends Component {
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
//          <title>Create New Store</title>
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
//            <h2>Create New Store</h2>
//            <input type="text" id="storeName" placeholder="Store Name" />
//            <input type="text" id="storeAddress" placeholder="Store Address" />
//            <button id="createButton">Create</button>
//            <button onclick="window.close()">Cancel</button>
//            <script>
//              // Function to handle creating a new store in the main window and close the create popup window
//              function handleCreateStore() {
//                const storeName = document.getElementById('storeName').value;
//                const storeAddress = document.getElementById('storeAddress').value;
//                window.opener.postMessage(
//                  { type: 'createStore', name: storeName, address: storeAddress },
//                  window.origin
//                );
//                window.close();
//              }

//              document.getElementById('createButton').addEventListener('click', handleCreateStore);
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
//export default CreateStore;