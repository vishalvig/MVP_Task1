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
     
        const { id, value } = event.target;
        console.log(`Updating state for ${id}: ${value}`);
        this.setState({ [id]: value });
    };

    handleCreateStore = async () => {
        const { storeName, storeAddress } = this.state;
        if (!storeName || !storeAddress) {
            console.error('Store Name and Store Address are required.');
            return; 
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
                    stores: updatedStore, 

                    storeName: '',
                    storeAddress: '',
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

