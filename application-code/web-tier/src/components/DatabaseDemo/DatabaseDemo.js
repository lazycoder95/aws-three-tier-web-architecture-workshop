
    import React, {Component} from 'react';
    import './DatabaseDemo.css';
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://backend:4000";
    fetch(`${backendUrl}/api/test`)
    .then(response => response.json())
    .then(data => console.log(data))
     .catch(error => console.error("Error fetching data:", error));
     console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);
    class DatabaseDemo extends Component {
     
        constructor(props) {
            super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
            this.handleTextChange = this.handleTextChange.bind(this);
            this.handleButtonClick = this.handleButtonClick.bind(this);
            this.handleButtonClickDel = this.handleButtonClickDel.bind(this);
            this.handleButtonClickDelAll = this.handleButtonClickDelAll.bind(this);
            this.state = { 
               transactions: [],
               text_amt: "",
               text_desc:""
            }
         }

         componentDidMount() {
            this.populateData();
          }

        populateData(){
            this.fetch_retry(`/transaction`,3)
            .then(res => res.json())
            .then((data) => {
              this.setState({ transactions : data.result });
              console.log("state set");
              console.log(this.state.transactions);
            })
            .catch(console.log);
        }  

        async fetch_retry(url, n){
            try {
                return await fetch(url)
            } catch(err) {
                if (n === 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 10000)); 
                return await this.fetch_retry(url, n - 1);
            }
        };


        renderTableData() {
            return this.state.transactions.map((transaction, index) => {
                const { id, amount, description } = transaction; // Destructure transaction object
                return (
                    <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{amount}</td>
                        <td>{description}</td>
                        <td>
                            <button onClick={() => this.handleButtonClickDel(id)}>Delete</button>
                        </td>
                    </tr>
                );
            });
        }

        handleButtonClickDelAll(){
           const requestOptions = {
               method: 'DELETE'
           }
           fetch(`/transaction`, requestOptions)
           .then(response => response.json())
           .then(data => this.populateData())

           this.setState({text_amt : "", text_desc:"",transaction:[]});

        }

        handleButtonClickDel(id) {
            const requestOptions = {
                method: 'DELETE'
            };
            fetch(`/transaction/${id}`, requestOptions)
            .then(response => response.json())
            .then(() => this.populateData())  // Refresh the transaction list
            .catch(error => console.error("Error deleting transaction:", error));
        }

         handleButtonClick(){
             console.log(this.state.text_amt);
             console.log(this.state.text_desc);
            const amount = parseFloat(this.state.text_amt);
            const description = this.state.text_desc;
            if (isNaN(amount)) {
                alert("Amount must be a valid number!");
                return;
            }
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({"amount":this.state.text_amt, "desc" :this.state.text_desc})
            }
            
            fetch(`/transaction`, requestOptions)
            .then(response => response.json())
            .then(data => this.populateData())
            
            this.setState({text_amt : "", text_desc:""});

         }

         handleTextChange(e){
            this.setState({[e.target.name]:e.target.value})
         }


         render() {
            return (
                <div>
                    <h1 id="title" style={{ paddingRight: "1em" }}>
                        Aurora Database Demo Page
                    </h1>
        
                    {/* Delete All Button - Placed Right Above the Table */}
                    <input 
                        style={{ float: "right", marginBottom: "1em" }} 
                        type="button" 
                        value="Delete All" 
                        onClick={this.handleButtonClickDelAll} 
                    />
        
                    <table id="transactions">
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>AMOUNT</td>
                                <td>DESC</td>
                            </tr>
                            <tr>
                                <td>
                                    <input 
                                        type="button" 
                                        value="ADD" 
                                        onClick={this.handleButtonClick} 
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        name="text_amt" 
                                        value={this.state.text_amt} 
                                        onChange={this.handleTextChange} 
                                    />
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        name="text_desc" 
                                        value={this.state.text_desc} 
                                        onChange={this.handleTextChange} 
                                    />
                                </td>
                            </tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
    export default DatabaseDemo;