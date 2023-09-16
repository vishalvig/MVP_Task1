import React, { Component } from 'react';
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

