
function kot() {
    return (
        <div id="invoice-POS">
            <center id="top">
                <div class="logo"></div>
                <div class="info">
                    <h2>SBISTechs Inc</h2>
                </div>
            </center>

            <div id="mid">
                <div class="info">
                    <h2>Contact Info</h2>
                    <p>
                        <br>Address : street city, state 0000</br>
                        <br>Email   : JohnDoe@gmail.com</br>
                        <br>Phone   : 555-555-5555</br>
                    </p>
                </div>
            </div>

            <div id="bot">

                <div id="table">
                    <table>
                        <tr class="tabletitle">
                            <td class="item"><h2>Item</h2></td>
                            <td class="Hours"><h2>Qty</h2></td>
                            <td class="Rate"><h2>Amount</h2></td>
                        </tr>
                    </table>
                </div>

                <div id="legalcopy">
                    <p class="legal"><strong>Thank you for your business!</strong>  Payment is expected within 31 days; please process this invoice within that time. There will be a 5% interest charge per month on late invoices.
                    </p>
                </div>

            </div>
        </div>

    )
}

export default kot;