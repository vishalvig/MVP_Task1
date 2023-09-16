﻿import React from 'react';
import './popup.css'
import 'semantic-ui-css/semantic.min.css';
const DeleteSalePopup = ({ saleId, isVisible, onCancel, onConfirmDelete, productId }) => {
    if (!isVisible) {
        return null; // Render nothing if isVisible is false
    }

    return (
        <div className="popup">
            <div className="popup-content">
            <h2>Delete Sale</h2>
            <p>Are you sure you want to delete this ?</p>
            
                <button className="ui red button" onClick={() => onConfirmDelete(saleId, productId)}>
                    Yes
                </button>
                <button className="ui blue button" onClick={onCancel}>
                    No
                </button>
                
            </div>
        </div>
    );
};

export default DeleteSalePopup;


//export function generateDeleteWindowContent(saleId) {
//    return `
//    <html>
//      <head>
//        <style>
//          /* Styles for the delete window */
//          ${`
//            body {
//              font-family: 'Segoe UI', sans-serif;
//              background-color: #f9f9f9;
//              padding: 20px;
//            }

//            h2 {
//              font-size: 24px;
//              margin-bottom: 20px;
//            }

//            p {
//              margin-bottom: 20px;
//            }

//            .ui.button {
//              margin-right: 10px;
//            }
//          `}
//        </style>
//      </head>
//      <body>
//        <div class="ui segment">
//          <h2 class="ui header">Delete Sale</h2>
//          <p>Are you sure you want to delete this sale?</p>
//          <button class="ui primary button" id="confirmDeleteButton">Yes</button>
//          <button class="ui button" id="cancelDeleteButton">No</button>
//          <script>
//            const confirmDeleteButton = document.getElementById('confirmDeleteButton');
//            const cancelDeleteButton = document.getElementById('cancelDeleteButton');

//            confirmDeleteButton.addEventListener('click', () => {
//              window.opener.confirmDeleteSale(${saleId});
//              window.close();
//            });

//            cancelDeleteButton.addEventListener('click', () => {
//              window.close();
//            });

//          </script>
//        </div>
//      </body>
//    </html>
//  `;
//}