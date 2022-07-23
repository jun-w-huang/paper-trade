import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
 const [form, setForm] = useState({
   symbol: "",
   quantity: "",
   pricePurchased: "",
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newStock = { ...form };
   console.log(newStock)
   console.log(JSON.stringify(newStock))
 
   await fetch("http://localhost:5000/stocks/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newStock),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ symbol: "", quantity: ""});
   navigate("/");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Stock</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="symbol">Symbol</label>
         <input
           type="text"
           className="form-control"
           id="symbol"
           value={form.symbol}
           onChange={(e) => updateForm({ symbol: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="quantity">Quantity</label>
         <input
           type="text"
           className="form-control"
           id="quantity"
           value={form.quantity}
           onChange={(e) => updateForm({ quantity: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Create person"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}