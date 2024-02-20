import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "",
        new_price: "",
        old_price: ""
    });
    const [errors, setErrors] = useState({}); 

    // Function to handle image selection
    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    // Function to handle input changes and validate the form
    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProductDetails({ ...productDetails, [name]: value });
        // Validate required fields
        if (value.trim() === "") {
            setErrors({ ...errors, [name]: `${name} is required` });
        } else {
            setErrors({ ...errors, [name]: "" });
        }
    }

    // Function to add product
    const Add_Product = async () => {
        // Check if any validation errors exist
        if (Object.values(errors).some(error => error !== "")) {
            alert("Please fill out all required fields.");
            return;
        }

        let responseData;
        let product = { ...productDetails };

        if (image) {
            let formData = new FormData();
            const timestamp = Date.now(); // Generate a unique timestamp
            const filename = `${timestamp}_${image.name}`; // Unique filename
            formData.append('product', image, filename);
    
            await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
            }).then((resp) => resp.json()).then((data) => {
                responseData = data;
            });
    
            if (responseData && responseData.success) {
                product.image = responseData.image_url;
            }
        }

        await fetch('http://localhost:4000/addproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        }).then((resp) => resp.json()).then((data) => {
            if (data.success) {
                alert("Product Added");
                // Clear form fields and image after successful addition
                setProductDetails({
                    name: "",
                    image: "",
                    category: "",
                    new_price: "",
                    old_price: ""
                });
                setImage(null);
            } else {
                alert("Failed");
            }
        });
    }

    return (
        <div className="addproduct">
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Type here" />
                <div className="error">{errors.name}</div> {/* Error message for name field */}
            </div>
            <div className="addproduct-itemfield">
                <p>Price</p>
                <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Type here" />
                <div className="error">{errors.old_price}</div> {/* Error message for old_price field */}
            </div>
            <div className="addproduct-itemfield">
                <p>Offer Price</p>
                <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Type here" />
                <div className="error">{errors.new_price}</div> {/* Error message for new_price field */}
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className="add-product-selector">
                    <option value="">Select category</option>
                    <option value="Standard Skateboard">Standard Skateboard</option>
                    <option value="Longboard">Longboard</option>
                    <option value="Cruiser">Cruiser</option>
                </select>
                <div className="error">{errors.category}</div> {/* Error message for category field */}
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} className="addproduct-thumnail.img" alt="" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
                <div className="error">{errors.image}</div> {/* Error message for image field */}
            </div>

            <button onClick={Add_Product} className="addproduct-btn">ADD</button>
        </div>
    );
};

export default AddProduct;
