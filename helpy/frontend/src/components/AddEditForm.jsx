import React from 'react';

const AddEditForm = ({setAd, ad, setFile}) => {
    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAd({ ...ad, [name]: value });
    };

    return (
        <form>
            <div className="form-group">
                <label htmlFor="title">Image</label>
                <input
                    type="file"
                    className="form-control"
                    id="file"
                    required
                    onChange={selectFile}
                    name="file"
                />
            </div>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={ad.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={ad.description}
                    onChange={handleInputChange}
                />
            </div>
        </form>
    );
};

export default AddEditForm;