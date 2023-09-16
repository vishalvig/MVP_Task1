import React, { Component } from 'react';
import '../popup.css';
import 'semantic-ui-css/semantic.min.css';

class EditCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedName: props.initialName,
            editedAddress: props.initialAddress,
        };
    }

    handleNameChange = (e) => {
        this.setState({ editedName: e.target.value });
    };

    handleAddressChange = (e) => {
        this.setState({ editedAddress: e.target.value });
    };

    handleSave = () => {
        const { onSave, customerId } = this.props;
        const { editedName, editedAddress } = this.state;
        console.log(customerId,editedName, editedAddress);
        onSave(customerId, editedName, editedAddress);

    };

    render() {
        const { onCancel } = this.props;
        const { editedName, editedAddress } = this.state;

        return (
            <div className="popup">
                <div className="popup-content">
                    <h2>Edit Customer</h2>
                    <div>
                        <label>Customer Name: </label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={this.handleNameChange}
                        /></div><div>
                        <label>Customer Address : </label>
                        <input
                            type="text"
                            value={editedAddress}
                            onChange={this.handleAddressChange}
                        /></div>
                    <button className="ui blue button" onClick={this.handleSave}>Update</button>
                    <button className="ui red button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default EditCustomer;